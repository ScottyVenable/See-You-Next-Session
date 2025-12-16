/**
 * SYNS Document Symbol Provider - Outline view support
 */

import * as vscode from 'vscode';
import { SynsLogger } from '../utils/logger';
import { SynsDocumentParser } from '../parser/documentParser';

export class SynsDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
    private parser: SynsDocumentParser;
    private logger: SynsLogger;

    constructor(parser: SynsDocumentParser, logger: SynsLogger) {
        this.parser = parser;
        this.logger = logger;
    }

    provideDocumentSymbols(
        document: vscode.TextDocument,
        token: vscode.CancellationToken
    ): vscode.DocumentSymbol[] {
        const symbols: vscode.DocumentSymbol[] = [];

        try {
            const parsed = this.parser.parse(document);
            const lines = document.getText().split(/\r?\n/);

            // Group blocks by type
            const normalBlocks: vscode.DocumentSymbol[] = [];
            const responseBlocks: vscode.DocumentSymbol[] = [];
            const breakthroughBlocks: vscode.DocumentSymbol[] = [];

            for (const block of parsed.blocks) {
                // Find the end of this block (next block start or end of file)
                let endLine = document.lineCount - 1;
                for (const otherBlock of parsed.blocks) {
                    if (otherBlock.line > block.line && otherBlock.line < endLine) {
                        endLine = otherBlock.line - 1;
                    }
                }

                const range = new vscode.Range(
                    block.line, 0,
                    endLine, lines[endLine]?.length || 0
                );

                const selectionRange = new vscode.Range(
                    block.line, 0,
                    block.line, lines[block.line]?.length || 0
                );

                let kind: vscode.SymbolKind;
                let detail: string;

                switch (block.type) {
                    case 'response':
                        kind = vscode.SymbolKind.Event;
                        detail = 'Response Handler';
                        break;
                    case 'breakthrough':
                        kind = vscode.SymbolKind.Event;
                        detail = 'Breakthrough';
                        break;
                    case 'when':
                        kind = vscode.SymbolKind.Event;
                        detail = 'Trigger';
                        break;
                    default:
                        kind = vscode.SymbolKind.Function;
                        detail = block.references.length > 0
                            ? `${block.references.length} reference(s)`
                            : 'No references';
                }

                const symbol = new vscode.DocumentSymbol(
                    block.name,
                    detail,
                    kind,
                    range,
                    selectionRange
                );

                // Add child symbols for gotos within this block
                const blockGotos = parsed.gotos.filter(g =>
                    g.line > block.line && g.line <= endLine
                );
                for (const goto of blockGotos) {
                    const gotoRange = new vscode.Range(goto.line, 0, goto.line, lines[goto.line]?.length || 0);
                    symbol.children.push(new vscode.DocumentSymbol(
                        `-> ${goto.target}`,
                        'Goto',
                        vscode.SymbolKind.Reference,
                        gotoRange,
                        gotoRange
                    ));
                }

                // Categorize by type
                if (block.type === 'response') {
                    responseBlocks.push(symbol);
                } else if (block.type === 'breakthrough') {
                    breakthroughBlocks.push(symbol);
                } else {
                    normalBlocks.push(symbol);
                }
            }

            // Add grouped symbols
            if (normalBlocks.length > 0) {
                const blocksGroup = new vscode.DocumentSymbol(
                    'Dialogue Blocks',
                    `${normalBlocks.length} block(s)`,
                    vscode.SymbolKind.Namespace,
                    new vscode.Range(0, 0, document.lineCount - 1, 0),
                    new vscode.Range(0, 0, 0, 0)
                );
                blocksGroup.children = normalBlocks;
                symbols.push(blocksGroup);
            }

            if (responseBlocks.length > 0) {
                const responsesGroup = new vscode.DocumentSymbol(
                    'Response Handlers',
                    `${responseBlocks.length} handler(s)`,
                    vscode.SymbolKind.Namespace,
                    new vscode.Range(0, 0, document.lineCount - 1, 0),
                    new vscode.Range(0, 0, 0, 0)
                );
                responsesGroup.children = responseBlocks;
                symbols.push(responsesGroup);
            }

            if (breakthroughBlocks.length > 0) {
                const breakthroughsGroup = new vscode.DocumentSymbol(
                    'Breakthroughs',
                    `${breakthroughBlocks.length} breakthrough(s)`,
                    vscode.SymbolKind.Namespace,
                    new vscode.Range(0, 0, document.lineCount - 1, 0),
                    new vscode.Range(0, 0, 0, 0)
                );
                breakthroughsGroup.children = breakthroughBlocks;
                symbols.push(breakthroughsGroup);
            }

            // Add variables section
            const setVariables = parsed.variables.filter(v => v.isSet);
            if (setVariables.length > 0) {
                const varsGroup = new vscode.DocumentSymbol(
                    'Variables',
                    `${setVariables.length} variable(s)`,
                    vscode.SymbolKind.Namespace,
                    new vscode.Range(0, 0, document.lineCount - 1, 0),
                    new vscode.Range(0, 0, 0, 0)
                );

                const seenVars = new Set<string>();
                for (const variable of setVariables) {
                    if (!seenVars.has(variable.name)) {
                        seenVars.add(variable.name);
                        const varRange = new vscode.Range(variable.line, 0, variable.line, lines[variable.line]?.length || 0);
                        varsGroup.children.push(new vscode.DocumentSymbol(
                            `$${variable.name}`,
                            `Line ${variable.line + 1}`,
                            vscode.SymbolKind.Variable,
                            varRange,
                            varRange
                        ));
                    }
                }

                symbols.push(varsGroup);
            }

            this.logger.debug(`Found ${symbols.length} top-level symbols`);

        } catch (error) {
            this.logger.error('Error providing document symbols', error as Error);
        }

        return symbols;
    }
}
