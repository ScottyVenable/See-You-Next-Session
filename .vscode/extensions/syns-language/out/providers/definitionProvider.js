"use strict";
/**
 * SYNS Definition Provider - Go to Definition support
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
exports.SynsDefinitionProvider = void 0;
const vscode = __importStar(require("vscode"));
class SynsDefinitionProvider {
    constructor(parser, logger) {
        this.parser = parser;
        this.logger = logger;
    }
    provideDefinition(document, position, token) {
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
                    return new vscode.Location(document.uri, new vscode.Position(block.line, 0));
                }
            }
            // Check if this is a variable reference
            if (word.startsWith('$')) {
                const varName = word.substring(1);
                const definition = parsed.variables.find(v => v.name === varName && v.isSet);
                if (definition) {
                    return new vscode.Location(document.uri, new vscode.Position(definition.line, 0));
                }
            }
            // Check if hovering over a block reference in any context
            const block = parsed.blocks.find(b => b.name === word);
            if (block) {
                return new vscode.Location(document.uri, new vscode.Position(block.line, 0));
            }
        }
        catch (error) {
            this.logger.error('Error providing definition', error);
        }
        return null;
    }
}
exports.SynsDefinitionProvider = SynsDefinitionProvider;
//# sourceMappingURL=definitionProvider.js.map