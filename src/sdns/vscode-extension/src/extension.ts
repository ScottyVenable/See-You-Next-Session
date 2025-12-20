import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

// SDNS Language Constants
const SPEAKERS = ['PATIENT', 'THERAPIST', 'NARRATOR', 'SYSTEM'];

const MOODS = [
    'neutral', 'nervous', 'anxious', 'guarded', 'hesitant', 'vulnerable',
    'defensive', 'thoughtful', 'sad', 'angry', 'relieved', 'confused',
    'hopeful', 'embarrassed', 'frustrated', 'exhausted', 'desperate',
    'intense', 'quietly', 'honest', 'sighing', 'seeking validation',
    'hedging', 'dismissive', 'reconsidering', 'defensive at first',
    'overwhelmed', 'distressed'
];

const CONTROL_DIRECTIVES = ['@if', '@elseif', '@else', '@endif', '@when', '@end'];

const ACTION_DIRECTIVES = [
    { name: '@reveal', description: 'Reveal a symptom, keyword, or breakthrough', insertText: '@reveal ${1:type}:${2:id}' },
    { name: '@rapport', description: 'Modify rapport value (+/-)', insertText: '@rapport ${1:+}${2:5}' },
    { name: '@focus', description: 'Modify focus/attention value (+/-)', insertText: '@focus ${1:+}${2:10}' },
    { name: '@pause', description: 'Pause for dramatic effect (seconds)', insertText: '@pause ${1:1}' },
    { name: '@set', description: 'Set a game state variable', insertText: '@set ${1:variable} = ${2:value}' },
    { name: '@unlock', description: 'Unlock a topic, response, or breakthrough', insertText: '@unlock ${1:type}:${2:id}' },
    { name: '@trigger', description: 'Trigger a game event', insertText: '@trigger ${1:event-name}' }
];

const BUILT_IN_FUNCTIONS = [
    { name: 'has_keyword', description: 'Check if a keyword has been discovered', insertText: 'has_keyword("${1:keyword-id}")' },
    { name: 'has_symptom', description: 'Check if a symptom has been revealed', insertText: 'has_symptom("${1:symptom-id}")' },
    { name: 'has_breakthrough', description: 'Check if a breakthrough occurred', insertText: 'has_breakthrough("${1:breakthrough-id}")' },
    { name: 'asked_about', description: 'Check if player asked about a topic', insertText: 'asked_about("${1:topic-id}")' }
];

const VARIABLES = ['rapport', 'focus', 'turn', 'breakthroughs'];

const METADATA_TYPES = ['symptom', 'contradicts', 'reveals', 'links', 'observation', 'keyword', 'breakthrough'];

// ============================================================================
// KEYWORD SYSTEM - Dynamic loading from JSON files
// ============================================================================

interface KeywordStyle {
    color?: string;
    bgColor?: string;
    icon?: string;
    animation?: string;
}

interface KeywordEffects {
    focusCost?: number;
    reveals?: string[];
    rapportChange?: number;
    triggers?: string[];
    setVars?: Record<string, unknown>;
    contradicts?: string[];
    unlocks?: string[];
}

interface MenuOption {
    id: string;
    label: string;
    icon?: string;
    action: string;
    params?: Record<string, unknown>;
}

interface KeywordDefinition {
    id: string;
    displayText: string;
    aliases?: string[];
    description: string;
    importance: 'low' | 'medium' | 'high' | 'critical';
    style?: KeywordStyle;
    effects?: KeywordEffects;
    menuOptions?: MenuOption[];
    note?: string;
    safety?: boolean;
}

interface KeywordCategory {
    _category: {
        label: string;
        icon?: string;
        description?: string;
    };
    [keywordId: string]: KeywordDefinition | { label: string; icon?: string; description?: string };
}

interface KeywordFile {
    source: string;
    displayName: string;
    description?: string;
    version?: string;
    patientInfo?: {
        name: string;
        diagnosis?: string;
        keyTraits?: string[];
    };
    keywords: Record<string, KeywordCategory>;
    menuOptions?: {
        default?: MenuOption[];
        contradiction?: MenuOption[];
        breakthrough?: MenuOption[];
    };
}

// Keyword database - populated from JSON files
let keywordSources: Map<string, KeywordFile> = new Map();
let allKeywords: Map<string, KeywordDefinition> = new Map();

const KEYWORD_CATEGORIES = [
    { id: 'time', label: 'Time & Duration', icon: 'calendar' },
    { id: 'emotion', label: 'Emotions', icon: 'heart' },
    { id: 'behavior', label: 'Behaviors', icon: 'activity' },
    { id: 'symptom', label: 'Symptoms', icon: 'alert-circle' },
    { id: 'relationship', label: 'Relationships', icon: 'users' },
    { id: 'cognition', label: 'Thoughts & Beliefs', icon: 'brain' },
    { id: 'background', label: 'Background & History', icon: 'book' }
];

/**
 * Load keyword definitions from JSON files
 */
