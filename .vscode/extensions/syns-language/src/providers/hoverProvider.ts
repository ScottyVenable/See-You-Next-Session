/**
 * SYNS Hover Provider - Documentation on hover
 */

import * as vscode from 'vscode';
import { SynsLogger } from '../utils/logger';
import { SynsDocumentParser } from '../parser/documentParser';
import { DOCUMENTATION, MOOD_DESCRIPTIONS, SPEAKERS, MOODS, DIRECTIVES } from '../utils/constants';

export class SynsHoverProvider implements vscode.HoverProvider {
    private parser: SynsDocumentParser;
    private logger: SynsLogger;

    constructor(parser: SynsDocumentParser, logger: SynsLogger) {
        this.parser = parser;
        this.logger = logger;
    }

    provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): vscode.Hover | null {
        const line = document.lineAt(position).text;
        const wordRange = document.getWordRangeAtPosition(position, /[@$]?\w+(-\w+)*/);

        if (!wordRange) {
            return null;
        }

        const word = document.getText(wordRange);

        try {
            // Check for directives (@word)
            if (word.startsWith('@')) {
                const doc = DOCUMENTATION[word];
                if (doc) {
                    return this.createHover(doc.signature, doc.description, doc.example);
                }
            }

            // Check for speakers
            if (SPEAKERS.includes(word as any)) {
                const doc = DOCUMENTATION[word];
                if (doc) {
                    return this.createHover(doc.signature, doc.description, doc.example);
                }
            }

            // Check for moods (inside parentheses)
            const lineText = line.substring(0, wordRange.end.character + 10);
            if (lineText.match(/\(\s*\w+\s*\)/) && MOODS.includes(word as any)) {
                const description = MOOD_DESCRIPTIONS[word];
                if (description) {
                    return this.createHover(`(${word})`, `**Mood**: ${description}`);
                }
            }

            // Check for built-in functions
            if (DOCUMENTATION[word]) {
                const doc = DOCUMENTATION[word];
                return this.createHover(doc.signature, doc.description, doc.example);
            }

            // Check for variables ($word)
            if (word.startsWith('$')) {
                const varName = word.substring(1);
                const parsed = this.parser.parse(document);
                const variable = parsed.variables.find(v => v.name === varName && v.isSet);

                if (variable) {
                    return this.createHover(
                        `$${varName}`,
                        `**Variable** defined at line ${variable.line + 1}`
                    );
                } else {
                    return this.createHover(
                        `$${varName}`,
                        '**Variable** (may be defined in another file or set at runtime)'
                    );
                }
            }

            // Check for block references (on -> lines)
            if (line.includes('->')) {
                const parsed = this.parser.parse(document);
                const block = parsed.blocks.find(b => b.name === word);
                if (block) {
                    const refCount = block.references.length;
                    return this.createHover(
                        `Block: ${block.name}`,
                        `**Type**: ${block.type}\n**Line**: ${block.line + 1}\n**References**: ${refCount}`
                    );
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

        } catch (error) {
            this.logger.error('Error providing hover', error as Error);
        }

        return null;
    }

    private createHover(signature: string, description: string, example?: string): vscode.Hover {
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
