import * as vscode from 'vscode';

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
// KEYWORD DATABASE (IntelliSense data)
// ============================================================================

interface KeywordDefinition {
    id: string;
    category: string;
    description: string;
    importance: string;
    effects?: string[];
}

const KEYWORD_CATEGORIES = [
    { id: 'time', label: 'Time & Duration', icon: '🕐' },
    { id: 'emotion', label: 'Emotions', icon: '❤️' },
    { id: 'behavior', label: 'Behaviors', icon: '🎭' },
    { id: 'symptom', label: 'Symptoms', icon: '⚕️' },
    { id: 'relationship', label: 'Relationships', icon: '👥' },
    { id: 'cognition', label: 'Thoughts & Beliefs', icon: '🧠' }
];

const KEYWORDS_DATABASE: KeywordDefinition[] = [
    // Time keywords
    { id: 'time.months', category: 'time', description: 'Duration spanning months', importance: 'medium', effects: ['reveals: chronicity'] },
    { id: 'time.weeks', category: 'time', description: 'Duration spanning weeks', importance: 'low' },
    { id: 'time.years', category: 'time', description: 'Years-long duration (chronic)', importance: 'high', effects: ['reveals: chronic-issue'] },
    { id: 'time.always', category: 'time', description: 'Lifelong pattern', importance: 'critical', effects: ['reveals: lifelong-pattern'] },
    { id: 'time.every-night', category: 'time', description: 'Nightly occurrence', importance: 'high' },
    { id: 'time.constantly', category: 'time', description: 'Continuous occurrence', importance: 'high' },
    { id: 'time.sometimes', category: 'time', description: 'Occasional (may be minimizing)', importance: 'low' },
    { id: 'time.recently', category: 'time', description: 'Recent onset', importance: 'medium' },

    // Emotion keywords
    { id: 'emotion.worried', category: 'emotion', description: 'Expression of worry', importance: 'medium' },
    { id: 'emotion.anxious', category: 'emotion', description: 'Anxiety expression', importance: 'high', effects: ['reveals: anxiety-acknowledged'] },
    { id: 'emotion.terrified', category: 'emotion', description: 'Intense fear', importance: 'critical' },
    { id: 'emotion.on-edge', category: 'emotion', description: 'Feeling tense', importance: 'medium' },
    { id: 'emotion.sad', category: 'emotion', description: 'Sadness expression', importance: 'medium' },
    { id: 'emotion.hopeless', category: 'emotion', description: 'Hopelessness (⚠️ safety)', importance: 'critical', effects: ['triggers: depression-marker'] },
    { id: 'emotion.numb', category: 'emotion', description: 'Emotional numbness', importance: 'high' },
    { id: 'emotion.worthless', category: 'emotion', description: 'Feeling worthless (⚠️ safety)', importance: 'critical' },
    { id: 'emotion.ashamed', category: 'emotion', description: 'Shame expression', importance: 'high' },
    { id: 'emotion.guilty', category: 'emotion', description: 'Guilt expression', importance: 'medium' },
    { id: 'emotion.angry', category: 'emotion', description: 'Anger expression', importance: 'medium' },
    { id: 'emotion.relieved', category: 'emotion', description: 'Relief (positive sign)', importance: 'medium' },
    { id: 'emotion.hopeful', category: 'emotion', description: 'Hope (therapeutic gain)', importance: 'high' },

    // Behavior keywords
    { id: 'behavior.avoiding', category: 'behavior', description: 'Avoidance behavior', importance: 'medium' },
    { id: 'behavior.isolation', category: 'behavior', description: 'Social withdrawal', importance: 'high' },
    { id: 'behavior.checking', category: 'behavior', description: 'Repetitive checking', importance: 'high' },
    { id: 'behavior.over-and-over', category: 'behavior', description: 'Compulsive pattern', importance: 'high' },
    { id: 'behavior.reassurance-seeking', category: 'behavior', description: 'Seeking validation', importance: 'medium' },
    { id: 'behavior.cant-sleep', category: 'behavior', description: 'Sleep difficulties', importance: 'high' },
    { id: 'behavior.racing-mind', category: 'behavior', description: 'Racing thoughts', importance: 'high' },
    { id: 'behavior.not-eating', category: 'behavior', description: 'Appetite decrease', importance: 'medium' },
    { id: 'behavior.self-harm', category: 'behavior', description: '⚠️ CRITICAL: Self-harm', importance: 'critical' },
    { id: 'behavior.drinking', category: 'behavior', description: 'Alcohol use', importance: 'high' },
    { id: 'behavior.perfectionism', category: 'behavior', description: 'Perfectionist tendencies', importance: 'medium' },

    // Symptom keywords
    { id: 'symptom.heart-racing', category: 'symptom', description: 'Palpitations', importance: 'high' },
    { id: 'symptom.sweating', category: 'symptom', description: 'Excessive sweating', importance: 'medium' },
    { id: 'symptom.trembling', category: 'symptom', description: 'Shaking/tremors', importance: 'medium' },
    { id: 'symptom.chest-pain', category: 'symptom', description: 'Chest pain (rule out medical)', importance: 'critical' },
    { id: 'symptom.dizzy', category: 'symptom', description: 'Dizziness', importance: 'medium' },
    { id: 'symptom.insomnia', category: 'symptom', description: 'Chronic sleep difficulty', importance: 'high' },
    { id: 'symptom.nightmares', category: 'symptom', description: 'Disturbing dreams', importance: 'high' },
    { id: 'symptom.fatigue', category: 'symptom', description: 'Persistent tiredness', importance: 'medium' },
    { id: 'symptom.cant-concentrate', category: 'symptom', description: 'Concentration problems', importance: 'medium' },
    { id: 'symptom.brain-fog', category: 'symptom', description: 'Mental cloudiness', importance: 'medium' },
    { id: 'symptom.unreal', category: 'symptom', description: 'Derealization', importance: 'high' },
    { id: 'symptom.outside-body', category: 'symptom', description: 'Depersonalization', importance: 'critical' },

    // Relationship keywords
    { id: 'relationship.no-one', category: 'relationship', description: 'Feeling alone', importance: 'high' },
    { id: 'relationship.burden', category: 'relationship', description: 'Feeling like a burden (⚠️)', importance: 'critical' },
    { id: 'relationship.support', category: 'relationship', description: 'Has support system', importance: 'medium' },
    { id: 'relationship.family', category: 'relationship', description: 'Family reference', importance: 'low' },
    { id: 'relationship.parents', category: 'relationship', description: 'Parent reference', importance: 'medium' },
    { id: 'relationship.childhood', category: 'relationship', description: 'Childhood experience', importance: 'high' },
    { id: 'relationship.breakup', category: 'relationship', description: 'End of relationship', importance: 'high' },
    { id: 'relationship.death', category: 'relationship', description: 'Loss/death reference', importance: 'critical' },
    { id: 'relationship.fighting', category: 'relationship', description: 'Interpersonal conflict', importance: 'medium' },
    { id: 'relationship.abuse', category: 'relationship', description: '⚠️ CRITICAL: Abuse history', importance: 'critical' },
    { id: 'relationship.no-friends', category: 'relationship', description: 'Lack of friendships', importance: 'high' },

    // Cognition keywords
    { id: 'cognition.not-good-enough', category: 'cognition', description: 'Core belief: inadequacy', importance: 'critical' },
    { id: 'cognition.failure', category: 'cognition', description: 'Belief of being a failure', importance: 'high' },
    { id: 'cognition.unlovable', category: 'cognition', description: 'Core belief: unlovable', importance: 'critical' },
    { id: 'cognition.always-wrong', category: 'cognition', description: 'All-or-nothing thinking', importance: 'medium' },
    { id: 'cognition.should', category: 'cognition', description: 'Should statements', importance: 'medium' },
    { id: 'cognition.mind-reading', category: 'cognition', description: 'Assuming others\' thoughts', importance: 'medium' },
    { id: 'cognition.catastrophizing', category: 'cognition', description: 'Expecting worst case', importance: 'high' },
    { id: 'cognition.what-if', category: 'cognition', description: 'Anticipatory worry', importance: 'medium' },
    { id: 'cognition.going-crazy', category: 'cognition', description: 'Fear of losing control', importance: 'critical' },
    { id: 'cognition.fake', category: 'cognition', description: 'Imposter feelings', importance: 'high' },
    { id: 'cognition.better-off', category: 'cognition', description: '⚠️ CRITICAL: SI indicator', importance: 'critical' },
    { id: 'cognition.end-it', category: 'cognition', description: '⚠️ CRITICAL: Active SI', importance: 'critical' }
];