function loadKeywordFiles(workspaceRoot: string): void {
    const keywordDefPath = path.join(workspaceRoot, 'src', 'data', 'keywords', 'definitions');

    keywordSources.clear();
    allKeywords.clear();

    if (!fs.existsSync(keywordDefPath)) {
        console.log('SDNS: Keyword definitions directory not found:', keywordDefPath);
        return;
    }

    const files = fs.readdirSync(keywordDefPath).filter(f => f.endsWith('.keywords.json'));

    for (const file of files) {
        try {
            const filePath = path.join(keywordDefPath, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            const keywordFile: KeywordFile = JSON.parse(content);

            keywordSources.set(keywordFile.source, keywordFile);

            // Index all keywords by their full ID
            for (const [categoryId, category] of Object.entries(keywordFile.keywords)) {
                for (const [keywordId, keyword] of Object.entries(category)) {
                    if (keywordId === '_category') continue;
                    const kw = keyword as KeywordDefinition;
                    if (kw.id) {
                        allKeywords.set(kw.id, kw);
                    }
                }
            }

            console.log(`SDNS: Loaded ${file} with source '${keywordFile.source}'`);
        } catch (err) {
            console.error(`SDNS: Error loading ${file}:`, err);
        }
    }

    console.log(`SDNS: Loaded ${keywordSources.size} keyword sources, ${allKeywords.size} total keywords`);
}

/**
 * Get all available keyword sources (patient IDs + 'generic')
 */
function getKeywordSources(): string[] {
    return Array.from(keywordSources.keys());
}

/**
 * Get categories available for a source
 */
function getCategoriesForSource(source: string): string[] {
    const file = keywordSources.get(source);
    if (!file) return [];
    return Object.keys(file.keywords);
}

/**
 * Get keywords for a specific source and category
 */
function getKeywordsForCategory(source: string, category: string): KeywordDefinition[] {
    const file = keywordSources.get(source);
    if (!file || !file.keywords[category]) return [];

    const keywords: KeywordDefinition[] = [];
    for (const [id, kw] of Object.entries(file.keywords[category])) {
        if (id !== '_category') {
            keywords.push(kw as KeywordDefinition);
        }
    }
    return keywords;
}

/**
 * Get a keyword by its full ID (source.category.keywordId)
 */
function getKeywordById(fullId: string): KeywordDefinition | undefined {
    return allKeywords.get(fullId);
}

// Legacy interface for backwards compatibility
interface LegacyKeywordDefinition {
    id: string;
    category: string;
    description: string;
    importance: string;
    effects?: string[];
}

// Convert new format to legacy format for existing code paths
function toLegacyFormat(kw: KeywordDefinition): LegacyKeywordDefinition {
    return {
        id: kw.id,
        category: kw.id.split('.')[1] || 'general',
        description: kw.description,
        importance: kw.importance,
        effects: kw.effects?.reveals
    };
}

export function activate(context: vscode.ExtensionContext) {
    console.log('SDNS Language Extension activated');

    // Create diagnostic collection for validation
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('sdns');
    context.subscriptions.push(diagnosticCollection);

    // Load keyword files from workspace
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders && workspaceFolders.length > 0) {
        loadKeywordFiles(workspaceFolders[0].uri.fsPath);

        // Watch for changes to keyword files
        const keywordWatcher = vscode.workspace.createFileSystemWatcher(
            new vscode.RelativePattern(workspaceFolders[0], 'src/data/keywords/definitions/*.keywords.json')
        );

        keywordWatcher.onDidChange(() => {
            console.log('SDNS: Keyword files changed, reloading...');
            loadKeywordFiles(workspaceFolders[0].uri.fsPath);
        });

        keywordWatcher.onDidCreate(() => {
            console.log('SDNS: New keyword file detected, reloading...');
            loadKeywordFiles(workspaceFolders[0].uri.fsPath);
        });

        keywordWatcher.onDidDelete(() => {
            console.log('SDNS: Keyword file deleted, reloading...');
            loadKeywordFiles(workspaceFolders[0].uri.fsPath);
        });

        context.subscriptions.push(keywordWatcher);

        // Watch for .keys files too
        const keysWatcher = vscode.workspace.createFileSystemWatcher(
            new vscode.RelativePattern(workspaceFolders[0], 'src/patients/**/*.keys')
        );

        keysWatcher.onDidChange((uri) => {
            console.log('SDNS: .keys file changed:', uri.fsPath);
            validateKeysFile(uri, diagnosticCollection);
        });

        keysWatcher.onDidCreate((uri) => {
            console.log('SDNS: New .keys file detected:', uri.fsPath);
            validateKeysFile(uri, diagnosticCollection);
        });

        context.subscriptions.push(keysWatcher);
    }

    // Register completion provider
    const completionProvider = vscode.languages.registerCompletionItemProvider(
        'sdns',
        new SDNSCompletionProvider(),
        '@', '(', '<', '>', '=', ':', '.'
    );

    // Register hover provider
    const hoverProvider = vscode.languages.registerHoverProvider(
        'sdns',
        new SDNSHoverProvider()
    );

    // Register document symbol provider (outline)
    const symbolProvider = vscode.languages.registerDocumentSymbolProvider(
        'sdns',
        new SDNSDocumentSymbolProvider()
    );

    // Register definition provider (go to definition)
    const definitionProvider = vscode.languages.registerDefinitionProvider(
        'sdns',
        new SDNSDefinitionProvider()
    );

    // Register folding range provider
    const foldingProvider = vscode.languages.registerFoldingRangeProvider(
        'sdns',
        new SDNSFoldingRangeProvider()
    );

    // Register validation on document change
    const validateOnChange = vscode.workspace.onDidChangeTextDocument(event => {
        if (event.document.languageId === 'sdns' || event.document.languageId === 'sdns-keys') {
            validateDocument(event.document, diagnosticCollection);
        }
    });

    // Validate on document open
    const validateOnOpen = vscode.workspace.onDidOpenTextDocument(document => {
        if (document.languageId === 'sdns' || document.languageId === 'sdns-keys') {
            validateDocument(document, diagnosticCollection);
        }
    });

    // Register keyword context menu command
    const keywordInfoCommand = vscode.commands.registerCommand('sdns.showKeywordInfo', (keywordId: string) => {
        const keyword = getKeywordById(keywordId);
        if (keyword) {
            const panel = vscode.window.createWebviewPanel(
                'sdnsKeywordInfo',
                `Keyword: ${keyword.displayText}`,
                vscode.ViewColumn.Beside,
                {}
            );
            panel.webview.html = getKeywordInfoHtml(keyword);
        }
    });

    // Register reload keywords command
    const reloadKeywordsCommand = vscode.commands.registerCommand('sdns.reloadKeywords', () => {
        if (workspaceFolders && workspaceFolders.length > 0) {
            loadKeywordFiles(workspaceFolders[0].uri.fsPath);
            vscode.window.showInformationMessage(`SDNS: Loaded ${keywordSources.size} keyword sources, ${allKeywords.size} total keywords`);
        }
    });

    context.subscriptions.push(
        completionProvider,
        hoverProvider,
        symbolProvider,
        definitionProvider,
        foldingProvider,
        keywordInfoCommand,
        reloadKeywordsCommand,
        validateOnChange,
        validateOnOpen
    );

    // Validate all open documents on activation
    vscode.workspace.textDocuments.forEach(document => {
        if (document.languageId === 'sdns' || document.languageId === 'sdns-keys') {
            validateDocument(document, diagnosticCollection);
        }
    });
}

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validate a .keys file
 */
function validateKeysFile(uri: vscode.Uri, diagnostics: vscode.DiagnosticCollection): void {
    try {
        const content = fs.readFileSync(uri.fsPath, 'utf-8');
        const document = vscode.workspace.textDocuments.find(d => d.uri.fsPath === uri.fsPath);
        if (document) {
            validateDocument(document, diagnostics);
        }
    } catch (err) {
        console.error('SDNS: Error validating .keys file:', err);
    }
}

/**
 * Validate a document and report diagnostics
 */
function validateDocument(document: vscode.TextDocument, diagnostics: vscode.DiagnosticCollection): void {
    const problems: vscode.Diagnostic[] = [];

    if (document.languageId === 'sdns') {
        validateSdnsDocument(document, problems);
    } else if (document.languageId === 'sdns-keys') {
        validateKeysDocument(document, problems);
    }

    diagnostics.set(document.uri, problems);
}

/**
 * Validate an SDNS (.session, .sdns, .turn) document
 */
