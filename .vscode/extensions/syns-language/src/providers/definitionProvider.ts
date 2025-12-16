/**
 * SYNS Definition Provider - Go to Definition support
 */

import * as vscode from 'vscode';
import { SynsLogger } from '../utils/logger';
import { SynsDocumentParser } from '../parser/documentParser';

export class SynsDefinitionProvider implements vscode.DefinitionProvider {
    private parser: SynsDocumentParser;
    private logger: SynsLogger;

    constructor(parser: SynsDocumentParser, logger: SynsLogger) {
        this.parser = parser;
        this.logger = logger;
    }

    provideDefinition(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): vscode.Definition | null {
        const line = document.lineAt(position).text;
        const wordRange = document.getWordRangeAtPosition(position, /[\w@:.-]+/);

        if (!wordRange) {
            return null;
        }

        const word = document.getText(wordRange);

        try {
            const parsed = this.parser.parse(document);

            // Check if this is a goto target
            if (line.includes('->')) {
                const block = parsed.blocks.find(b => b.name === word);
                if (block) {
                    this.logger.debug(`Found definition for block: ${word} at line ${block.line}`);
                    return new vscode.Location(
                        document.uri,
                        new vscode.Position(block.line, 0)
                    );
                }
            }

            // Check if this is a variable reference
            if (word.startsWith('$')) {
                const varName = word.substring(1);
                const definition = parsed.variables.find(v => v.name === varName && v.isSet);
                if (definition) {
                    return new vscode.Location(
                        document.uri,
                        new vscode.Position(definition.line, 0)
                    );
                }
            }

            // Check if hovering over a block reference in any context
            const block = parsed.blocks.find(b => b.name === word);
            if (block) {
                return new vscode.Location(
                    document.uri,
                    new vscode.Position(block.line, 0)
                );
            }

        } catch (error) {
            this.logger.error('Error providing definition', error as Error);
        }

        return null;
    }
}
