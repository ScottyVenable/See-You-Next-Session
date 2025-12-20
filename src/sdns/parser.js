/**
 * SDNS Parser - Session Dialogue and Narration System
 * Parses .session dialogue files into an AST for the dialogue engine
 * 
 * @module sdns/parser
 * @version 1.0.0
 */

// Token types used by the lexer and parser
export const TokenType = {
    // Structure
    BLOCK_START: 'BLOCK_START',       // === name ===
    BLOCK_END: 'BLOCK_END',

    // Speech
    SPEAKER: 'SPEAKER',               // PATIENT, THERAPIST, NARRATOR
    MOOD: 'MOOD',                     // (nervous), (defensive), etc.
    TEXT: 'TEXT',                     // "quoted text"
    KEYWORD: 'KEYWORD',               // [keyword text]
    KEYWORD_META: 'KEYWORD_META',     // <contradicts:id> or <reveals:id>

    // Control flow
    IF: 'IF',                         // @if
    ELSEIF: 'ELSEIF',                 // @elseif
    ELSE: 'ELSE',                     // @else
    ENDIF: 'ENDIF',                   // @endif
    WHEN: 'WHEN',                     // @when
    END: 'END',                       // @end
    GOTO: 'GOTO',                     // ->

    // Actions
    REVEAL: 'REVEAL',                 // @reveal
    RAPPORT: 'RAPPORT',               // @rapport
    FOCUS: 'FOCUS',                   // @focus
    UNLOCK: 'UNLOCK',                 // @unlock
    SET: 'SET',                       // @set
    PAUSE: 'PAUSE',                   // @pause
    TRIGGER: 'TRIGGER',               // @trigger

    // Values
    IDENTIFIER: 'IDENTIFIER',
    NUMBER: 'NUMBER',
    STRING: 'STRING',
    BOOLEAN: 'BOOLEAN',

    // Operators
    COMPARISON: 'COMPARISON',         // >=, <=, ==, !=, >, <
    LOGICAL: 'LOGICAL',               // &&, ||, !
    OPERATOR: 'OPERATOR',             // +, -

    // Misc
    COMMENT: 'COMMENT',
    NEWLINE: 'NEWLINE',
    EOF: 'EOF',
};

/**
 * Lexer - Tokenizes raw SDNS source text
 * Converts source code into a stream of tokens for the parser
 */
export class Lexer {
    constructor(source) {
        this.source = source;
        this.pos = 0;
        this.line = 1;
        this.column = 1;
        this.tokens = [];
    }

    peek(offset = 0) {
        return this.source[this.pos + offset] || '\0';
    }

    advance() {
        const char = this.source[this.pos++];
        if (char === '\n') {
            this.line++;
            this.column = 1;
        } else {
            this.column++;
        }
        return char;
    }

    skipWhitespace() {
        while (/[ \t]/.test(this.peek())) {
            this.advance();
        }
    }

    /**
     * Read a string literal (handles multi-line strings)
     */
    readString(quote) {
        let value = '';
        this.advance(); // Skip opening quote
        while (this.peek() !== quote && this.peek() !== '\0') {
            if (this.peek() === '\\') {
                this.advance();
                const escaped = this.advance();
                switch (escaped) {
                    case 'n': value += '\n'; break;
                    case 't': value += '\t'; break;
                    case '"': value += '"'; break;
                    case "'": value += "'"; break;
                    case '\\': value += '\\'; break;
                    default: value += escaped;
                }
            } else if (this.peek() === '\n') {
                // Handle multi-line strings by replacing newlines with spaces
                this.advance();
                this.line++;
                this.column = 1;
                // Skip leading whitespace on next line
                while (this.peek() === ' ' || this.peek() === '\t') {
                    this.advance();
                }
                // Add a space to join lines (unless value ends with space)
                if (value.length > 0 && !value.endsWith(' ')) {
                    value += ' ';
                }
            } else {
                value += this.advance();
            }
        }
        this.advance(); // Skip closing quote
        return value;
    }

    readIdentifier() {
        let value = '';
        // Allow dots/colons for response and tag labels (e.g., @response:sleep.quality)
        while (/[a-zA-Z0-9_.:@-]/.test(this.peek())) {
            value += this.advance();
        }
        return value;
    }