function validateSdnsDocument(document: vscode.TextDocument, problems: vscode.Diagnostic[]): void {
    const text = document.getText();
    const lines = text.split('\n');

    // Track block structure
    const openBlocks: { name: string; line: number }[] = [];
    let ifDepth = 0;
    let whenDepth = 0;

    // Track multi-line string state
    let inMultiLineString = false;
    let multiLineStringStart = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // Skip comments
        if (trimmed.startsWith('//')) continue;

        // Check block definitions
        const blockMatch = trimmed.match(/^===\s*(@?[\w.:_-]+)\s*===\s*$/);
        if (blockMatch) {
            openBlocks.push({ name: blockMatch[1], line: i });
        }

        // Check @if/@elseif/@else/@endif balance
        if (trimmed.startsWith('@if ') || trimmed === '@if') {
            ifDepth++;
        } else if (trimmed === '@endif') {
            ifDepth--;
            if (ifDepth < 0) {
                problems.push(new vscode.Diagnostic(
                    new vscode.Range(i, 0, i, trimmed.length),
                    'Unexpected @endif without matching @if',
                    vscode.DiagnosticSeverity.Error
                ));
                ifDepth = 0;
            }
        }

        // Check @when/@end balance
        if (trimmed.startsWith('@when ') || trimmed.startsWith('@when(')) {
            whenDepth++;
        } else if (trimmed === '@end') {
            whenDepth--;
            if (whenDepth < 0) {
                problems.push(new vscode.Diagnostic(
                    new vscode.Range(i, 0, i, trimmed.length),
                    'Unexpected @end without matching @when',
                    vscode.DiagnosticSeverity.Error
                ));
                whenDepth = 0;
            }
        }

        // Track multi-line string state
        // Count unescaped quotes to track if we're inside a string
        for (let j = 0; j < line.length; j++) {
            if (line[j] === '"' && (j === 0 || line[j - 1] !== '\\')) {
                inMultiLineString = !inMultiLineString;
                if (inMultiLineString) {
                    multiLineStringStart = i;
                }
            }
        }

        // Validate keyword references
        const keywordRefs = line.matchAll(/<keyword:([^>]+)>/g);
        for (const match of keywordRefs) {
            const keywordId = match[1];
            if (!getKeywordById(keywordId)) {
                const startCol = line.indexOf(match[0]);
                problems.push(new vscode.Diagnostic(
                    new vscode.Range(i, startCol, i, startCol + match[0].length),
                    `Unknown keyword: ${keywordId}`,
                    vscode.DiagnosticSeverity.Warning
                ));
            }
        }

        // Validate animation references
        const animRefs = line.matchAll(/<anim:([^>]+)>/g);
        const validAnims = ['none', 'highlight', 'pulse', 'glow', 'shimmer', 'shake', 'pop', 'float', 'wiggle', 'wave', 'typewriter', 'glitch', 'bounce', 'fade'];
        for (const match of animRefs) {
            const animId = match[1];
            if (!validAnims.includes(animId)) {
                const startCol = line.indexOf(match[0]);
                problems.push(new vscode.Diagnostic(
                    new vscode.Range(i, startCol, i, startCol + match[0].length),
                    `Unknown animation: ${animId}. Valid animations: ${validAnims.join(', ')}`,
                    vscode.DiagnosticSeverity.Warning
                ));
            }
        }

        // Validate style references
        const styleRefs = line.matchAll(/<style:([^>]+)>/g);
        const validStyleCategories = ['behavior', 'emotion', 'cognition', 'symptom', 'relationship', 'time', 'background', 'generic'];
        for (const match of styleRefs) {
            const styleRef = match[1];
            const styleParts = styleRef.split('.');
            if (styleParts.length !== 2) {
                const startCol = line.indexOf(match[0]);
                problems.push(new vscode.Diagnostic(
                    new vscode.Range(i, startCol, i, startCol + match[0].length),
                    `Style reference should be in format 'category.preset' (e.g., behavior.red)`,
                    vscode.DiagnosticSeverity.Warning
                ));
            } else if (!validStyleCategories.includes(styleParts[0])) {
                const startCol = line.indexOf(match[0]);
                problems.push(new vscode.Diagnostic(
                    new vscode.Range(i, startCol, i, startCol + match[0].length),
                    `Unknown style category: ${styleParts[0]}. Valid: ${validStyleCategories.join(', ')}`,
                    vscode.DiagnosticSeverity.Warning
                ));
            }
        }

        // Validate goto targets
        const gotoMatch = trimmed.match(/^->\s*(@?[\w.:/-]+)\s*$/);
        if (gotoMatch) {
            const target = gotoMatch[1];
            // Check if target block exists (basic check)
            const targetPattern = new RegExp(`===\\s*${target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*===`, 'm');
            if (!targetPattern.test(text) && !target.includes('/')) {
                problems.push(new vscode.Diagnostic(
                    new vscode.Range(i, trimmed.indexOf(target), i, trimmed.indexOf(target) + target.length),
                    `Goto target not found: ${target}`,
                    vscode.DiagnosticSeverity.Information
                ));
            }
        }
    }

    // Report unclosed @if blocks
    if (ifDepth > 0) {
        problems.push(new vscode.Diagnostic(
            new vscode.Range(0, 0, 0, 1),
            `${ifDepth} unclosed @if block(s) - missing @endif`,
            vscode.DiagnosticSeverity.Error
        ));
    }

    // Report unclosed @when blocks
    if (whenDepth > 0) {
        problems.push(new vscode.Diagnostic(
            new vscode.Range(0, 0, 0, 1),
            `${whenDepth} unclosed @when block(s) - missing @end`,
            vscode.DiagnosticSeverity.Error
        ));
    }

    // Report unclosed multi-line strings
    if (inMultiLineString) {
        problems.push(new vscode.Diagnostic(
            new vscode.Range(multiLineStringStart, 0, multiLineStringStart, lines[multiLineStringStart].length),
            'Unclosed string literal - missing closing quote',
            vscode.DiagnosticSeverity.Error
        ));
    }
}

/**
 * Validate a .keys document
 */
function validateKeysDocument(document: vscode.TextDocument, problems: vscode.Diagnostic[]): void {
    const text = document.getText();
    const lines = text.split('\n');

    let currentSection: string | null = null;
    let braceDepth = 0;
    let currentBlockStart = -1;
    let hasSource = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // Skip comments and empty lines
        if (trimmed === '' || trimmed.startsWith('//')) continue;

        // Section headers
        const sectionMatch = trimmed.match(/^===\s*(\w+)\s*===$/);
        if (sectionMatch) {
            currentSection = sectionMatch[1].toUpperCase();
            continue;
        }

        // Track brace depth
        const openBraces = (line.match(/{/g) || []).length;
        const closeBraces = (line.match(/}/g) || []).length;

        if (openBraces > 0 && braceDepth === 0) {
            currentBlockStart = i;
        }

        braceDepth += openBraces - closeBraces;

        if (braceDepth < 0) {
            problems.push(new vscode.Diagnostic(
                new vscode.Range(i, 0, i, line.length),
                'Unexpected closing brace',
                vscode.DiagnosticSeverity.Error
            ));
            braceDepth = 0;
        }

        // Check for source in META section
        if (currentSection === 'META' && trimmed.startsWith('source:')) {
            hasSource = true;
        }

        // Validate keyword definition format
        if (currentSection === 'KEYWORDS' && braceDepth === 0) {
            const keywordDefMatch = trimmed.match(/^\[([^\]]+)\]\s*\{?\s*$/);
            if (keywordDefMatch) {
                const keywordId = keywordDefMatch[1];
                // Check for proper format: category.id
                if (!keywordId.includes('.')) {
                    problems.push(new vscode.Diagnostic(
                        new vscode.Range(i, trimmed.indexOf('['), i, trimmed.indexOf(']') + 1),
                        `Keyword ID should include category: [category.keywordId]`,
                        vscode.DiagnosticSeverity.Warning
                    ));
                }
            }
        }

        // Validate action definition format
        if (currentSection === 'ACTIONS' && braceDepth === 0) {
            const actionDefMatch = trimmed.match(/^@([a-zA-Z0-9_.]+)\s*\{?\s*$/);
            if (actionDefMatch) {
                const actionId = actionDefMatch[1];
                // Check for proper format
                if (!actionId.includes('.') && !['shake', 'pulse', 'glow', 'fade', 'highlight', 'wiggle'].includes(actionId)) {
                    problems.push(new vscode.Diagnostic(
                        new vscode.Range(i, 1, i, 1 + actionId.length),
                        `Action ID should follow naming convention: @category.actionId`,
                        vscode.DiagnosticSeverity.Information
                    ));
                }
            }
        }

        // Validate importance values
        if (trimmed.startsWith('importance:')) {
            const value = trimmed.split(':')[1]?.trim();
            const validImportance = ['low', 'medium', 'high', 'critical'];
            if (value && !validImportance.includes(value)) {
                problems.push(new vscode.Diagnostic(
                    new vscode.Range(i, trimmed.indexOf(':') + 1, i, trimmed.length),
                    `Invalid importance value. Valid values: ${validImportance.join(', ')}`,
                    vscode.DiagnosticSeverity.Warning
                ));
            }
        }
    }

    // Report unclosed braces
    if (braceDepth > 0) {
        problems.push(new vscode.Diagnostic(
            new vscode.Range(currentBlockStart, 0, currentBlockStart, 1),
            `Unclosed brace - ${braceDepth} brace(s) not closed`,
            vscode.DiagnosticSeverity.Error
        ));
    }

    // Warn if no source defined
    if (!hasSource) {
        problems.push(new vscode.Diagnostic(
            new vscode.Range(0, 0, 0, 1),
            'Missing "source" property in META section',
            vscode.DiagnosticSeverity.Warning
        ));
    }
}