// Patient-specific keywords
const PATIENT_KEYWORDS: Record<string, KeywordDefinition[]> = {
    'gregory': [
        { id: 'gregory.time.months-actually', category: 'time', description: 'Gregory admits duration', importance: 'high' },
        { id: 'gregory.cognition.overreacting', category: 'cognition', description: 'Self-minimization', importance: 'medium' },
        { id: 'gregory.behavior.sleep-fine', category: 'behavior', description: 'Denial (contradicts appearance)', importance: 'high' },
        { id: 'gregory.behavior.mind-wont-shutoff', category: 'behavior', description: 'Racing thoughts at night', importance: 'high' },
        { id: 'gregory.behavior.replaying-conversations', category: 'behavior', description: 'Rumination', importance: 'high' },
        { id: 'gregory.emotion.being-watched', category: 'emotion', description: 'Hypervigilance', importance: 'high' },
        { id: 'gregory.cognition.doing-correctly', category: 'cognition', description: 'Perfectionism', importance: 'high' },
        { id: 'gregory.cognition.trust-perception', category: 'cognition', description: 'Deep self-doubt (breakthrough)', importance: 'critical' },
        { id: 'gregory.behavior.performing', category: 'behavior', description: 'Masking/performing normalcy', importance: 'critical' },
        { id: 'gregory.emotion.terrified-mistakes', category: 'emotion', description: 'Childhood fear', importance: 'critical' },
        { id: 'gregory.cognition.feelings-didnt-matter', category: 'cognition', description: 'Childhood invalidation', importance: 'critical' }
    ]
};