    readNumber() {
        let value = '';
        if (this.peek() === '-' || this.peek() === '+') {
            value += this.advance();
        }
        while (/[0-9.]/.test(this.peek())) {
            value += this.advance();
        }
        return parseFloat(value);
    }

    /**
     * Tokenize the source into a token array
     */
    tokenize() {
        while (this.pos < this.source.length) {
            this.skipWhitespace();
            const char = this.peek();
            const startLine = this.line;
            const startCol = this.column;

            // EOF
            if (char === '\0' || this.pos >= this.source.length) break;

            // Newlines
            if (char === '\n') {
                this.advance();
                this.tokens.push({ type: TokenType.NEWLINE, line: startLine });
                continue;
            }

            // Comments: // single line or /* multi-line */
            if (char === '/' && this.peek(1) === '/') {
                while (this.peek() !== '\n' && this.peek() !== '\0') this.advance();
                continue;
            }
            if (char === '/' && this.peek(1) === '*') {
                this.advance(); this.advance();
                while (!(this.peek() === '*' && this.peek(1) === '/') && this.peek() !== '\0') {
                    this.advance();
                }
                this.advance(); this.advance();
                continue;
            }

            // Block markers: === name ===
            if (char === '=' && this.peek(1) === '=' && this.peek(2) === '=') {
                this.advance(); this.advance(); this.advance();
                this.skipWhitespace();
                let name = '';
                while (this.peek() !== '=' && this.peek() !== '\n' && this.peek() !== '\0') {
                    name += this.advance();
                }
                name = name.trim();
                // Skip closing ===
                while (this.peek() === '=' || this.peek() === ' ') this.advance();
                this.tokens.push({ type: TokenType.BLOCK_START, value: name, line: startLine });
                continue;
            }

            // Goto: ->
            if (char === '-' && this.peek(1) === '>') {
                this.advance(); this.advance();
                this.skipWhitespace();
                const target = this.readIdentifier();
                this.tokens.push({ type: TokenType.GOTO, value: target, line: startLine });
                continue;
            }

            // Directives: @if, @else, @reveal, etc.
            if (char === '@') {
                this.advance();
                const directive = this.readIdentifier();
                this.skipWhitespace();

                switch (directive) {
                    case 'if':
                        this.tokens.push({ type: TokenType.IF, line: startLine });
                        this.readCondition();
                        break;
                    case 'elseif':
                        this.tokens.push({ type: TokenType.ELSEIF, line: startLine });
                        this.readCondition();
                        break;
                    case 'else':
                        this.tokens.push({ type: TokenType.ELSE, line: startLine });
                        break;
                    case 'endif':
                        this.tokens.push({ type: TokenType.ENDIF, line: startLine });
                        break;
                    case 'when':
                        this.tokens.push({ type: TokenType.WHEN, line: startLine });
                        this.readCondition();
                        break;
                    case 'end':
                        this.tokens.push({ type: TokenType.END, line: startLine });
                        break;
                    case 'reveal':
                        this.tokens.push({ type: TokenType.REVEAL, line: startLine });
                        this.tokens.push({ type: TokenType.IDENTIFIER, value: this.readIdentifier(), line: startLine });
                        break;
                    case 'rapport':
                        this.tokens.push({ type: TokenType.RAPPORT, line: startLine });
                        this.tokens.push({ type: TokenType.NUMBER, value: this.readNumber(), line: startLine });
                        break;
                    case 'focus':
                        this.tokens.push({ type: TokenType.FOCUS, line: startLine });
                        this.tokens.push({ type: TokenType.NUMBER, value: this.readNumber(), line: startLine });
                        break;
                    case 'unlock':
                        this.tokens.push({ type: TokenType.UNLOCK, line: startLine });
                        this.tokens.push({ type: TokenType.IDENTIFIER, value: this.readIdentifier(), line: startLine });
                        break;
                    case 'set':
                        this.tokens.push({ type: TokenType.SET, line: startLine });
                        this.readAssignment();
                        break;
                    case 'pause':
                        this.tokens.push({ type: TokenType.PAUSE, line: startLine });
                        this.tokens.push({ type: TokenType.NUMBER, value: this.readNumber(), line: startLine });
                        break;
                    case 'trigger':
                        this.tokens.push({ type: TokenType.TRIGGER, line: startLine });
                        this.readTrigger();
                        break;
                    default:
                        // Unknown directive, treat as identifier
                        this.tokens.push({ type: TokenType.IDENTIFIER, value: directive, line: startLine });
                }
                continue;
            }

            // Speakers: PATIENT, THERAPIST, NARRATOR
            if (/[A-Z]/.test(char)) {
                const word = this.readIdentifier();
                if (['PATIENT', 'THERAPIST', 'NARRATOR', 'SYSTEM'].includes(word)) {
                    this.tokens.push({ type: TokenType.SPEAKER, value: word, line: startLine });
                    this.skipWhitespace();

                    // Check for mood: (nervous)
                    if (this.peek() === '(') {
                        this.advance();
                        let mood = '';
                        while (this.peek() !== ')' && this.peek() !== '\0') {
                            mood += this.advance();
                        }
                        this.advance(); // Skip )
                        this.tokens.push({ type: TokenType.MOOD, value: mood.trim(), line: startLine });
                    }

                    // Skip colon
                    this.skipWhitespace();
                    if (this.peek() === ':') this.advance();
                    this.skipWhitespace();

                    // Read the speech text (may be on same line or next line)
                    let foundText = false;
                    if (this.peek() === '"' || this.peek() === '*') {
                        const isAction = this.peek() === '*';
                        const quote = isAction ? '*' : '"';
                        const text = this.readString(quote);
                        this.tokens.push({
                            type: TokenType.TEXT,
                            value: text,
                            isAction,
                            line: startLine
                        });
                        foundText = true;
                    }

                    // If no text on same line, check next line(s)
                    if (!foundText) {
                        // Skip to next line
                        while (this.peek() !== '\n' && this.peek() !== '\0') {
                            this.advance();
                        }
                        if (this.peek() === '\n') this.advance();
                        this.skipWhitespace();

                        // Check for text on next line
                        if (this.peek() === '"' || this.peek() === '*') {
                            const isAction = this.peek() === '*';
                            const quote = isAction ? '*' : '"';
                            const textLine = this.line;
                            const text = this.readString(quote);
                            this.tokens.push({
                                type: TokenType.TEXT,
                                value: text,
                                isAction,
                                line: textLine
                            });
                        }
                    }
                } else {
                    this.tokens.push({ type: TokenType.IDENTIFIER, value: word, line: startLine });
                }
                continue;
            }

            // Strings
            if (char === '"' || char === "'") {
                const value = this.readString(char);
                this.tokens.push({ type: TokenType.STRING, value, line: startLine });
                continue;
            }

            // Numbers
            if (/[0-9]/.test(char) || ((char === '-' || char === '+') && /[0-9]/.test(this.peek(1)))) {
                const value = this.readNumber();
                this.tokens.push({ type: TokenType.NUMBER, value, line: startLine });
                continue;
            }

            // Skip other characters
            this.advance();
        }

        this.tokens.push({ type: TokenType.EOF, line: this.line });
        return this.tokens;
    }