/**
 * Generate HTML for keyword info panel
 */
function getKeywordInfoHtml(keyword: KeywordDefinition): string {
    const importanceColors: Record<string, string> = {
        'low': '#7f8c8d',
        'medium': '#f1c40f',
        'high': '#e67e22',
        'critical': '#e74c3c'
    };

    const color = importanceColors[keyword.importance] || '#3498db';

    let effectsHtml = '';
    if (keyword.effects) {
        effectsHtml = `
            <h3>Effects</h3>
            <ul>
                ${keyword.effects.focusCost ? `<li>Focus Cost: ${keyword.effects.focusCost}</li>` : ''}
                ${keyword.effects.rapportChange ? `<li>Rapport Change: ${keyword.effects.rapportChange > 0 ? '+' : ''}${keyword.effects.rapportChange}</li>` : ''}
                ${keyword.effects.reveals?.length ? `<li>Reveals: ${keyword.effects.reveals.join(', ')}</li>` : ''}
                ${keyword.effects.triggers?.length ? `<li>Triggers: ${keyword.effects.triggers.join(', ')}</li>` : ''}
            </ul>
        `;
    }

    let menuHtml = '';
    if (keyword.menuOptions?.length) {
        menuHtml = `
            <h3>Context Menu Options</h3>
            <ul>
                ${keyword.menuOptions.map(opt => `<li><strong>${opt.label}</strong> (${opt.action})</li>`).join('')}
            </ul>
        `;
    }

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; color: #e0e0e0; }
                h1 { color: ${keyword.style?.color || color}; }
                .importance { 
                    display: inline-block; 
                    padding: 2px 8px; 
                    border-radius: 4px; 
                    background: ${color}; 
                    color: white;
                    font-size: 12px;
                    text-transform: uppercase;
                }
                .id { color: #888; font-family: monospace; }
                .description { font-size: 16px; line-height: 1.5; margin: 16px 0; }
                .note { background: rgba(255,255,255,0.1); padding: 12px; border-radius: 4px; margin: 16px 0; }
                .aliases { color: #888; }
                h3 { color: #aaa; margin-top: 24px; }
                ul { padding-left: 20px; }
                li { margin: 4px 0; }
            </style>
        </head>
        <body>
            <h1>${keyword.displayText}</h1>
            <span class="importance">${keyword.importance}</span>
            <p class="id">${keyword.id}</p>
            <p class="description">${keyword.description}</p>
            ${keyword.aliases?.length ? `<p class="aliases">Also: ${keyword.aliases.join(', ')}</p>` : ''}
            ${keyword.note ? `<div class="note"><strong>Note:</strong> ${keyword.note}</div>` : ''}
            ${effectsHtml}
            ${menuHtml}
        </body>
        </html>
    `;
}

class SDNSCompletionProvider implements vscode.CompletionItemProvider {
    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): vscode.CompletionItem[] {
        const lineText = document.lineAt(position).text;
        const linePrefix = lineText.substring(0, position.character);
        const items: vscode.CompletionItem[] = [];

        // Speaker suggestions at line start
        if (/^\s*$/.test(linePrefix) || /^\s*[A-Z]*$/.test(linePrefix)) {
            SPEAKERS.forEach(speaker => {
                const item = new vscode.CompletionItem(speaker, vscode.CompletionItemKind.Keyword);
                item.detail = 'Speaker';
                item.insertText = new vscode.SnippetString(`${speaker}\n"\${1:dialogue}"`);
                item.documentation = `Add ${speaker.toLowerCase()} dialogue line`;
                items.push(item);
            });
        }

        // Mood suggestions after speaker name
        if (/^\s*(PATIENT|THERAPIST|NARRATOR|SYSTEM)\s*\(?\s*\w*$/.test(linePrefix)) {
            MOODS.forEach(mood => {
                const item = new vscode.CompletionItem(mood, vscode.CompletionItemKind.EnumMember);
                item.detail = 'Mood';
                item.insertText = linePrefix.includes('(') ? mood : `(${mood})`;
                item.documentation = `Set speaker mood to "${mood}"`;
                items.push(item);
            });
        }

        // Directive suggestions after @
        if (/@\w*$/.test(linePrefix)) {
            // Control directives
            CONTROL_DIRECTIVES.forEach(directive => {
                const item = new vscode.CompletionItem(directive, vscode.CompletionItemKind.Keyword);
                item.detail = 'Control Flow';
                item.documentation = `Control flow directive: ${directive}`;
                items.push(item);
            });

            // Action directives
            ACTION_DIRECTIVES.forEach(directive => {
                const item = new vscode.CompletionItem(directive.name, vscode.CompletionItemKind.Function);
                item.detail = 'Action Directive';
                item.insertText = new vscode.SnippetString(directive.insertText);
                item.documentation = directive.description;
                items.push(item);
            });
        }

        // Function suggestions in conditions
        if (/@if|@elseif|@when/.test(linePrefix) || /&&|\|\|/.test(linePrefix)) {
            BUILT_IN_FUNCTIONS.forEach(func => {
                const item = new vscode.CompletionItem(func.name, vscode.CompletionItemKind.Function);
                item.detail = 'Condition Function';
                item.insertText = new vscode.SnippetString(func.insertText);
                item.documentation = func.description;
                items.push(item);
            });

            VARIABLES.forEach(variable => {
                const item = new vscode.CompletionItem(variable, vscode.CompletionItemKind.Variable);
                item.detail = 'Game Variable';
                item.documentation = `Game state variable: ${variable}`;
                items.push(item);
            });
        }

        // Block reference suggestions after ->
        if (/->/.test(linePrefix)) {
            const blocks = this.findBlocks(document);
            blocks.forEach(block => {
                const item = new vscode.CompletionItem(block.name, vscode.CompletionItemKind.Reference);
                item.detail = 'Block Reference';
                item.documentation = `Jump to block: ${block.name}`;
                items.push(item);
            });
        }

        // Metadata type suggestions after <
        if (/<\w*$/.test(linePrefix) || /<[\w-]+:\w*$/.test(linePrefix)) {
            METADATA_TYPES.forEach(type => {
                const item = new vscode.CompletionItem(type, vscode.CompletionItemKind.TypeParameter);
                item.detail = 'Metadata Type';
                item.insertText = new vscode.SnippetString(`${type}:\${1:id}>`);
                item.documentation = `Keyword metadata type: ${type}`;
                items.push(item);
            });

            // Add style and anim as tag completions
            const styleItem = new vscode.CompletionItem('style', vscode.CompletionItemKind.Color);
            styleItem.detail = 'Style Preset';
            styleItem.insertText = new vscode.SnippetString('style:${1:category}.${2:preset}>');
            styleItem.documentation = 'Apply a CSS style preset (e.g., behavior.red, emotion.sad)';
            items.push(styleItem);

            const animItem = new vscode.CompletionItem('anim', vscode.CompletionItemKind.Event);
            animItem.detail = 'Animation';
            animItem.insertText = new vscode.SnippetString('anim:${1|pulse,glow,shake,shimmer,highlight,pop,float,none|}>');
            animItem.documentation = 'Apply an animation effect to the keyword';
            items.push(animItem);
        }

        // ================================================================
        // STYLE COMPLETIONS - <style:category.preset>
        // ================================================================

        // After <style: - suggest categories
        const styleStartMatch = linePrefix.match(/<style:$/);
        if (styleStartMatch) {
            const categories = ['behavior', 'emotion', 'cognition', 'symptom', 'relationship', 'time', 'background', 'generic'];
            categories.forEach(cat => {
                const item = new vscode.CompletionItem(cat, vscode.CompletionItemKind.Color);
                item.detail = `${cat.charAt(0).toUpperCase() + cat.slice(1)} styles`;
                item.insertText = `${cat}.`;
                item.command = { command: 'editor.action.triggerSuggest', title: 'Trigger Suggest' };
                items.push(item);
            });
        }

        // After <style:category. - suggest presets for that category
        const styleCategoryMatch = linePrefix.match(/<style:([a-z]+)\.$/);
        if (styleCategoryMatch) {
            const category = styleCategoryMatch[1];
            const presets: Record<string, { name: string; color: string }[]> = {
                behavior: [
                    { name: 'default', color: '#e74c3c' },
                    { name: 'red', color: '#e74c3c' },
                    { name: 'warning', color: '#f39c12' },
                    { name: 'avoidance', color: '#d35400' }
                ],
                emotion: [
                    { name: 'default', color: '#9b59b6' },
                    { name: 'purple', color: '#9b59b6' },
                    { name: 'sad', color: '#34495e' },
                    { name: 'anxious', color: '#e67e22' },
                    { name: 'positive', color: '#27ae60' }
                ],
                cognition: [
                    { name: 'default', color: '#3498db' },
                    { name: 'blue', color: '#3498db' },
                    { name: 'distortion', color: '#8e44ad' },
                    { name: 'belief', color: '#2980b9' }
                ],
                symptom: [
                    { name: 'default', color: '#e67e22' },
                    { name: 'orange', color: '#e67e22' },
                    { name: 'critical', color: '#c0392b' },
                    { name: 'physical', color: '#16a085' }
                ],
                relationship: [
                    { name: 'default', color: '#1abc9c' },
                    { name: 'teal', color: '#1abc9c' },
                    { name: 'conflict', color: '#e74c3c' },
                    { name: 'support', color: '#27ae60' },
                    { name: 'loss', color: '#7f8c8d' }
                ],
                time: [
                    { name: 'default', color: '#95a5a6' },
                    { name: 'silver', color: '#95a5a6' },
                    { name: 'recent', color: '#3498db' },
                    { name: 'chronic', color: '#e67e22' }
                ],
                generic: [
                    { name: 'default', color: '#6c5ce7' }
                ]
            };

            const categoryPresets = presets[category] || presets.generic;
            categoryPresets.forEach(preset => {
                const item = new vscode.CompletionItem(preset.name, vscode.CompletionItemKind.Color);
                item.detail = `Color: ${preset.color}`;
                item.insertText = `${preset.name}>`;
                item.documentation = new vscode.MarkdownString(`**${category}.${preset.name}**\n\nApplies ${category} styling with ${preset.color} color`);
                items.push(item);
            });
        }

        // ================================================================
        // ANIMATION COMPLETIONS - <anim:type>
        // ================================================================

        // After <anim: - suggest animation types
        const animMatch = linePrefix.match(/<anim:$/);
        if (animMatch) {
            const animations = [
                { name: 'none', desc: 'No animation' },
                { name: 'highlight', desc: 'Brief flash effect on interaction' },
                { name: 'pulse', desc: 'Gentle breathing/pulsing effect' },
                { name: 'glow', desc: 'Soft luminance shift' },
                { name: 'shimmer', desc: 'Light sweep effect across keyword' },
                { name: 'shake', desc: 'Brief shake for attention or contradiction' },
                { name: 'pop', desc: 'Scale pop for emphasis' },
                { name: 'float', desc: 'Subtle lift on hover' }
            ];

            animations.forEach(anim => {
                const item = new vscode.CompletionItem(anim.name, vscode.CompletionItemKind.Event);
                item.detail = anim.desc;
                item.insertText = `${anim.name}>`;
                item.documentation = new vscode.MarkdownString(`**Animation: ${anim.name}**\n\n${anim.desc}`);
                items.push(item);
            });
        }

        // ================================================================
        // KEYWORD REFERENCE COMPLETIONS - New syntax: [text]<keyword:source.category.id>
        // ================================================================

        // After <keyword: - suggest sources (patient IDs and 'generic')
        const keywordSourceMatch = linePrefix.match(/\[[^\]]+\]<keyword:$/);
        if (keywordSourceMatch) {
            // Suggest all available keyword sources
            const sources = getKeywordSources();
            sources.forEach(source => {
                const sourceFile = keywordSources.get(source);
                const isPatient = source !== 'generic';
                const icon = isPatient ? 'person' : 'globe';

                const item = new vscode.CompletionItem(source, vscode.CompletionItemKind.Module);
                item.detail = sourceFile?.displayName || source;
                item.documentation = new vscode.MarkdownString(
                    sourceFile?.patientInfo
                        ? `**${sourceFile.patientInfo.name}**\n\nDiagnosis: ${sourceFile.patientInfo.diagnosis || 'N/A'}\n\nTraits: ${sourceFile.patientInfo.keyTraits?.join(', ') || 'N/A'}`
                        : sourceFile?.description || `Keywords from ${source}`
                );
                item.insertText = `${source}.`;
                item.command = { command: 'editor.action.triggerSuggest', title: 'Trigger Suggest' };
                items.push(item);
            });

            // Also suggest detected patient if not already in sources
            const detectedPatient = this.detectPatient(document);
            if (detectedPatient && !sources.includes(detectedPatient)) {
                const item = new vscode.CompletionItem(detectedPatient, vscode.CompletionItemKind.User);
                item.detail = `Detected patient: ${detectedPatient}`;
                item.insertText = `${detectedPatient}.`;
                item.command = { command: 'editor.action.triggerSuggest', title: 'Trigger Suggest' };
                items.push(item);
            }
        }

        // After <keyword:source. - suggest categories for that source
        const keywordCategoryMatch = linePrefix.match(/\[[^\]]+\]<keyword:([a-z]+)\.$/);
        if (keywordCategoryMatch) {
            const source = keywordCategoryMatch[1];
            const categories = getCategoriesForSource(source);

            if (categories.length > 0) {
                categories.forEach(cat => {
                    const catInfo = KEYWORD_CATEGORIES.find(c => c.id === cat);
                    const item = new vscode.CompletionItem(cat, vscode.CompletionItemKind.Folder);
                    item.detail = catInfo?.label || cat;
                    item.documentation = `${catInfo?.label || cat} keywords for ${source}`;
                    item.insertText = `${cat}.`;
                    item.command = { command: 'editor.action.triggerSuggest', title: 'Trigger Suggest' };
                    items.push(item);
                });
            } else {
                // Fallback to standard categories if source not found
                KEYWORD_CATEGORIES.forEach(cat => {
                    const item = new vscode.CompletionItem(cat.id, vscode.CompletionItemKind.Folder);
                    item.detail = cat.label;
                    item.insertText = `${cat.id}.`;
                    item.command = { command: 'editor.action.triggerSuggest', title: 'Trigger Suggest' };
                    items.push(item);
                });
            }
        }

        // After <keyword:source.category. - suggest keywords for that category
        const keywordIdMatch = linePrefix.match(/\[[^\]]+\]<keyword:([a-z]+)\.([a-z]+)\.$/);
        if (keywordIdMatch) {
            const [, source, category] = keywordIdMatch;
            const keywords = getKeywordsForCategory(source, category);

            keywords.forEach(kw => {
                const parts = kw.id.split('.');
                const keywordId = parts[parts.length - 1]; // Just the last part

                const importanceIcon = kw.importance === 'critical' ? '!!' :
                    kw.importance === 'high' ? '!' :
                        kw.importance === 'medium' ? '*' : '';

                const item = new vscode.CompletionItem(
                    importanceIcon ? `${importanceIcon} ${keywordId}` : keywordId,
                    vscode.CompletionItemKind.Value
                );
                item.detail = `${kw.importance.toUpperCase()} | ${kw.displayText}`;
                item.documentation = new vscode.MarkdownString(
                    `**${kw.displayText}**\n\n${kw.description}\n\n` +
                    `ID: \`${kw.id}\`\n\n` +
                    `Importance: \`${kw.importance}\`` +
                    (kw.effects?.reveals?.length ? `\n\nReveals: ${kw.effects.reveals.join(', ')}` : '') +
                    (kw.effects?.focusCost ? `\n\nFocus Cost: ${kw.effects.focusCost}` : '') +
                    (kw.note ? `\n\n*${kw.note}*` : '')
                );
                item.insertText = `${keywordId}>`;
                item.sortText = kw.importance === 'critical' ? '0' :
                    kw.importance === 'high' ? '1' :
                        kw.importance === 'medium' ? '2' : '3';
                items.push(item);
            });
        }

        // Quick completion: after just typing [ - suggest starting a keyword
        if (/\[$/.test(linePrefix) && !/\[\[/.test(linePrefix)) {
            const item = new vscode.CompletionItem('keyword...', vscode.CompletionItemKind.Snippet);
            item.detail = 'Create linked keyword';
            item.insertText = new vscode.SnippetString('${1:display text}]<keyword:${2:source}.${3:category}.${4:id}>');
            item.documentation = 'Create a keyword with linked definition';
            items.push(item);
        }

        // Legacy support: [text](category. pattern for backwards compatibility
        const legacyCategoryMatch = linePrefix.match(/\[[^\]]+\]\(([a-z]+)\.$/);
        if (legacyCategoryMatch) {
            const category = legacyCategoryMatch[1];

            // Check if it's a source name first
            if (keywordSources.has(category)) {
                const categories = getCategoriesForSource(category);
                categories.forEach(cat => {
                    const item = new vscode.CompletionItem(cat, vscode.CompletionItemKind.Folder);
                    item.detail = `Category in ${category}`;
                    item.insertText = `${cat}.`;
                    item.command = { command: 'editor.action.triggerSuggest', title: 'Trigger Suggest' };
                    items.push(item);
                });
            } else {
                // Search for keywords in this category across all sources
                for (const [source, file] of keywordSources) {
                    const keywords = getKeywordsForCategory(source, category);
                    keywords.forEach(kw => {
                        const parts = kw.id.split('.');
                        const keywordId = parts[parts.length - 1];
                        const item = new vscode.CompletionItem(`${source}.${keywordId}`, vscode.CompletionItemKind.Value);
                        item.detail = `${kw.importance} | ${source}`;
                        item.documentation = kw.description;
                        items.push(item);
                    });
                }
            }
        }

        // Block definition suggestion
        if (/^===/.test(linePrefix.trim())) {
            const item = new vscode.CompletionItem('block', vscode.CompletionItemKind.Snippet);
            item.detail = 'Block Definition';
            item.insertText = new vscode.SnippetString(' ${1:block-name} ===\n$0');
            item.documentation = 'Define a new dialogue block';
            items.push(item);

            const responseItem = new vscode.CompletionItem('@response', vscode.CompletionItemKind.Snippet);
            responseItem.detail = 'Response Handler';
            responseItem.insertText = new vscode.SnippetString(' @response:${1:topic}.${2:subtopic} ===\n$0');
            responseItem.documentation = 'Define a response handler block';
            items.push(responseItem);

            const breakthroughItem = new vscode.CompletionItem('@breakthrough', vscode.CompletionItemKind.Snippet);
            breakthroughItem.detail = 'Breakthrough Handler';
            breakthroughItem.insertText = new vscode.SnippetString(' @breakthrough:${1:id} ===\n$0');
            breakthroughItem.documentation = 'Define a breakthrough moment block';
            items.push(breakthroughItem);
        }

        return items;
    }

    private findBlocks(document: vscode.TextDocument): { name: string; line: number }[] {
        const blocks: { name: string; line: number }[] = [];
        const blockRegex = /^===\s*(@?[\w.:_-]+)\s*===\s*$/;

        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i).text;
            const match = line.match(blockRegex);
            if (match) {
                blocks.push({ name: match[1], line: i });
            }
        }

        return blocks;
    }

    /**
     * Detect patient ID from document context (filename, metadata, etc.)
     */
    private detectPatient(document: vscode.TextDocument): string | null {
        // Check filename for patient ID (e.g., gregory-session-1.session)
        const filename = document.fileName.toLowerCase();

        // Get patient sources (excluding 'generic')
        const knownPatients = getKeywordSources().filter(s => s !== 'generic');

        for (const patient of knownPatients) {
            if (filename.includes(patient)) {
                return patient;
            }
        }

        // Check document content for @patient directive
        const text = document.getText();
        const patientMatch = text.match(/@patient\s*:\s*(\w+)/i);
        if (patientMatch) {
            return patientMatch[1].toLowerCase();
        }

        // Check for patient metadata block
        const metaMatch = text.match(/\[meta:patient\]\s*id\s*=\s*"?(\w+)"?/i);
        if (metaMatch) {
            return metaMatch[1].toLowerCase();
        }

        // Check path for patient folder
        const pathMatch = filename.match(/patients[\/\\]([a-z]+)[\/\\]/);
        if (pathMatch) {
            return pathMatch[1];
        }

        return null;
    }
}

