/**
 * SYNS Document Parser - Parses .syns files into a structured format
 */

import * as vscode from 'vscode';
import { SynsLogger } from '../utils/logger';
import { BLOCK_TYPES } from '../utils/constants';

export interface SynsBlock {
    name: string;
    type: 'normal' | 'response' | 'breakthrough' | 'when';
    line: number;
    endLine?: number;
    references: number[];  // Lines that reference this block via goto
}

export interface SynsGoto {
    target: string;
    line: number;
    column: number;
}

export interface SynsVariable {
    name: string;
    line: number;
    isSet: boolean;  // true if defined via @set, false if just referenced
}

export interface SynsConditional {
    type: 'if' | 'elseif' | 'else' | 'endif' | 'when' | 'end' | 'trigger';
    line: number;
    column: number;
    condition?: string;
    matchingLine?: number;  // Line of matching @endif or @end
}

export interface SynsDiagnostic {
    message: string;
    line: number;
    column: number;
    endColumn: number;
    severity: 'error' | 'warning' | 'information' | 'hint';
    code: string;
}

export interface ParsedDocument {
    blocks: SynsBlock[];
    gotos: SynsGoto[];
    variables: SynsVariable[];
    conditionals: SynsConditional[];
    diagnostics: SynsDiagnostic[];
}

export class SynsDocumentParser {
    private logger: SynsLogger;
    private cache: Map<string, { version: number; parsed: ParsedDocument }> = new Map();

    constructor(logger: SynsLogger) {
        this.logger = logger;
    }

    parse(document: vscode.TextDocument): ParsedDocument {
        // Check cache
        const cached = this.cache.get(document.uri.toString());
        if (cached && cached.version === document.version) {
            return cached.parsed;
        }

        this.logger.debug(`Parsing document: ${document.fileName}`);
        const startTime = Date.now();

        const text = document.getText();
        const lines = text.split(/\r?\n/);

        const blocks: SynsBlock[] = [];
        const gotos: SynsGoto[] = [];
        const variables: SynsVariable[] = [];
        const conditionals: SynsConditional[] = [];
        const diagnostics: SynsDiagnostic[] = [];

        // Track conditional nesting
        const conditionalStack: SynsConditional[] = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();

            // Skip empty lines and comments
            if (!trimmed || trimmed.startsWith('//')) {
                continue;
            }

            // Parse blocks
            const blockMatch = trimmed.match(/^===\s*(@?\S+)\s*===\s*$/);
            if (blockMatch) {
                const blockName = blockMatch[1];
                let blockType: SynsBlock['type'] = 'normal';

                if (blockName.startsWith('@response:')) {
                    blockType = 'response';
                } else if (blockName.startsWith('@breakthrough:')) {
                    blockType = 'breakthrough';
                } else if (blockName.startsWith('@when:')) {
                    blockType = 'when';
                }

                // Check for duplicate blocks
                const existing = blocks.find(b => b.name === blockName);
                if (existing) {
                    diagnostics.push({
                        message: `Duplicate block definition: '${blockName}' (first defined at line ${existing.line + 1})`,
                        line: i,
                        column: line.indexOf('==='),
                        endColumn: line.lastIndexOf('===') + 3,
                        severity: 'error',
                        code: 'duplicate-block'
                    });
                }

                blocks.push({
                    name: blockName,
                    type: blockType,
                    line: i,
                    references: []
                });
                continue;
            }

            // Parse goto statements
            const gotoMatch = line.match(/->\s*([\w@:.-]+)/);
            if (gotoMatch) {
                const target = gotoMatch[1];
                const column = line.indexOf('->');
                gotos.push({ target, line: i, column });
                continue;
            }

            // Parse @if/@elseif/@else/@endif
            const ifMatch = trimmed.match(/^@(if|elseif)\s+(.+)$/);
            if (ifMatch) {
                const cond: SynsConditional = {
                    type: ifMatch[1] as 'if' | 'elseif',
                    line: i,
                    column: line.indexOf('@'),
                    condition: ifMatch[2]
                };
                conditionals.push(cond);

                if (ifMatch[1] === 'if') {
                    conditionalStack.push(cond);
                } else if (conditionalStack.length === 0) {
                    diagnostics.push({
                        message: '@elseif without matching @if',
                        line: i,
                        column: line.indexOf('@'),
                        endColumn: line.indexOf('@') + 7,
                        severity: 'error',
                        code: 'orphan-elseif'
                    });
                }
                continue;
            }

            if (trimmed === '@else') {
                const cond: SynsConditional = {
                    type: 'else',
                    line: i,
                    column: line.indexOf('@')
                };
                conditionals.push(cond);

                if (conditionalStack.length === 0) {
                    diagnostics.push({
                        message: '@else without matching @if',
                        line: i,
                        column: line.indexOf('@'),
                        endColumn: line.indexOf('@') + 5,
                        severity: 'error',
                        code: 'orphan-else'
                    });
                }
                continue;
            }

            if (trimmed === '@endif') {
                const cond: SynsConditional = {
                    type: 'endif',
                    line: i,
                    column: line.indexOf('@')
                };
                conditionals.push(cond);

                if (conditionalStack.length > 0) {
                    const matching = conditionalStack.pop()!;
                    matching.matchingLine = i;
                    cond.matchingLine = matching.line;
                } else {
                    diagnostics.push({
                        message: '@endif without matching @if',
                        line: i,
                        column: line.indexOf('@'),
                        endColumn: line.indexOf('@') + 6,
                        severity: 'error',
                        code: 'orphan-endif'
                    });
                }
                continue;
            }

            // Parse @when/@end/@trigger
            const whenMatch = trimmed.match(/^@when\s+(.+)$/);
            if (whenMatch) {
                conditionalStack.push({
                    type: 'when',
                    line: i,
                    column: line.indexOf('@'),
                    condition: whenMatch[1]
                });
                continue;
            }

            const triggerMatch = trimmed.match(/^@trigger\s+(.+)$/);
            if (triggerMatch) {
                conditionals.push({
                    type: 'trigger',
                    line: i,
                    column: line.indexOf('@'),
                    condition: triggerMatch[1]
                });
                continue;
            }

            if (trimmed === '@end') {
                const cond: SynsConditional = {
                    type: 'end',
                    line: i,
                    column: line.indexOf('@')
                };
                conditionals.push(cond);

                // Check for matching @when or @trigger
                const stackTop = conditionalStack.length > 0 ? conditionalStack[conditionalStack.length - 1] : null;
                if (stackTop && (stackTop.type === 'when' || stackTop.type === 'trigger')) {
                    const matching = conditionalStack.pop()!;
                    matching.matchingLine = i;
                    cond.matchingLine = matching.line;
                }
                continue;
            }

            // Parse @set
            const setMatch = trimmed.match(/^@set\s+(\$?\w+)\s*=\s*(.+)$/);
            if (setMatch) {
                variables.push({
                    name: setMatch[1].replace(/^\$/, ''),
                    line: i,
                    isSet: true
                });
                continue;
            }

            // Parse variable references ($varname)
            const varRefs = line.matchAll(/\$(\w+)/g);
            for (const match of varRefs) {
                variables.push({
                    name: match[1],
                    line: i,
                    isSet: false
                });
            }
        }

