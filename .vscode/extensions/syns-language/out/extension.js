"use strict";
/**
 * SYNS Dialogue Language - VS Code Extension
 *
 * Provides IntelliSense, diagnostics, and navigation for .syns dialogue files
 * used in "See You Next Session" game.
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
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const completionProvider_1 = require("./providers/completionProvider");
const diagnosticsProvider_1 = require("./providers/diagnosticsProvider");
const hoverProvider_1 = require("./providers/hoverProvider");
const definitionProvider_1 = require("./providers/definitionProvider");
const symbolProvider_1 = require("./providers/symbolProvider");
const logger_1 = require("./utils/logger");
const documentParser_1 = require("./parser/documentParser");
let diagnosticsProvider;
let logger;
function activate(context) {
    // Initialize logger
    logger = new logger_1.SynsLogger('SYNS Dialogue');
    logger.info('SYNS Dialogue extension activating...');
    const selector = { language: 'syns', scheme: 'file' };
    // Initialize document parser (shared across providers)
    const parser = new documentParser_1.SynsDocumentParser(logger);
    // Register completion provider
    const completionProvider = new completionProvider_1.SynsCompletionProvider(parser, logger);
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(selector, completionProvider, '@', '(', '-', '>', ':', '.', '"', '['));
    logger.debug('Completion provider registered');
    // Register hover provider
    const hoverProvider = new hoverProvider_1.SynsHoverProvider(parser, logger);
    context.subscriptions.push(vscode.languages.registerHoverProvider(selector, hoverProvider));
    logger.debug('Hover provider registered');
    // Register definition provider (Go to Definition)
    const definitionProvider = new definitionProvider_1.SynsDefinitionProvider(parser, logger);
    context.subscriptions.push(vscode.languages.registerDefinitionProvider(selector, definitionProvider));
    logger.debug('Definition provider registered');
    // Register document symbol provider (Outline view)
    const symbolProvider = new symbolProvider_1.SynsDocumentSymbolProvider(parser, logger);
    context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(selector, symbolProvider));
    logger.debug('Symbol provider registered');
    // Initialize diagnostics provider
    diagnosticsProvider = new diagnosticsProvider_1.SynsDiagnosticsProvider(parser, logger);
    context.subscriptions.push(diagnosticsProvider);
    logger.debug('Diagnostics provider registered');
    // Register commands
    registerCommands(context, parser);
    // Set up document change listeners
    setupDocumentListeners(context);
    logger.info('SYNS Dialogue extension activated successfully');
}
exports.activate = activate;
function registerCommands(context, parser) {
    // Validate document command
    context.subscriptions.push(vscode.commands.registerCommand('syns.validateDocument', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === 'syns') {
            diagnosticsProvider.validateDocument(editor.document);
            vscode.window.showInformationMessage('SYNS document validated');
        }
        else {
            vscode.window.showWarningMessage('No SYNS file is currently open');
        }
    }));
    // Go to block command
    context.subscriptions.push(vscode.commands.registerCommand('syns.goToBlock', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.document.languageId !== 'syns') {
            return;
        }
        const position = editor.selection.active;
        const wordRange = editor.document.getWordRangeAtPosition(position, /[\w@:.-]+/);
        if (!wordRange) {
            return;
        }
        const word = editor.document.getText(wordRange);
        const parsed = parser.parse(editor.document);
        // Check if this is a goto target
        const block = parsed.blocks.find(b => b.name === word);
        if (block) {
            const targetPosition = new vscode.Position(block.line, 0);
            editor.selection = new vscode.Selection(targetPosition, targetPosition);
            editor.revealRange(new vscode.Range(targetPosition, targetPosition), vscode.TextEditorRevealType.InCenter);
        }
    }));
    // List all blocks command
    context.subscriptions.push(vscode.commands.registerCommand('syns.listBlocks', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.document.languageId !== 'syns') {
            vscode.window.showWarningMessage('No SYNS file is currently open');
            return;
        }
        const parsed = parser.parse(editor.document);
        const items = parsed.blocks.map(block => ({
            label: block.name,
            description: `Line ${block.line + 1}`,
            detail: block.type === 'response' ? 'Response Handler' :
                block.type === 'breakthrough' ? 'Breakthrough' : 'Block',
            block
        }));
        const selected = await vscode.window.showQuickPick(items, {
            placeHolder: 'Select a block to navigate to',
            matchOnDescription: true
        });
        if (selected) {
            const position = new vscode.Position(selected.block.line, 0);
            editor.selection = new vscode.Selection(position, position);
            editor.revealRange(new vscode.Range(position, position), vscode.TextEditorRevealType.InCenter);
        }
    }));
    // Show output channel command
    context.subscriptions.push(vscode.commands.registerCommand('syns.showOutputChannel', () => {
        logger.show();
    }));
    logger.debug('Commands registered');
}
function setupDocumentListeners(context) {
    // Validate on open
    context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(document => {
        if (document.languageId === 'syns') {
            logger.debug(`Document opened: ${document.fileName}`);
            diagnosticsProvider.validateDocument(document);
        }
    }));
    // Validate on change (with debounce)
    let changeTimeout;
    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(event => {
        if (event.document.languageId === 'syns') {
            if (changeTimeout) {
                clearTimeout(changeTimeout);
            }
            changeTimeout = setTimeout(() => {
                diagnosticsProvider.validateDocument(event.document);
            }, 500);
        }
    }));
    // Clear diagnostics on close
    context.subscriptions.push(vscode.workspace.onDidCloseTextDocument(document => {
        if (document.languageId === 'syns') {
            diagnosticsProvider.clearDiagnostics(document);
        }
    }));
    // Validate all open SYNS documents on activation
    vscode.workspace.textDocuments.forEach(document => {
        if (document.languageId === 'syns') {
            diagnosticsProvider.validateDocument(document);
        }
    });
}
function deactivate() {
    if (logger) {
        logger.info('SYNS Dialogue extension deactivated');
    }
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map