    /**
     * Read a condition expression (for @if, @elseif, @when)
     */
    readCondition() {
        while (this.peek() !== '\n' && this.peek() !== '\0') {
            this.skipWhitespace();
            const char = this.peek();

            // Comparison operators
            if (char === '>' || char === '<' || char === '=' || char === '!') {
                let op = this.advance();
                if (this.peek() === '=') op += this.advance();
                this.tokens.push({ type: TokenType.COMPARISON, value: op, line: this.line });
                continue;
            }

            // Logical operators
            if (char === '&' && this.peek(1) === '&') {
                this.advance(); this.advance();
                this.tokens.push({ type: TokenType.LOGICAL, value: '&&', line: this.line });
                continue;
            }
            if (char === '|' && this.peek(1) === '|') {
                this.advance(); this.advance();
                this.tokens.push({ type: TokenType.LOGICAL, value: '||', line: this.line });
                continue;
            }
            if (char === '!') {
                this.advance();
                this.tokens.push({ type: TokenType.LOGICAL, value: '!', line: this.line });
                continue;
            }

            // Function calls: has_symptom("id")
            if (/[a-z_]/.test(char)) {
                const name = this.readIdentifier();
                this.skipWhitespace();
                if (this.peek() === '(') {
                    this.advance();
                    this.skipWhitespace();
                    let arg = '';
                    if (this.peek() === '"') {
                        arg = this.readString('"');
                    } else {
                        arg = this.readIdentifier();
                    }
                    this.skipWhitespace();
                    if (this.peek() === ')') this.advance();
                    this.tokens.push({
                        type: TokenType.IDENTIFIER,
                        value: name,
                        args: [arg],
                        isFunction: true,
                        line: this.line
                    });
                } else {
                    this.tokens.push({ type: TokenType.IDENTIFIER, value: name, line: this.line });
                }
                continue;
            }

            // Numbers
            if (/[0-9]/.test(char)) {
                const value = this.readNumber();
                this.tokens.push({ type: TokenType.NUMBER, value, line: this.line });
                continue;
            }

            // Parentheses (skip for now)
            if (char === '(' || char === ')') {
                this.advance();
                continue;
            }

            // Skip unknown
            if (char !== '\n') this.advance();
        }
    }

