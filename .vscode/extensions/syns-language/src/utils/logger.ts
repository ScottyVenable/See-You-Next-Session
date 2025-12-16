/**
 * SYNS Logger - Centralized logging for the extension
 */

import * as vscode from 'vscode';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
};

export class SynsLogger {
    private outputChannel: vscode.OutputChannel;
    private name: string;

    constructor(name: string) {
        this.name = name;
        this.outputChannel = vscode.window.createOutputChannel(name);
    }

    private getConfig(): { enabled: boolean; level: LogLevel } {
        const config = vscode.workspace.getConfiguration('syns.logging');
        return {
            enabled: config.get<boolean>('enabled', false),
            level: config.get<LogLevel>('level', 'info')
        };
    }

    private shouldLog(level: LogLevel): boolean {
        const config = this.getConfig();
        if (!config.enabled && level !== 'error') {
            return false;
        }
        return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[config.level];
    }

    private formatMessage(level: LogLevel, message: string): string {
        const timestamp = new Date().toISOString();
        const levelStr = level.toUpperCase().padEnd(5);
        return `[${timestamp}] [${levelStr}] ${message}`;
    }

    debug(message: string, ...args: any[]): void {
        if (this.shouldLog('debug')) {
            const formatted = this.formatMessage('debug', message);
            this.outputChannel.appendLine(formatted);
            if (args.length > 0) {
                this.outputChannel.appendLine(`  Data: ${JSON.stringify(args, null, 2)}`);
            }
        }
    }

    info(message: string, ...args: any[]): void {
        if (this.shouldLog('info')) {
            const formatted = this.formatMessage('info', message);
            this.outputChannel.appendLine(formatted);
            if (args.length > 0) {
                this.outputChannel.appendLine(`  Data: ${JSON.stringify(args, null, 2)}`);
            }
        }
    }

    warn(message: string, ...args: any[]): void {
        if (this.shouldLog('warn')) {
            const formatted = this.formatMessage('warn', message);
            this.outputChannel.appendLine(formatted);
            if (args.length > 0) {
                this.outputChannel.appendLine(`  Data: ${JSON.stringify(args, null, 2)}`);
            }
        }
    }

    error(message: string, error?: Error): void {
        // Errors are always logged
        const formatted = this.formatMessage('error', message);
        this.outputChannel.appendLine(formatted);
        if (error) {
            this.outputChannel.appendLine(`  Error: ${error.message}`);
            if (error.stack) {
                this.outputChannel.appendLine(`  Stack: ${error.stack}`);
            }
        }
    }

    show(): void {
        this.outputChannel.show();
    }

    dispose(): void {
        this.outputChannel.dispose();
    }
}
