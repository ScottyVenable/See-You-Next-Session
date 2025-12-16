/**
 * SYNS Diagnostics Provider - Error checking and warnings
 */

import * as vscode from 'vscode';
import { SynsLogger } from '../utils/logger';
import { SynsDocumentParser, SynsDiagnostic } from '../parser/documentParser';

type SeverityName = 'error' | 'warning' | 'information' | 'hint';

export class SynsDiagnosticsProvider implements vscode.Disposable {
    private diagnosticCollection: vscode.DiagnosticCollection;
    private parser: SynsDocumentParser;
    private logger: SynsLogger;

    constructor(parser: SynsDocumentParser, logger: SynsLogger) {
        this.parser = parser;
        this.logger = logger;
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection('syns');
    }

    private getConfig() {
        const config = vscode.workspace.getConfiguration('syns.diagnostics');
        return {
            enabled: config.get<boolean>('enabled', true),
            severity: {
                unusedBlock: config.get<SeverityName>('severity.unusedBlock', 'warning'),
                undefinedGoto: config.get<SeverityName>('severity.undefinedGoto', 'error'),
                unclosedConditional: config.get<SeverityName>('severity.unclosedConditional', 'error')
            }
        };
    }

    private toVscodeSeverity(severity: SeverityName): vscode.DiagnosticSeverity {
        switch (severity) {
            case 'error': return vscode.DiagnosticSeverity.Error;
            case 'warning': return vscode.DiagnosticSeverity.Warning;
            case 'information': return vscode.DiagnosticSeverity.Information;
            case 'hint': return vscode.DiagnosticSeverity.Hint;
        }
    }

    validateDocument(document: vscode.TextDocument): void {
        const config = this.getConfig();
        if (!config.enabled) {
            this.diagnosticCollection.delete(document.uri);
            return;
        }

        this.logger.debug(`Validating document: ${document.fileName}`);

        try {
            const parsed = this.parser.parse(document);
            const diagnostics: vscode.Diagnostic[] = [];

            for (const diag of parsed.diagnostics) {
                // Apply severity configuration
                let severity = this.toVscodeSeverity(diag.severity);

                if (diag.code === 'unused-block') {
                    severity = this.toVscodeSeverity(config.severity.unusedBlock);
                } else if (diag.code === 'undefined-block') {
                    severity = this.toVscodeSeverity(config.severity.undefinedGoto);
                } else if (diag.code.startsWith('unclosed-') || diag.code.startsWith('orphan-')) {
                    severity = this.toVscodeSeverity(config.severity.unclosedConditional);
                }

                const range = new vscode.Range(
                    diag.line, diag.column,
                    diag.line, diag.endColumn
                );

                const vscodeDiag = new vscode.Diagnostic(range, diag.message, severity);
                vscodeDiag.code = diag.code;
                vscodeDiag.source = 'SYNS';

                // Add related information for some diagnostics
                if (diag.code === 'duplicate-block') {
                    // Could add related location info here
                }

                diagnostics.push(vscodeDiag);
            }

            // Additional syntax checks
            diagnostics.push(...this.checkSyntax(document));

            this.diagnosticCollection.set(document.uri, diagnostics);
            this.logger.debug(`Found ${diagnostics.length} diagnostics`);

        } catch (error) {
            this.logger.error('Error validating document', error as Error);
        }
    }

    private checkSyntax(document: vscode.TextDocument): vscode.Diagnostic[] {
        const diagnostics: vscode.Diagnostic[] = [];
        const lines = document.getText().split(/\r?\n/);

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();

            // Skip empty lines and comments
            if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*')) {
                continue;
            }

            // Check for unclosed strings
            const quoteCount = (line.match(/"/g) || []).length;
            if (quoteCount % 2 !== 0 && !trimmed.startsWith('//')) {
                // Check if it's not a multi-line string continuation
                const isMultiLine = line.endsWith('"') || lines[i + 1]?.trim().startsWith('"');
                if (!isMultiLine) {
                    diagnostics.push(new vscode.Diagnostic(
                        new vscode.Range(i, 0, i, line.length),
                        'Unclosed string literal',
                        vscode.DiagnosticSeverity.Warning
                    ));
                }
            }

            // Check for invalid speaker format
            const speakerMatch = trimmed.match(/^(PATIENT|THERAPIST|NARRATOR|SYSTEM)\s*(.*)$/);
            if (speakerMatch) {
                const afterSpeaker = speakerMatch[2];
                // Should be empty, have a mood, or have a colon for inline
                if (afterSpeaker && !afterSpeaker.match(/^\([\w-]+\)/) && !afterSpeaker.startsWith(':')) {
                    diagnostics.push(new vscode.Diagnostic(
                        new vscode.Range(i, 0, i, line.length),
                        'Invalid speaker format. Use: SPEAKER, SPEAKER (mood), or SPEAKER: "dialogue"',
                        vscode.DiagnosticSeverity.Warning
                    ));
                }
            }

            // Check for invalid block format
            if (trimmed.includes('===') && !trimmed.match(/^===\s*\S+\s*===$/)) {
                if (!trimmed.startsWith('//')) {
                    diagnostics.push(new vscode.Diagnostic(
                        new vscode.Range(i, 0, i, line.length),
                        'Invalid block format. Use: === block-name ===',
                        vscode.DiagnosticSeverity.Error
                    ));
                }
            }

            // Check for invalid directive format
            const directiveMatch = trimmed.match(/^@(\w+)/);
            if (directiveMatch) {
                const directive = directiveMatch[1];
                const validDirectives = ['if', 'elseif', 'else', 'endif', 'when', 'end',
                    'trigger', 'reveal', 'unlock', 'set', 'rapport', 'focus', 'pause'];
                if (!validDirectives.includes(directive)) {
                    diagnostics.push(new vscode.Diagnostic(
                        new vscode.Range(i, line.indexOf('@'), i, line.indexOf('@') + directive.length + 1),
                        `Unknown directive: @${directive}`,
                        vscode.DiagnosticSeverity.Warning
                    ));
                }
            }

            // Check @rapport/@focus format
            const rapportMatch = trimmed.match(/^@(rapport|focus)\s+(.*)$/);
            if (rapportMatch) {
                const value = rapportMatch[2].trim();
                if (!value.match(/^[+-]?\d+$/)) {
                    diagnostics.push(new vscode.Diagnostic(
                        new vscode.Range(i, 0, i, line.length),
                        `Invalid ${rapportMatch[1]} value. Use: @${rapportMatch[1]} +/-number`,
                        vscode.DiagnosticSeverity.Error
                    ));
                }
            }

            // Check @pause format
            const pauseMatch = trimmed.match(/^@pause\s+(.*)$/);
            if (pauseMatch) {
                const value = pauseMatch[1].trim();
                if (!value.match(/^\d+(\.\d+)?$/)) {
                    diagnostics.push(new vscode.Diagnostic(
                        new vscode.Range(i, 0, i, line.length),
                        'Invalid pause value. Use: @pause seconds (e.g., @pause 1.5)',
                        vscode.DiagnosticSeverity.Error
                    ));
                }
            }

            // Check for empty blocks (===  ===)
            if (trimmed.match(/^===\s*===$/)) {
                diagnostics.push(new vscode.Diagnostic(
                    new vscode.Range(i, 0, i, line.length),
                    'Block name cannot be empty',
                    vscode.DiagnosticSeverity.Error
                ));
            }
        }

        return diagnostics;
    }

    clearDiagnostics(document: vscode.TextDocument): void {
        this.diagnosticCollection.delete(document.uri);
    }

    dispose(): void {
        this.diagnosticCollection.dispose();
    }
}