    /**
     * Read an assignment expression (for @set)
     */
    readAssignment() {
        const varName = this.readIdentifier();
        this.tokens.push({ type: TokenType.IDENTIFIER, value: varName, line: this.line });
        this.skipWhitespace();
        if (this.peek() === '=') {
            this.advance();
            this.skipWhitespace();
            if (this.peek() === '"') {
                const value = this.readString('"');
                this.tokens.push({ type: TokenType.STRING, value, line: this.line });
            } else if (/[0-9-]/.test(this.peek())) {
                const value = this.readNumber();
                this.tokens.push({ type: TokenType.NUMBER, value, line: this.line });
            } else {
                const value = this.readIdentifier();
                if (value === 'true' || value === 'false') {
                    this.tokens.push({ type: TokenType.BOOLEAN, value: value === 'true', line: this.line });
                } else {
                    this.tokens.push({ type: TokenType.IDENTIFIER, value, line: this.line });
                }
            }
        }
    }

    /**
     * Read a trigger expression (for @trigger)
     */
    readTrigger() {
        const keyword = this.readIdentifier();
        this.tokens.push({ type: TokenType.IDENTIFIER, value: keyword, line: this.line });
        this.skipWhitespace();
        if (this.peek() === '+') {
            this.advance();
            this.skipWhitespace();
            const symptom = this.readIdentifier();
            this.tokens.push({ type: TokenType.OPERATOR, value: '+', line: this.line });
            this.tokens.push({ type: TokenType.IDENTIFIER, value: symptom, line: this.line });
        }
    }
}

/**
 * Parser - Builds AST from tokens
 * Converts token stream into an Abstract Syntax Tree for execution
 */
export class Parser {
    constructor(tokens) {
        this.tokens = tokens.filter(t => t.type !== TokenType.NEWLINE);
        this.pos = 0;
        this.ast = {
            blocks: {},
            responses: {},
            breakthroughs: {},
        };
    }

    peek(offset = 0) {
        return this.tokens[this.pos + offset] || { type: TokenType.EOF };
    }

    advance() {
        return this.tokens[this.pos++];
    }

    expect(type) {
        const token = this.advance();
        if (token.type !== type) {
            throw new Error(`Expected ${type}, got ${token.type} at line ${token.line}`);
        }
        return token;
    }

    /**
     * Parse the entire token stream
     */
    parse() {
        while (this.peek().type !== TokenType.EOF) {
            this.parseBlock();
        }
        return this.ast;
    }

    /**
     * Parse a dialogue block
     */
    parseBlock() {
        if (this.peek().type !== TokenType.BLOCK_START) {
            this.advance(); // Skip unexpected tokens
            return;
        }

        const blockToken = this.advance();
        const blockName = blockToken.value;
        const lines = [];

        // Determine block type
        const isResponse = blockName.startsWith('@response:');
        const isBreakthrough = blockName.startsWith('@breakthrough:');

        // Parse block content until next block or EOF
        while (this.peek().type !== TokenType.BLOCK_START && this.peek().type !== TokenType.EOF) {
            const node = this.parseStatement();
            if (node) lines.push(node);
        }

        // Store block
        if (isResponse) {
            const responseName = blockName.replace('@response:', '');
            this.ast.responses[responseName] = { lines };
        } else if (isBreakthrough) {
            const btName = blockName.replace('@breakthrough:', '');
            this.ast.breakthroughs[btName] = { lines };
        } else {
            this.ast.blocks[blockName] = { lines };
        }
    }