        // Check for unclosed conditionals
        for (const unclosed of conditionalStack) {
            if (unclosed.type === 'if') {
                diagnostics.push({
                    message: '@if without matching @endif',
                    line: unclosed.line,
                    column: unclosed.column,
                    endColumn: unclosed.column + 3,
                    severity: 'error',
                    code: 'unclosed-if'
                });
            } else if (unclosed.type === 'when') {
                diagnostics.push({
                    message: '@when without matching @end',
                    line: unclosed.line,
                    column: unclosed.column,
                    endColumn: unclosed.column + 5,
                    severity: 'error',
                    code: 'unclosed-when'
                });
            }
        }

        // Cross-reference gotos with blocks
        for (const goto of gotos) {
            const block = blocks.find(b => b.name === goto.target);
            if (block) {
                block.references.push(goto.line);
            } else {
                diagnostics.push({
                    message: `Undefined block: '${goto.target}'`,
                    line: goto.line,
                    column: goto.column + 3, // After '-> '
                    endColumn: goto.column + 3 + goto.target.length,
                    severity: 'error',
                    code: 'undefined-block'
                });
            }
        }

        // Check for unreferenced blocks (except special ones)
        for (const block of blocks) {
            if (block.name === 'START' || block.name === 'SESSION_END' ||
                block.type === 'response' || block.type === 'breakthrough') {
                continue;
            }
            if (block.references.length === 0) {
                diagnostics.push({
                    message: `Block '${block.name}' is never referenced`,
                    line: block.line,
                    column: 0,
                    endColumn: 100,
                    severity: 'warning',
                    code: 'unused-block'
                });
            }
        }

        // Check for undefined variable references
        const definedVars = new Set(variables.filter(v => v.isSet).map(v => v.name));
        for (const variable of variables) {
            if (!variable.isSet && !definedVars.has(variable.name)) {
                // Check if it's a built-in or likely from previous turn
                const builtins = ['breakthrough_sleep', 'admitted_anxiety', 'admitted_sleep', 'revealed_childhood'];
                if (!builtins.includes(variable.name)) {
                    diagnostics.push({
                        message: `Variable '$${variable.name}' may be undefined`,
                        line: variable.line,
                        column: 0,
                        endColumn: 100,
                        severity: 'hint',
                        code: 'undefined-variable'
                    });
                }
            }
        }

        const parsed: ParsedDocument = {
            blocks,
            gotos,
            variables,
            conditionals,
            diagnostics
        };

        // Cache result
        this.cache.set(document.uri.toString(), {
            version: document.version,
            parsed
        });

        const elapsed = Date.now() - startTime;
        this.logger.debug(`Parsed document in ${elapsed}ms: ${blocks.length} blocks, ${gotos.length} gotos, ${diagnostics.length} diagnostics`);

        return parsed;
    }

    clearCache(uri?: string): void {
        if (uri) {
            this.cache.delete(uri);
        } else {
            this.cache.clear();
        }
    }
}
