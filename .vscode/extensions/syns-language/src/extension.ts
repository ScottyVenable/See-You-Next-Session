/**
 * SYNS Dialogue Language - VS Code Extension
 * 
 * Provides IntelliSense, diagnostics, and navigation for .syns dialogue files
 * used in "See You Next Session" game.
 */

import * as vscode from 'vscode';
import { SynsCompletionProvider } from './providers/completionProvider';
import { SynsDiagnosticsProvider } from './providers/diagnosticsProvider';
import { SynsHoverProvider } from './providers/hoverProvider';
import { SynsDefinitionProvider } from './providers/definitionProvider';
import { SynsDocumentSymbolProvider } from './providers/symbolProvider';
import { SynsLogger } from './utils/logger';
import { SynsDocumentParser } from './parser/documentParser';

let diagnosticsProvider: SynsDiagnosticsProvider;
let logger: SynsLogger;

export function activate(context: vscode.ExtensionContext) {
    // Initialize logger
    logger = new SynsLogger('SYNS Dialogue');
    logger.info('SYNS Dialogue extension activating...');

    const selector: vscode.DocumentSelector = { language: 'syns', scheme: 'file' };

    // Initialize document parser (shared across providers)
    const parser = new SynsDocumentParser(logger);

    // Register completion provider
    const completionProvider = new SynsCompletionProvider(parser, logger);
    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
            selector,
            completionProvider,
            '@', '(', '-', '>', ':', '.', '"', '['
        )
    );
    logger.debug('Completion provider registered');

    // Register hover provider
    const hoverProvider = new SynsHoverProvider(parser, logger);
    context.subscriptions.push(
        vscode.languages.registerHoverProvider(selector, hoverProvider)
    );
    logger.debug('Hover provider registered');

    // Register definition provider (Go to Definition)
    const definitionProvider = new SynsDefinitionProvider(parser, logger);
    context.subscriptions.push(
        vscode.languages.registerDefinitionProvider(selector, definitionProvider)
    );
    logger.debug('Definition provider registered');

    // Register document symbol provider (Outline view)
    const symbolProvider = new SynsDocumentSymbolProvider(parser, logger);
    context.subscriptions.push(
        vscode.languages.registerDocumentSymbolProvider(selector, symbolProvider)
    );
    logger.debug('Symbol provider registered');

    // Initialize diagnostics provider
    diagnosticsProvider = new SynsDiagnosticsProvider(parser, logger);
    context.subscriptions.push(diagnosticsProvider);
    logger.debug('Diagnostics provider registered');

    // Register commands
    registerCommands(context, parser);

    // Set up document change listeners
    setupDocumentListeners(context);

    logger.info('SYNS Dialogue extension activated successfully');
}

function registerCommands(context: vscode.ExtensionContext, parser: SynsDocumentParser) {
    // Validate document command
    context.subscriptions.push(
        vscode.commands.registerCommand('syns.validateDocument', () => {
            const editor = vscode.window.activeTextEditor;
            if (editor && editor.document.languageId === 'syns') {
                diagnosticsProvider.validateDocument(editor.document);
                vscode.window.showInformationMessage('SYNS document validated');
            } else {
                vscode.window.showWarningMessage('No SYNS file is currently open');
            }
        })
    );

    // Go to block command
    context.subscriptions.push(
        vscode.commands.registerCommand('syns.goToBlock', async () => {
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
        })
    );

    // List all blocks command
    context.subscriptions.push(
        vscode.commands.registerCommand('syns.listBlocks', async () => {
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
        })
    );

    // Show output channel command
    context.subscriptions.push(
        vscode.commands.registerCommand('syns.showOutputChannel', () => {
            logger.show();
        })
    );

    logger.debug('Commands registered');
}

function setupDocumentListeners(context: vscode.ExtensionContext) {
    // Validate on open
    context.subscriptions.push(
        vscode.workspace.onDidOpenTextDocument(document => {
            if (document.languageId === 'syns') {
                logger.debug(`Document opened: ${document.fileName}`);
                diagnosticsProvider.validateDocument(document);
            }
        })
    );

    // Validate on change (with debounce)
    let changeTimeout: NodeJS.Timeout | undefined;
    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(event => {
            if (event.document.languageId === 'syns') {
                if (changeTimeout) {
                    clearTimeout(changeTimeout);
                }
                changeTimeout = setTimeout(() => {
                    diagnosticsProvider.validateDocument(event.document);
                }, 500);
            }
        })
    );

    // Clear diagnostics on close
    context.subscriptions.push(
        vscode.workspace.onDidCloseTextDocument(document => {
            if (document.languageId === 'syns') {
                diagnosticsProvider.clearDiagnostics(document);
            }
        })
    );

    // Validate all open SYNS documents on activation
    vscode.workspace.textDocuments.forEach(document => {
        if (document.languageId === 'syns') {
            diagnosticsProvider.validateDocument(document);
        }
    });
}

export function deactivate() {
    if (logger) {
        logger.info('SYNS Dialogue extension deactivated');
    }
}