    /**
     * Parse a single statement
     */
    parseStatement() {
        const token = this.peek();

        switch (token.type) {
            case TokenType.SPEAKER:
                return this.parseSpeech();
            case TokenType.IF:
                return this.parseIf();
            case TokenType.WHEN:
                return this.parseWhen();
            case TokenType.GOTO:
                return this.parseGoto();
            case TokenType.REVEAL:
                return this.parseReveal();
            case TokenType.RAPPORT:
                return this.parseRapport();
            case TokenType.FOCUS:
                return this.parseFocus();
            case TokenType.UNLOCK:
                return this.parseUnlock();
            case TokenType.SET:
                return this.parseSet();
            case TokenType.PAUSE:
                return this.parsePause();
            case TokenType.TRIGGER:
                return this.parseTrigger();
            default:
                this.advance();
                return null;
        }
    }

    /**
     * Parse speech line
     */
    parseSpeech() {
        const speakerToken = this.advance();
        const speaker = speakerToken.value;
        let mood = null;
        let text = '';
        let isAction = false;

        // Check for mood
        if (this.peek().type === TokenType.MOOD) {
            mood = this.advance().value;
        }

        // Get text
        if (this.peek().type === TokenType.TEXT) {
            const textToken = this.advance();
            text = textToken.value;
            isAction = textToken.isAction;
        }

        // Parse annotations from text
        const keywords = this.extractKeywords(text);
        const observations = this.extractObservations(text);
        const cleanText = text
            .replace(/\[([^\]]+)\](<[^>]+>)?/g, '$1')
            .replace(/%([^%<>]+)(<[^>]+>)?%/g, '$1');