class SDNSHoverProvider implements vscode.HoverProvider {
    provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): vscode.Hover | null {
        const range = document.getWordRangeAtPosition(position);
        if (!range) return null;

        const word = document.getText(range);
        const lineText = document.lineAt(position).text;

        // Speaker hover
        if (SPEAKERS.includes(word)) {
            return new vscode.Hover([
                '**SDNS Speaker**',
                `\`${word}\` - Dialogue speaker identifier`,
                '',
                'Usage: `SPEAKER (mood)`',
                '',
                'Available speakers: PATIENT, THERAPIST, NARRATOR, SYSTEM'
            ].join('\n'));
        }

        // Directive hover
        if (word.startsWith('@') || lineText.includes('@' + word)) {
            const directive = ACTION_DIRECTIVES.find(d => d.name === '@' + word || d.name === word);
            if (directive) {
                return new vscode.Hover([
                    `**SDNS Directive: ${directive.name}**`,
                    '',
                    directive.description
                ].join('\n'));
            }

            if (CONTROL_DIRECTIVES.includes('@' + word) || CONTROL_DIRECTIVES.includes(word)) {
                return new vscode.Hover([
                    `**SDNS Control Flow: @${word.replace('@', '')}**`,
                    '',
                    'Control flow directive for conditional logic'
                ].join('\n'));
            }
        }

        // Function hover
        const func = BUILT_IN_FUNCTIONS.find(f => f.name === word);
        if (func) {
            return new vscode.Hover([
                `**SDNS Function: ${func.name}**`,
                '',
                func.description,
                '',
                `Usage: \`${func.insertText.replace(/\$\{\d+:([^}]+)\}/g, '$1')}\``
            ].join('\n'));
        }

        // Variable hover
        if (VARIABLES.includes(word)) {
            const descriptions: Record<string, string> = {
                rapport: 'Player\'s relationship/trust level with the patient (0-100)',
                focus: 'Patient\'s current attention/engagement level',
                turn: 'Current turn number in the session',
                breakthroughs: 'Number of breakthroughs achieved'
            };
            return new vscode.Hover([
                `**SDNS Variable: ${word}**`,
                '',
                descriptions[word] || 'Game state variable'
            ].join('\n'));
        }

        // Block hover
        if (/^===\s*/.test(lineText)) {
            const blockMatch = lineText.match(/===\s*(@?[\w.:_-]+)\s*===/);
            if (blockMatch && range.contains(position)) {
                return new vscode.Hover([
                    `**SDNS Block: ${blockMatch[1]}**`,
                    '',
                    blockMatch[1].startsWith('@response:') ? 'Response handler block' :
                        blockMatch[1].startsWith('@breakthrough:') ? 'Breakthrough moment block' :
                            'Dialogue block'
                ].join('\n'));
            }
        }

        // Keyword reference hover - NEW syntax: [text]<keyword:source.category.id>
        const newKeywordMatch = lineText.match(/\[([^\]]+)\]<keyword:([^>]+)>/g);
        if (newKeywordMatch) {
            for (const match of newKeywordMatch) {
                const startIndex = lineText.indexOf(match);
                const endIndex = startIndex + match.length;

                if (position.character >= startIndex && position.character <= endIndex) {
                    const parsed = match.match(/\[([^\]]+)\]<keyword:([^>]+)>/);
                    if (parsed) {
                        const [, displayText, keywordId] = parsed;

                        // Look up keyword in new database
                        const keyword = getKeywordById(keywordId);

                        if (keyword) {
                            const importanceColors: Record<string, string> = {
                                'low': '#7f8c8d',
                                'medium': '#f1c40f',
                                'high': '#e67e22',
                                'critical': '#e74c3c'
                            };

                            const parts = keywordId.split('.');
                            const source = parts[0];
                            const category = parts[1];
                            const categoryInfo = KEYWORD_CATEGORIES.find(c => c.id === category);

                            let markdown = new vscode.MarkdownString();
                            markdown.isTrusted = true;
                            markdown.supportHtml = true;

                            markdown.appendMarkdown(`### ${keyword.displayText}\n\n`);
                            markdown.appendMarkdown(`**${keyword.importance.toUpperCase()}** | ${source} > ${categoryInfo?.label || category}\n\n`);
                            markdown.appendMarkdown(`${keyword.description}\n\n`);
                            markdown.appendMarkdown(`---\n\n`);
                            markdown.appendMarkdown(`**ID:** \`${keywordId}\`\n\n`);

                            if (keyword.effects) {
                                markdown.appendMarkdown(`**Effects:**\n`);
                                if (keyword.effects.focusCost) {
                                    markdown.appendMarkdown(`- Focus Cost: ${keyword.effects.focusCost}\n`);
                                }
                                if (keyword.effects.rapportChange) {
                                    markdown.appendMarkdown(`- Rapport: ${keyword.effects.rapportChange > 0 ? '+' : ''}${keyword.effects.rapportChange}\n`);
                                }
                                if (keyword.effects.reveals?.length) {
                                    markdown.appendMarkdown(`- Reveals: ${keyword.effects.reveals.join(', ')}\n`);
                                }
                                if (keyword.effects.triggers?.length) {
                                    markdown.appendMarkdown(`- Triggers: ${keyword.effects.triggers.join(', ')}\n`);
                                }
                                markdown.appendMarkdown(`\n`);
                            }

                            if (keyword.note) {
                                markdown.appendMarkdown(`*${keyword.note}*\n\n`);
                            }

                            if (keyword.aliases?.length) {
                                markdown.appendMarkdown(`**Aliases:** ${keyword.aliases.join(', ')}\n`);
                            }

                            return new vscode.Hover(markdown);
                        }

                        // Unknown keyword - still provide some info
                        return new vscode.Hover([
                            `**Unknown Keyword Reference**`,
                            '',
                            `ID: \`${keywordId}\``,
                            `Display: "${displayText}"`,
                            '',
                            '*Keyword not found in definitions. Run "SDNS: Reload Keywords" or check the ID.*'
                        ].join('\n'));
                    }
                }
            }
        }

        // Legacy keyword reference hover - matches [text](keyword.reference)
        const keywordRefMatch = lineText.match(/\[([^\]]+)\]\(([^)]+)\)/g);
        if (keywordRefMatch) {
            for (const match of keywordRefMatch) {
                const startIndex = lineText.indexOf(match);
                const endIndex = startIndex + match.length;

                if (position.character >= startIndex && position.character <= endIndex) {
                    const parsed = match.match(/\[([^\]]+)\]\(([^)]+)\)/);
                    if (parsed) {
                        const [, displayText, reference] = parsed;

                        // Check if it's an inline definition
                        if (reference.startsWith('@keyword{')) {
                            return new vscode.Hover([
                                `**Inline Keyword Definition**`,
                                '',
                                `Display: \`${displayText}\``,
                                '',
                                '```javascript',
                                reference.replace('@keyword', ''),
                                '```'
                            ].join('\n'));
                        }

                        // Look up keyword in database
                        const parts = reference.split('.');
                        let keyword: KeywordDefinition | undefined = undefined;

                        // Try to find keyword by full reference
                        keyword = allKeywords.get(reference);

                        // If not found and has 3 parts (patient.category.id), try category.id
                        if (!keyword && parts.length === 3) {
                            const [, category, id] = parts;
                            keyword = allKeywords.get(`${category}.${id}`);
                        }

                        // If still not found and has 2 parts, try direct lookup
                        if (!keyword && parts.length === 2) {
                            keyword = allKeywords.get(reference);
                        }

                        if (keyword) {
                            const importanceIcon = keyword.importance === 'critical' ? '🔴' :
                                keyword.importance === 'high' ? '🟠' :
                                    keyword.importance === 'medium' ? '🟡' : '⚪';

                            // Extract category from the keyword ID (e.g., "time.duration" -> "time")
                            const categoryId = keyword.id.split('.')[0];
                            const categoryInfo = KEYWORD_CATEGORIES.find(c => c.id === categoryId);

                            // Build effects string from effects object
                            const effectsList: string[] = [];
                            if (keyword.effects) {
                                if (keyword.effects.focusCost) effectsList.push(`Focus: ${keyword.effects.focusCost}`);
                                if (keyword.effects.rapportChange) effectsList.push(`Rapport: ${keyword.effects.rapportChange > 0 ? '+' : ''}${keyword.effects.rapportChange}`);
                                if (keyword.effects.reveals?.length) effectsList.push(`Reveals: ${keyword.effects.reveals.length}`);
                                if (keyword.effects.contradicts?.length) effectsList.push(`Contradicts: ${keyword.effects.contradicts.length}`);
                            }

                            return new vscode.Hover(new vscode.MarkdownString([
                                `**${importanceIcon} Keyword: ${keyword.id}**`,
                                '',
                                keyword.description,
                                '',
                                `| Property | Value |`,
                                `|----------|-------|`,
                                `| Category | ${categoryInfo?.icon || ''} ${categoryInfo?.label || categoryId} |`,
                                `| Importance | ${keyword.importance} |`,
                                effectsList.length > 0 ? `| Effects | ${effectsList.join(', ')} |` : '',
                                '',
                                `Display text: \`${displayText}\``
                            ].filter(Boolean).join('\n')));
                        }

                        // Unknown keyword
                        return new vscode.Hover([
                            `**Keyword Reference**`,
                            '',
                            `Reference: \`${reference}\``,
                            `Display: \`${displayText}\``,
                            '',
                            `⚠️ Keyword not found in database - will use default styling`
                        ].join('\n'));
                    }
                }
            }
        }

        return null;
    }
}

class SDNSDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
    provideDocumentSymbols(
        document: vscode.TextDocument,
        token: vscode.CancellationToken
    ): vscode.DocumentSymbol[] {
        const symbols: vscode.DocumentSymbol[] = [];
        const blockRegex = /^===\s*(@?[\w.:_-]+)\s*===\s*$/;

        let currentBlock: vscode.DocumentSymbol | null = null;
        let blockStart = 0;

        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            const match = line.text.match(blockRegex);

            if (match) {
                // Close previous block
                if (currentBlock) {
                    currentBlock.range = new vscode.Range(
                        currentBlock.range.start,
                        new vscode.Position(i - 1, document.lineAt(i - 1).text.length)
                    );
                }

                // Determine symbol kind
                let kind = vscode.SymbolKind.Function;
                let detail = 'Dialogue Block';

                if (match[1].startsWith('@response:')) {
                    kind = vscode.SymbolKind.Method;
                    detail = 'Response Handler';
                } else if (match[1].startsWith('@breakthrough:')) {
                    kind = vscode.SymbolKind.Event;
                    detail = 'Breakthrough';
                } else if (match[1] === 'START') {
                    kind = vscode.SymbolKind.Constructor;
                    detail = 'Entry Point';
                }

                currentBlock = new vscode.DocumentSymbol(
                    match[1],
                    detail,
                    kind,
                    line.range,
                    line.range
                );
                blockStart = i;
                symbols.push(currentBlock);
            }
        }

        // Close last block
        if (currentBlock) {
            currentBlock.range = new vscode.Range(
                currentBlock.range.start,
                new vscode.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length)
            );
        }

        return symbols;
    }
}

