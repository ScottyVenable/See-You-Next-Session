"use strict";
/**
 * SYNS Logger - Centralized logging for the extension
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
exports.SynsLogger = void 0;
const vscode = __importStar(require("vscode"));
const LOG_LEVEL_PRIORITY = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
};
class SynsLogger {
    constructor(name) {
        this.name = name;
        this.outputChannel = vscode.window.createOutputChannel(name);
    }
    getConfig() {
        const config = vscode.workspace.getConfiguration('syns.logging');
        return {
            enabled: config.get('enabled', false),
            level: config.get('level', 'info')
        };
    }
    shouldLog(level) {
        const config = this.getConfig();
        if (!config.enabled && level !== 'error') {
            return false;
        }
        return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[config.level];
    }
    formatMessage(level, message) {
        const timestamp = new Date().toISOString();
        const levelStr = level.toUpperCase().padEnd(5);
        return `[${timestamp}] [${levelStr}] ${message}`;
    }
    debug(message, ...args) {
        if (this.shouldLog('debug')) {
            const formatted = this.formatMessage('debug', message);
            this.outputChannel.appendLine(formatted);
            if (args.length > 0) {
                this.outputChannel.appendLine(`  Data: ${JSON.stringify(args, null, 2)}`);
            }
        }
    }
    info(message, ...args) {
        if (this.shouldLog('info')) {
            const formatted = this.formatMessage('info', message);
            this.outputChannel.appendLine(formatted);
            if (args.length > 0) {
                this.outputChannel.appendLine(`  Data: ${JSON.stringify(args, null, 2)}`);
            }
        }
    }
    warn(message, ...args) {
        if (this.shouldLog('warn')) {
            const formatted = this.formatMessage('warn', message);
            this.outputChannel.appendLine(formatted);
            if (args.length > 0) {
                this.outputChannel.appendLine(`  Data: ${JSON.stringify(args, null, 2)}`);
            }
        }
    }
    error(message, error) {
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
    show() {
        this.outputChannel.show();
    }
    dispose() {
        this.outputChannel.dispose();
    }
}
exports.SynsLogger = SynsLogger;
//# sourceMappingURL=logger.js.map