        return {
            type: 'speech',
            speaker,
            mood,
            text: cleanText,
            rawText: text,
            keywords,
            observations,
            isAction,
        };
    }

    /**
     * Extract keywords from speech text
     * Keywords are marked with [brackets] and may have <metadata>
     */
    parseMetadata(metaRaw) {
        if (!metaRaw) return {};

        const meta = {};
        metaRaw.split(';').forEach((pair) => {
            const [k, ...rest] = pair.split(':');
            if (!k || rest.length === 0) return;
            const key = k.trim();
            const value = rest.join(':').trim();
            if (key) {
                meta[key] = value;
            }
        });
        return meta;
    }

    extractKeywords(text) {
        const keywords = [];
        const regex = /\[([^\]]+)\](<([^>]+)>)?/g;
        let match;

        while ((match = regex.exec(text)) !== null) {
            const baseText = match[1];
            const keyword = {
                text: baseText,
            };

            if (match[3]) {
                Object.assign(keyword, this.parseMetadata(match[3]));
            }

            if (!keyword.id) {
                keyword.id = this.generateKeywordId(baseText);
            }

            keywords.push(keyword);
        }

        return keywords;
    }

    extractObservations(text) {
        const observations = [];
        const regex = /%([^%<>]+)(<([^>]+)>)?%/g;
        let match;

        while ((match = regex.exec(text)) !== null) {
            const baseText = match[1];
            const observation = {
                text: baseText,
            };

            if (match[3]) {
                Object.assign(observation, this.parseMetadata(match[3]));
            }

            if (!observation.id) {
                observation.id = this.generateObservationId(baseText);
            }

            observations.push(observation);
        }

        return observations;
    }

    generateKeywordId(text) {
        return 'kw-' + text.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 30);
    }

    generateObservationId(text) {
        return 'obs-' + text.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 30);
    }

    /**
     * Parse if/elseif/else conditional
     */
    parseIf() {
        this.advance(); // Skip @if
        const condition = this.parseCondition();
        const thenBranch = [];
        const elseBranch = [];
        let inElse = false;

        while (this.peek().type !== TokenType.ENDIF && this.peek().type !== TokenType.EOF) {
            if (this.peek().type === TokenType.ELSE) {
                this.advance();
                inElse = true;
                continue;
            }
            if (this.peek().type === TokenType.ELSEIF) {
                // Treat elseif as nested if in else
                inElse = true;
                const nestedIf = this.parseIf();
                elseBranch.push(nestedIf);
                return { type: 'if', condition, then: thenBranch, else: elseBranch };
            }

            const node = this.parseStatement();
            if (node) {
                if (inElse) {
                    elseBranch.push(node);
                } else {
                    thenBranch.push(node);
                }
            }
        }

        if (this.peek().type === TokenType.ENDIF) {
            this.advance();
        }

        return {
            type: 'if',
            condition,
            then: thenBranch,
            else: elseBranch,
        };
    }

    /**
     * Parse condition tokens
     */
    parseCondition() {
        const conditions = [];

        while (
            this.peek().type === TokenType.IDENTIFIER ||
            this.peek().type === TokenType.NUMBER ||
            this.peek().type === TokenType.COMPARISON ||
            this.peek().type === TokenType.LOGICAL
        ) {
            const token = this.advance();
            conditions.push(token);
        }

        return conditions;
    }

    /**
     * Parse when block (response handler)
     */
    parseWhen() {
        this.advance(); // Skip @when
        const condition = this.parseCondition();
        const lines = [];

        while (this.peek().type !== TokenType.END && this.peek().type !== TokenType.EOF) {
            const node = this.parseStatement();
            if (node) lines.push(node);
        }

        if (this.peek().type === TokenType.END) {
            this.advance();
        }

        return {
            type: 'when',
            condition,
            lines,
        };
    }

    parseGoto() {
        const gotoToken = this.advance();
        return {
            type: 'goto',
            target: gotoToken.value,
        };
    }

    parseReveal() {
        this.advance(); // Skip @reveal
        const idToken = this.expect(TokenType.IDENTIFIER);
        return {
            type: 'reveal',
            symptomId: idToken.value,
        };
    }

    parseRapport() {
        this.advance(); // Skip @rapport
        const amountToken = this.expect(TokenType.NUMBER);
        return {
            type: 'rapport',
            amount: amountToken.value,
        };
    }

    parseFocus() {
        this.advance(); // Skip @focus
        const amountToken = this.expect(TokenType.NUMBER);
        return {
            type: 'focus',
            amount: amountToken.value,
        };
    }

    parseUnlock() {
        this.advance(); // Skip @unlock
        const idToken = this.expect(TokenType.IDENTIFIER);
        return {
            type: 'unlock',
            blockId: idToken.value,
        };
    }

    parseSet() {
        this.advance(); // Skip @set
        const varToken = this.expect(TokenType.IDENTIFIER);
        let value = null;

        if (
            this.peek().type === TokenType.STRING ||
            this.peek().type === TokenType.NUMBER ||
            this.peek().type === TokenType.BOOLEAN ||
            this.peek().type === TokenType.IDENTIFIER
        ) {
            value = this.advance().value;
        }

        return {
            type: 'set',
            variable: varToken.value,
            value,
        };
    }

    parsePause() {
        this.advance(); // Skip @pause
        const durationToken = this.expect(TokenType.NUMBER);
        return {
            type: 'pause',
            duration: durationToken.value,
        };
    }

    parseTrigger() {
        this.advance(); // Skip @trigger
        const keywordToken = this.expect(TokenType.IDENTIFIER);
        let symptom = null;

        if (this.peek().type === TokenType.OPERATOR && this.peek().value === '+') {
            this.advance();
            symptom = this.expect(TokenType.IDENTIFIER).value;
        }

        return {
            type: 'trigger',
            keyword: keywordToken.value,
            symptom,
        };
    }
}

/**
 * Parse a .session dialogue file
 * @param {string} source - The source code
 * @returns {object} - The AST
 */
export function parseDialogue(source) {
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    return parser.parse();
}

/**
 * Parse dialogue from a file path (for use with fetch)
 * @param {string} path - Path to the .session file
 * @returns {Promise<object>} - The AST
 */
export async function parseDialogueFile(path) {
    const response = await fetch(path);
    const source = await response.text();
    return parseDialogue(source);
}

export default parseDialogue;
