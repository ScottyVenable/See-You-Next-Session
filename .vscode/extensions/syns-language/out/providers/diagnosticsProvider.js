"use strict";
/**
 * SYNS Diagnostics Provider - Error checking and warnings
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
exports.SynsDiagnosticsProvider = void 0;
const vscode = __importStar(require("vscode"));
class SynsDiagnosticsProvider {
    constructor(parser, logger) {
        this.parser = parser;
        this.logger = logger;
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection('syns');
    }
    getConfig() {
        const config = vscode.workspace.getConfiguration('syns.diagnostics');
        return {
            enabled: config.get('enabled', true),
            severity: {
                unusedBlock: config.get('severity.unusedBlock', 'warning'),
                undefinedGoto: config.get('severity.undefinedGoto', 'error'),
                unclosedConditional: config.get('severity.unclosedConditional', 'error')
            }
        };
    }
    toVscodeSeverity(severity) {
        switch (severity) {
            case 'error': return vscode.DiagnosticSeverity.Error;
            case 'warning': return vscode.DiagnosticSeverity.Warning;
            case 'information': return vscode.DiagnosticSeverity.Information;
            case 'hint': return vscode.DiagnosticSeverity.Hint;
        }
    }
    validateDocument(document) {
        const config = this.getConfig();
        if (!config.enabled) {
            this.diagnosticCollection.delete(document.uri);
            return;
        }
        this.logger.debug(`Validating document: ${document.fileName}`);
        try {
            const parsed = this.parser.parse(document);
            const diagnostics = [];
            for (const diag of parsed.diagnostics) {
                // Apply severity configuration
                let severity = this.toVscodeSeverity(diag.severity);
                if (diag.code === 'unused-block') {
                    severity = this.toVscodeSeverity(config.severity.unusedBlock);
                }
                else if (diag.code === 'undefined-block') {
                    severity = this.toVscodeSeverity(config.severity.undefinedGoto);
                }
                else if (diag.code.startsWith('unclosed-') || diag.code.startsWith('orphan-')) {
                    severity = this.toVscodeSeverity(config.severity.unclosedConditional);
                }
                const range = new vscode.Range(diag.line, diag.column, diag.line, diag.endColumn);
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
        }
        catch (error) {
            this.logger.error('Error validating document', error);
        }
    }
    checkSyntax(document) {
        const diagnostics = [];
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
                    diagnostics.push(new vscode.Diagnostic(new vscode.Range(i, 0, i, line.length), 'Unclosed string literal', vscode.DiagnosticSeverity.Warning));
                }
            }
            // Check for invalid speaker format
            const speakerMatch = trimmed.match(/^(PATIENT|THERAPIST|NARRATOR|SYSTEM)\s*(.*)$/);
            if (speakerMatch) {
                const afterSpeaker = speakerMatch[2];
                // Should be empty, have a mood, or have a colon for inline
                if (afterSpeaker && !afterSpeaker.match(/^\([\w-]+\)/) && !afterSpeaker.startsWith(':')) {
                    diagnostics.push(new vscode.Diagnostic(new vscode.Range(i, 0, i, line.length), 'Invalid speaker format. Use: SPEAKER, SPEAKER (mood), or SPEAKER: "dialogue"', vscode.DiagnosticSeverity.Warning));
                }
            }
            // Check for invalid block format
            if (trimmed.includes('===') && !trimmed.match(/^===\s*\S+\s*===$/)) {
                if (!trimmed.startsWith('//')) {
                    diagnostics.push(new vscode.Diagnostic(new vscode.Range(i, 0, i, line.length), 'Invalid block format. Use: === block-name ===', vscode.DiagnosticSeverity.Error));
                }
            }
            // Check for invalid directive format
            const directiveMatch = trimmed.match(/^@(\w+)/);
            if (directiveMatch) {
                const directive = directiveMatch[1];
                const validDirectives = ['if', 'elseif', 'else', 'endif', 'when', 'end',
                    'trigger', 'reveal', 'unlock', 'set', 'rapport', 'focus', 'pause'];
                if (!validDirectives.includes(directive)) {
                    diagnostics.push(new vscode.Diagnostic(new vscode.Range(i, line.indexOf('@'), i, line.indexOf('@') + directive.length + 1), `Unknown directive: @${directive}`, vscode.DiagnosticSeverity.Warning));
                }
            }
            // Check @rapport/@focus format
            const rapportMatch = trimmed.match(/^@(rapport|focus)\s+(.*)$/);
            if (rapportMatch) {
                const value = rapportMatch[2].trim();
                if (!value.match(/^[+-]?\d+$/)) {
                    diagnostics.push(new vscode.Diagnostic(new vscode.Range(i, 0, i, line.length), `Invalid ${rapportMatch[1]} value. Use: @${rapportMatch[1]} +/-number`, vscode.DiagnosticSeverity.Error));
                }
            }
            // Check @pause format
            const pauseMatch = trimmed.match(/^@pause\s+(.*)$/);
            if (pauseMatch) {
                const value = pauseMatch[1].trim();
                if (!value.match(/^\d+(\.\d+)?$/)) {
                    diagnostics.push(new vscode.Diagnostic(new vscode.Range(i, 0, i, line.length), 'Invalid pause value. Use: @pause seconds (e.g., @pause 1.5)', vscode.DiagnosticSeverity.Error));
                }
            }
            // Check for empty blocks (===  ===)
            if (trimmed.match(/^===\s*===$/)) {
                diagnostics.push(new vscode.Diagnostic(new vscode.Range(i, 0, i, line.length), 'Block name cannot be empty', vscode.DiagnosticSeverity.Error));
            }
        }
        return diagnostics;
    }
    clearDiagnostics(document) {
        this.diagnosticCollection.delete(document.uri);
    }
    dispose() {
        this.diagnosticCollection.dispose();
    }
}
exports.SynsDiagnosticsProvider = SynsDiagnosticsProvider;
//# sourceMappingURL=diagnosticsProvider.js.map