class SDNSDefinitionProvider implements vscode.DefinitionProvider {
    provideDefinition(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): vscode.Definition | null {
        const lineText = document.lineAt(position).text;

        // Check for goto statement
        const gotoMatch = lineText.match(/->\s*([\w_-]+)/);
        if (gotoMatch) {
            const targetBlock = gotoMatch[1];
            const blockRegex = new RegExp(`^===\\s*${targetBlock}\\s*===\\s*$`);

            for (let i = 0; i < document.lineCount; i++) {
                if (blockRegex.test(document.lineAt(i).text)) {
                    return new vscode.Location(document.uri, new vscode.Position(i, 0));
                }
            }
        }

        return null;
    }
}

class SDNSFoldingRangeProvider implements vscode.FoldingRangeProvider {
    provideFoldingRanges(
        document: vscode.TextDocument,
        context: vscode.FoldingContext,
        token: vscode.CancellationToken
    ): vscode.FoldingRange[] {
        const ranges: vscode.FoldingRange[] = [];
        const blockRegex = /^===\s*(@?[\w.:_-]+)\s*===\s*$/;
        const ifRegex = /^\s*@if\b/;
        const endifRegex = /^\s*@endif\b/;

        let blockStarts: number[] = [];
        let ifStarts: number[] = [];

        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i).text;

            // Block folding
            if (blockRegex.test(line)) {
                if (blockStarts.length > 0) {
                    const start = blockStarts.pop()!;
                    ranges.push(new vscode.FoldingRange(start, i - 1, vscode.FoldingRangeKind.Region));
                }
                blockStarts.push(i);
            }

            // If/endif folding
            if (ifRegex.test(line)) {
                ifStarts.push(i);
            } else if (endifRegex.test(line) && ifStarts.length > 0) {
                const start = ifStarts.pop()!;
                ranges.push(new vscode.FoldingRange(start, i, vscode.FoldingRangeKind.Region));
            }

            // Comment block folding
            if (line.trim().startsWith('/*')) {
                const start = i;
                while (i < document.lineCount && !document.lineAt(i).text.includes('*/')) {
                    i++;
                }
                ranges.push(new vscode.FoldingRange(start, i, vscode.FoldingRangeKind.Comment));
            }
        }

        // Close last block
        if (blockStarts.length > 0) {
            const start = blockStarts.pop()!;
            ranges.push(new vscode.FoldingRange(start, document.lineCount - 1, vscode.FoldingRangeKind.Region));
        }

        return ranges;
    }
}

export function deactivate() {
    console.log('SDNS Language Extension deactivated');
}
