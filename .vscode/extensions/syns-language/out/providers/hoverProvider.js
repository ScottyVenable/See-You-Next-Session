"use strict";
/**
 * SYNS Hover Provider - Documentation on hover
 */
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SynsHoverProvider = void 0;
const vscode = __importStar(require("vscode"));
const constants_1 = require("../utils/constants");
class SynsHoverProvider {
    constructor(parser, logger) {
        this.parser = parser;
        this.logger = logger;
    }
    provideHover(document, position, token) {
        const line = document.lineAt(position).text;
        const wordRange = document.getWordRangeAtPosition(position, /[@$]?\w+(-\w+)*/);
        if (!wordRange) {
            return null;
        }
        const word = document.getText(wordRange);
        try {
            // Check for directives (@word)
            if (word.startsWith('@')) {
                const doc = constants_1.DOCUMENTATION[word];
                if (doc) {
                    return this.createHover(doc.signature, doc.description, doc.example);
                }
            }
            // Check for speakers
            if (constants_1.SPEAKERS.includes(word)) {
                const doc = constants_1.DOCUMENTATION[word];
                if (doc) {
                    return this.createHover(doc.signature, doc.description, doc.example);
                }
            }
            // Check for moods (inside parentheses)
            const lineText = line.substring(0, wordRange.end.character + 10);
            if (lineText.match(/\(\s*\w+\s*\)/) && constants_1.MOODS.includes(word)) {
                const description = constants_1.MOOD_DESCRIPTIONS[word];
                if (description) {
                    return this.createHover(`(${word})`, `**Mood**: ${description}`);
                }
            }
            // Check for built-in functions
            if (constants_1.DOCUMENTATION[word]) {
                const doc = constants_1.DOCUMENTATION[word];
                return this.createHover(doc.signature, doc.description, doc.example);
            }
            // Check for variables ($word)
            if (word.startsWith('$')) {
                const varName = word.substring(1);
                const parsed = this.parser.parse(document);
                const variable = parsed.variables.find(v => v.name === varName && v.isSet);
                if (variable) {
                    return this.createHover(`$${varName}`, `**Variable** defined at line ${variable.line + 1}`);
                }
                else {
                    return this.createHover(`$${varName}`, '**Variable** (may be defined in another file or set at runtime)');
                }
            }
            // Check for block references (on -> lines)
            if (line.includes('->')) {
                const parsed = this.parser.parse(document);
                const block = parsed.blocks.find(b => b.name === word);
                if (block) {
                    const refCount = block.references.length;
                    return this.createHover(`Block: ${block.name}`, `**Type**: ${block.type}\n**Line**: ${block.line + 1}\n**References**: ${refCount}`);
                }
            }
            // Check if hovering over a block definition
            const blockMatch = line.match(/===\s*(\S+)\s*===/);
            if (blockMatch && word === blockMatch[1].replace('@', '')) {
                const parsed = this.parser.parse(document);
                const block = parsed.blocks.find(b => b.line === position.line);
                if (block) {
                    const refCount = block.references.length;
                    const refLines = block.references.map(r => r + 1).join(', ');
                    let doc = `**Type**: ${block.type}\n**References**: ${refCount}`;
                    if (refLines) {
                        doc += `\n**Referenced from lines**: ${refLines}`;
                    }
                    return this.createHover(`Block: ${block.name}`, doc);
                }
            }
        }
        catch (error) {
            this.logger.error('Error providing hover', error);
        }
        return null;
    }
    createHover(signature, description, example) {
        const content = new vscode.MarkdownString();
        content.appendCodeblock(signature, 'syns');
        content.appendMarkdown('\n' + description);
        if (example) {
            content.appendMarkdown('\n\n**Example:**\n');
            content.appendCodeblock(example, 'syns');
        }
        return new vscode.Hover(content);
    }
}
exports.SynsHoverProvider = SynsHoverProvider;
//# sourceMappingURL=hoverProvider.js.map