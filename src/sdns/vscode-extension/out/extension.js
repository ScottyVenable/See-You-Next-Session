"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
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
function activate(context) {
    console.log('SDNS Language Extension activated');
    // Register completion provider
    const completionProvider = vscode.languages.registerCompletionItemProvider('sdns', new SDNSCompletionProvider(), '@', '(', '<', '>', '=');
    // Register hover provider
    const hoverProvider = vscode.languages.registerHoverProvider('sdns', new SDNSHoverProvider());
    // Register document symbol provider (outline)
    const symbolProvider = vscode.languages.registerDocumentSymbolProvider('sdns', new SDNSDocumentSymbolProvider());
    // Register definition provider (go to definition)
    const definitionProvider = vscode.languages.registerDefinitionProvider('sdns', new SDNSDefinitionProvider());
    // Register folding range provider
    const foldingProvider = vscode.languages.registerFoldingRangeProvider('sdns', new SDNSFoldingRangeProvider());
    context.subscriptions.push(completionProvider, hoverProvider, symbolProvider, definitionProvider, foldingProvider);
}
class SDNSCompletionProvider {
    provideCompletionItems(document, position, token, context) {
        const lineText = document.lineAt(position).text;
        const linePrefix = lineText.substring(0, position.character);
        const items = [];
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
    findBlocks(document) {
        const blocks = [];
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
}
class SDNSHoverProvider {
    provideHover(document, position, token) {
        const range = document.getWordRangeAtPosition(position);
        if (!range)
            return null;
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
            const descriptions = {
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
        return null;
    }
}
class SDNSDocumentSymbolProvider {
    provideDocumentSymbols(document, token) {
        const symbols = [];
        const blockRegex = /^===\s*(@?[\w.:_-]+)\s*===\s*$/;
        let currentBlock = null;
        let blockStart = 0;
        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            const match = line.text.match(blockRegex);
            if (match) {
                // Close previous block
                if (currentBlock) {
                    currentBlock.range = new vscode.Range(currentBlock.range.start, new vscode.Position(i - 1, document.lineAt(i - 1).text.length));
                }
                // Determine symbol kind
                let kind = vscode.SymbolKind.Function;
                let detail = 'Dialogue Block';
                if (match[1].startsWith('@response:')) {
                    kind = vscode.SymbolKind.Method;
                    detail = 'Response Handler';
                }
                else if (match[1].startsWith('@breakthrough:')) {
                    kind = vscode.SymbolKind.Event;
                    detail = 'Breakthrough';
                }
                else if (match[1] === 'START') {
                    kind = vscode.SymbolKind.Constructor;
                    detail = 'Entry Point';
                }
                currentBlock = new vscode.DocumentSymbol(match[1], detail, kind, line.range, line.range);
                blockStart = i;
                symbols.push(currentBlock);
            }
        }
        // Close last block
        if (currentBlock) {
            currentBlock.range = new vscode.Range(currentBlock.range.start, new vscode.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length));
        }
        return symbols;
    }
}
class SDNSDefinitionProvider {
    provideDefinition(document, position, token) {
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
class SDNSFoldingRangeProvider {
    provideFoldingRanges(document, context, token) {
        const ranges = [];
        const blockRegex = /^===\s*(@?[\w.:_-]+)\s*===\s*$/;
        const ifRegex = /^\s*@if\b/;
        const endifRegex = /^\s*@endif\b/;
        let blockStarts = [];
        let ifStarts = [];
        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i).text;
            // Block folding
            if (blockRegex.test(line)) {
                if (blockStarts.length > 0) {
                    const start = blockStarts.pop();
                    ranges.push(new vscode.FoldingRange(start, i - 1, vscode.FoldingRangeKind.Region));
                }
                blockStarts.push(i);
            }
            // If/endif folding
            if (ifRegex.test(line)) {
                ifStarts.push(i);
            }
            else if (endifRegex.test(line) && ifStarts.length > 0) {
                const start = ifStarts.pop();
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
            const start = blockStarts.pop();
            ranges.push(new vscode.FoldingRange(start, document.lineCount - 1, vscode.FoldingRangeKind.Region));
        }
        return ranges;
    }
}
function deactivate() {
    console.log('SDNS Language Extension deactivated');
}
//# sourceMappingURL=extension.js.map