export function activate(context: vscode.ExtensionContext) {
    console.log('SDNS Language Extension activated');

    // Register completion provider
    const completionProvider = vscode.languages.registerCompletionItemProvider(
        'sdns',
        new SDNSCompletionProvider(),
        '@', '(', '<', '>', '='
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

    context.subscriptions.push(
        completionProvider,
        hoverProvider,
        symbolProvider,
        definitionProvider,
        foldingProvider
    );
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
        }

        // ================================================================
        // KEYWORD REFERENCE COMPLETIONS
        // ================================================================

        // Keyword reference after [text](
        if (/\[[^\]]+\]\($/.test(linePrefix)) {
            // Add category suggestions
            KEYWORD_CATEGORIES.forEach(cat => {
                const item = new vscode.CompletionItem(`${cat.icon} ${cat.id}`, vscode.CompletionItemKind.Module);
                item.detail = cat.label;
                item.insertText = `${cat.id}.`;
                item.documentation = `${cat.label} keywords`;
                item.command = { command: 'editor.action.triggerSuggest', title: 'Trigger Suggest' };
                items.push(item);
            });

            // Add @keyword for inline definition
            const inlineItem = new vscode.CompletionItem('@keyword{...}', vscode.CompletionItemKind.Snippet);
            inlineItem.detail = 'Inline Keyword Definition';
            inlineItem.insertText = new vscode.SnippetString('@keyword{\n\tid: "${1:id}",\n\tcategory: "${2:category}",\n\teffects: { reveals: ["${3:symptom}"] }\n}');
            inlineItem.documentation = 'Define a keyword inline';
            items.push(inlineItem);

            // Add patient-specific prefix if in patient file
            const patientId = this.detectPatient(document);
            if (patientId) {
                const patientItem = new vscode.CompletionItem(`👤 ${patientId}`, vscode.CompletionItemKind.User);
                patientItem.detail = `${patientId}'s keywords`;
                patientItem.insertText = `${patientId}.`;
                patientItem.documentation = `Patient-specific keywords for ${patientId}`;
                patientItem.command = { command: 'editor.action.triggerSuggest', title: 'Trigger Suggest' };
                items.push(patientItem);
            }
        }

        // Keyword completion after category prefix: [text](category.
        const categoryMatch = linePrefix.match(/\[[^\]]+\]\(([a-z]+)\.$/)
            || linePrefix.match(/\[[^\]]+\]\(([a-z]+)\.([a-z]+)\.$/)  // patient.category.
            || linePrefix.match(/\[[^\]]+\]\(([a-z_-]+)\.\s*$/);

        if (categoryMatch) {
            const prefix = categoryMatch[1];

            // Check if it's a patient prefix
            if (PATIENT_KEYWORDS[prefix]) {
                // Patient-specific keywords
                PATIENT_KEYWORDS[prefix].forEach(kw => {
                    const item = new vscode.CompletionItem(kw.id, vscode.CompletionItemKind.Value);
                    item.detail = `${kw.importance.toUpperCase()} | ${kw.category}`;
                    item.documentation = new vscode.MarkdownString(
                        `**${kw.id}**\n\n${kw.description}\n\n` +
                        `Importance: \`${kw.importance}\`` +
                        (kw.effects ? `\n\nEffects: ${kw.effects.join(', ')}` : '')
                    );
                    // Insert just the last part
                    const parts = kw.id.split('.');
                    item.insertText = parts.slice(1).join('.');
                    items.push(item);
                });

                // Also suggest categories under patient
                KEYWORD_CATEGORIES.forEach(cat => {
                    const item = new vscode.CompletionItem(cat.id, vscode.CompletionItemKind.Module);
                    item.detail = cat.label;
                    item.insertText = `${cat.id}.`;
                    item.command = { command: 'editor.action.triggerSuggest', title: 'Trigger Suggest' };
                    items.push(item);
                });
            } else {
                // Category keywords
                KEYWORDS_DATABASE.filter(kw => kw.category === prefix).forEach(kw => {
                    const importanceIcon = kw.importance === 'critical' ? '🔴' :
                        kw.importance === 'high' ? '🟠' :
                            kw.importance === 'medium' ? '🟡' : '⚪';
                    const item = new vscode.CompletionItem(`${importanceIcon} ${kw.id.split('.')[1]}`, vscode.CompletionItemKind.Value);
                    item.detail = `${kw.importance.toUpperCase()}`;
                    item.documentation = new vscode.MarkdownString(
                        `**${kw.id}**\n\n${kw.description}\n\n` +
                        `Importance: \`${kw.importance}\`` +
                        (kw.effects ? `\n\nEffects: ${kw.effects.join(', ')}` : '')
                    );
                    item.insertText = kw.id.split('.')[1];
                    items.push(item);
                });
            }
        }

        // Patient.category. pattern (e.g., gregory.time.)
        const patientCatMatch = linePrefix.match(/\[[^\]]+\]\(([a-z]+)\.([a-z]+)\.$/);
        if (patientCatMatch) {
            const [, patientId, category] = patientCatMatch;

            // Get patient-specific keywords for this category
            const patientKws = PATIENT_KEYWORDS[patientId]?.filter(kw => kw.category === category) || [];
            patientKws.forEach(kw => {
                const parts = kw.id.split('.');
                const kwName = parts[parts.length - 1];
                const item = new vscode.CompletionItem(kwName, vscode.CompletionItemKind.Value);
                item.detail = `${kw.importance.toUpperCase()} | ${patientId}`;
                item.documentation = new vscode.MarkdownString(
                    `**${kw.id}**\n\n${kw.description}`
                );
                item.insertText = kwName;
                items.push(item);
            });
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
        const knownPatients = Object.keys(PATIENT_KEYWORDS);

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

        // Keyword reference hover - matches [text](keyword.reference)
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
                        let keyword = null;

                        // Check patient-specific first (patient.category.id)
                        if (parts.length === 3) {
                            const [patientId, category, id] = parts;
                            keyword = PATIENT_KEYWORDS[patientId]?.find(
                                kw => kw.id === `${category}.${id}` || kw.id === reference
                            );
                        }

                        // Check global keywords (category.id)
                        if (!keyword && parts.length >= 2) {
                            keyword = KEYWORDS_DATABASE.find(kw => kw.id === reference);
                        }

                        if (keyword) {
                            const importanceIcon = keyword.importance === 'critical' ? '🔴' :
                                keyword.importance === 'high' ? '🟠' :
                                    keyword.importance === 'medium' ? '🟡' : '⚪';

                            const categoryInfo = KEYWORD_CATEGORIES.find(c => c.id === keyword!.category);

                            return new vscode.Hover(new vscode.MarkdownString([
                                `**${importanceIcon} Keyword: ${keyword.id}**`,
                                '',
                                keyword.description,
                                '',
                                `| Property | Value |`,
                                `|----------|-------|`,
                                `| Category | ${categoryInfo?.icon || ''} ${categoryInfo?.label || keyword.category} |`,
                                `| Importance | ${keyword.importance} |`,
                                keyword.effects ? `| Effects | ${keyword.effects.join(', ')} |` : '',
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
