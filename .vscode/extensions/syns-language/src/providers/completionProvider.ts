/**
 * SYNS Completion Provider - IntelliSense completions
 */

import * as vscode from 'vscode';
import { SynsLogger } from '../utils/logger';
import { SynsDocumentParser } from '../parser/documentParser';
import {
    SPEAKERS, MOODS, DIRECTIVES, BUILTIN_FUNCTIONS,
    BUILTIN_VARIABLES, DOCUMENTATION, MOOD_DESCRIPTIONS
} from '../utils/constants';

export class SynsCompletionProvider implements vscode.CompletionItemProvider {
    private parser: SynsDocumentParser;
    private logger: SynsLogger;

    constructor(parser: SynsDocumentParser, logger: SynsLogger) {
        this.parser = parser;
        this.logger = logger;
    }

    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): vscode.CompletionItem[] | vscode.CompletionList {
        const line = document.lineAt(position).text;
        const linePrefix = line.substring(0, position.character);
        const items: vscode.CompletionItem[] = [];

        try {
            // After @ - suggest directives
            if (linePrefix.match(/@\w*$/)) {
                items.push(...this.getDirectiveCompletions());
            }

            // After ( - suggest moods for speakers
            else if (linePrefix.match(/^\s*(PATIENT|THERAPIST|NARRATOR)\s*\(\w*$/)) {
                items.push(...this.getMoodCompletions());
            }

            // After -> suggest blocks
            else if (linePrefix.match(/->\s*\w*$/)) {
                items.push(...this.getBlockCompletions(document));
            }

            // At start of line - suggest speakers or blocks
            else if (linePrefix.match(/^\s*\w*$/)) {
                items.push(...this.getSpeakerCompletions());
                items.push(...this.getBlockStartCompletion());
            }

            // After @if/@elseif - suggest conditions
            else if (linePrefix.match(/@(if|elseif)\s+/)) {
                items.push(...this.getConditionCompletions(document));
            }

            // After @reveal/@unlock - suggest IDs
            else if (linePrefix.match(/@(reveal|unlock)\s+\w*$/)) {
                items.push(...this.getSymptomCompletions(document));
            }

            // After @response:/@breakthrough: - suggest topics
            else if (linePrefix.match(/===\s*@(response|breakthrough):\w*$/)) {
                items.push(...this.getTopicCompletions());
            }

            // Inside strings after [ - suggest keywords
            else if (linePrefix.match(/\[\w*$/)) {
                items.push(...this.getKeywordCompletions(document));
            }

            // Inside has_symptom/has_keyword etc function calls
            else if (linePrefix.match(/(has_symptom|has_keyword|has_breakthrough|asked_about)\s*\(\s*"?\w*$/)) {
                items.push(...this.getFunctionArgCompletions(document, linePrefix));
            }

            // After $ - suggest variables
            else if (linePrefix.match(/\$\w*$/)) {
                items.push(...this.getVariableCompletions(document));
            }

        } catch (error) {
            this.logger.error('Error providing completions', error as Error);
        }

        return items;
    }

    private getDirectiveCompletions(): vscode.CompletionItem[] {
        return DIRECTIVES.map(directive => {
            const item = new vscode.CompletionItem(`@${directive}`, vscode.CompletionItemKind.Keyword);
            const doc = DOCUMENTATION[`@${directive}`];
            if (doc) {
                item.detail = doc.signature;
                item.documentation = new vscode.MarkdownString(doc.description);
                if (doc.example) {
                    item.documentation.appendCodeblock(doc.example, 'syns');
                }
            }

            // Add snippets for common directives
            switch (directive) {
                case 'if':
                    item.insertText = new vscode.SnippetString('if ${1:condition}\n    $0\n@endif');
                    break;
                case 'reveal':
                    item.insertText = new vscode.SnippetString('reveal ${1:symptom-id}');
                    break;
                case 'unlock':
                    item.insertText = new vscode.SnippetString('unlock ${1:topic-id}');
                    break;
                case 'set':
                    item.insertText = new vscode.SnippetString('set ${1:variable} = ${2:value}');
                    break;
                case 'rapport':
                    item.insertText = new vscode.SnippetString('rapport ${1|+5,+8,+10,-3,-5,-8|}');
                    break;
                case 'focus':
                    item.insertText = new vscode.SnippetString('focus ${1|+10,+15,-10,-15|}');
                    break;
                case 'pause':
                    item.insertText = new vscode.SnippetString('pause ${1:1.5}');
                    break;
                case 'when':
                    item.insertText = new vscode.SnippetString('when ${1|symptom_revealed,keyword_used,breakthrough|}:${2:id}\n    $0\n@end');
                    break;
            }

            return item;
        });
    }

    private getMoodCompletions(): vscode.CompletionItem[] {
        return MOODS.map(mood => {
            const item = new vscode.CompletionItem(mood, vscode.CompletionItemKind.EnumMember);
            item.detail = 'Mood';
            item.documentation = MOOD_DESCRIPTIONS[mood] || mood;
            item.insertText = mood + ')';
            return item;
        });
    }

    private getSpeakerCompletions(): vscode.CompletionItem[] {
        return SPEAKERS.map(speaker => {
            const item = new vscode.CompletionItem(speaker, vscode.CompletionItemKind.Class);
            const doc = DOCUMENTATION[speaker];
            if (doc) {
                item.detail = doc.signature;
                item.documentation = new vscode.MarkdownString(doc.description);
            }

            // Add snippet for full dialogue line
            if (speaker === 'PATIENT') {
                item.insertText = new vscode.SnippetString('PATIENT (${1|nervous,anxious,defensive,relieved,sad,hopeful,stressed,vulnerable,thoughtful,hesitant,guarded|})\n"${2:dialogue}"');
            } else if (speaker === 'NARRATOR') {
                item.insertText = new vscode.SnippetString('NARRATOR\n*${1:description}*');
            } else {
                item.insertText = new vscode.SnippetString(`${speaker}\n"\${1:dialogue}"`);
            }

            return item;
        });
    }

    private getBlockStartCompletion(): vscode.CompletionItem[] {
        const blockItem = new vscode.CompletionItem('=== block ===', vscode.CompletionItemKind.Struct);
        blockItem.insertText = new vscode.SnippetString('=== ${1:block-name} ===\n$0');
        blockItem.detail = 'New block';
        blockItem.documentation = 'Create a new dialogue block';

        const responseItem = new vscode.CompletionItem('=== @response ===', vscode.CompletionItemKind.Event);
        responseItem.insertText = new vscode.SnippetString('=== @response:${1:topic}.${2:subtopic} ===\n$0');
        responseItem.detail = 'Response handler';
        responseItem.documentation = 'Create a response handler block';

        const breakthroughItem = new vscode.CompletionItem('=== @breakthrough ===', vscode.CompletionItemKind.Event);
        breakthroughItem.insertText = new vscode.SnippetString('=== @breakthrough:${1:topic} ===\n@trigger ${2:condition}\n$0\n@end');
        breakthroughItem.detail = 'Breakthrough moment';
        breakthroughItem.documentation = 'Create a breakthrough block';

        return [blockItem, responseItem, breakthroughItem];
    }

    private getBlockCompletions(document: vscode.TextDocument): vscode.CompletionItem[] {
        const parsed = this.parser.parse(document);
        return parsed.blocks.map(block => {
            const item = new vscode.CompletionItem(block.name, vscode.CompletionItemKind.Reference);
            item.detail = `Block at line ${block.line + 1}`;
            item.documentation = `Type: ${block.type}`;
            return item;
        });
    }

    private getConditionCompletions(document: vscode.TextDocument): vscode.CompletionItem[] {
        const items: vscode.CompletionItem[] = [];

        // Built-in variables
        for (const variable of BUILTIN_VARIABLES) {
            const item = new vscode.CompletionItem(variable, vscode.CompletionItemKind.Variable);
            const doc = DOCUMENTATION[variable];
            if (doc) {
                item.detail = doc.signature;
                item.documentation = doc.description;
            }
            items.push(item);
        }

        // Built-in functions
        for (const func of BUILTIN_FUNCTIONS) {
            const item = new vscode.CompletionItem(func, vscode.CompletionItemKind.Function);
            const doc = DOCUMENTATION[func];
            if (doc) {
                item.detail = doc.signature;
                item.documentation = doc.description;
            }
            item.insertText = new vscode.SnippetString(`${func}("\${1:id}")`);
            items.push(item);
        }

        // Document variables
        const parsed = this.parser.parse(document);
        const definedVars = new Set<string>();
        for (const v of parsed.variables) {
            if (v.isSet && !definedVars.has(v.name)) {
                definedVars.add(v.name);
                const item = new vscode.CompletionItem(`$${v.name}`, vscode.CompletionItemKind.Variable);
                item.detail = `Defined at line ${v.line + 1}`;
                items.push(item);
            }
        }

        // Comparison operators with snippets
        items.push(this.createOperatorSnippet('rapport >= ', 'rapport >= ${1:60}', 'Rapport comparison'));
        items.push(this.createOperatorSnippet('rapport < ', 'rapport < ${1:40}', 'Rapport comparison'));
        items.push(this.createOperatorSnippet('has_symptom()', 'has_symptom("${1:symptom-id}")', 'Check symptom'));
        items.push(this.createOperatorSnippet('has_keyword()', 'has_keyword("${1:keyword}")', 'Check keyword'));

        return items;
    }

    private createOperatorSnippet(label: string, snippet: string, detail: string): vscode.CompletionItem {
        const item = new vscode.CompletionItem(label, vscode.CompletionItemKind.Snippet);
        item.insertText = new vscode.SnippetString(snippet);
        item.detail = detail;
        return item;
    }

    private getSymptomCompletions(document: vscode.TextDocument): vscode.CompletionItem[] {
        // Extract symptoms from @reveal statements in the document
        const text = document.getText();
        const symptoms = new Set<string>();
        const revealMatches = text.matchAll(/@reveal\s+([\w-]+)/g);
        for (const match of revealMatches) {
            symptoms.add(match[1]);
        }

        // Add common symptoms
        const commonSymptoms = [
            'insomnia', 'racing-thoughts', 'anxiety-admission', 'childhood-anxiety',
            'perfectionism-origin', 'work-anxiety', 'social-isolation', 'trust-issues',
            'physical-tension', 'mood-fluctuation', 'bags-under-eyes', 'bitten-nails'
        ];
        for (const s of commonSymptoms) {
            symptoms.add(s);
        }

        return Array.from(symptoms).map(symptom => {
            const item = new vscode.CompletionItem(symptom, vscode.CompletionItemKind.Constant);
            item.detail = 'Symptom/Insight ID';
            return item;
        });
    }

    private getTopicCompletions(): vscode.CompletionItem[] {
        const topics = [
            { label: 'family.parents', detail: 'Family - Parents' },
            { label: 'family.childhood', detail: 'Family - Childhood' },
            { label: 'family.siblings', detail: 'Family - Siblings' },
            { label: 'work.job', detail: 'Work - Job' },
            { label: 'work.stress', detail: 'Work - Stress' },
            { label: 'work.colleagues', detail: 'Work - Colleagues' },
            { label: 'work.performance', detail: 'Work - Performance' },
            { label: 'emotions.anxiety', detail: 'Emotions - Anxiety' },
            { label: 'emotions.mood', detail: 'Emotions - Mood' },
            { label: 'emotions.worry', detail: 'Emotions - Worry' },
            { label: 'emotions.fear', detail: 'Emotions - Fear' },
            { label: 'emotions.sleep', detail: 'Emotions - Sleep' },
            { label: 'sleep.routine', detail: 'Sleep - Routine' },
            { label: 'sleep.dreams', detail: 'Sleep - Dreams' },
            { label: 'relationships.friends', detail: 'Relationships - Friends' },
            { label: 'relationships.partner', detail: 'Relationships - Partner' },
            { label: 'relationships.trust', detail: 'Relationships - Trust' },
            { label: 'physical.symptoms', detail: 'Physical - Symptoms' },
            { label: 'physical.appetite', detail: 'Physical - Appetite' },
            { label: 'physical.exercise', detail: 'Physical - Exercise' },
            { label: 'self.identity', detail: 'Self - Identity' },
            { label: 'self.future', detail: 'Self - Future' },
            { label: 'self.strengths', detail: 'Self - Strengths' },
            { label: 'self.coping', detail: 'Self - Coping' },
            { label: 'therapy.expectations', detail: 'Therapy - Expectations' },
            { label: 'therapy.previous', detail: 'Therapy - Previous' },
            { label: 'therapy.concerns', detail: 'Therapy - Concerns' }
        ];

        return topics.map(t => {
            const item = new vscode.CompletionItem(t.label, vscode.CompletionItemKind.Module);
            item.detail = t.detail;
            return item;
        });
    }

    private getKeywordCompletions(document: vscode.TextDocument): vscode.CompletionItem[] {
        // Extract existing keywords from the document
        const text = document.getText();
        const keywords = new Set<string>();
        const keywordMatches = text.matchAll(/\[([^\]]+)\]/g);
        for (const match of keywordMatches) {
            keywords.add(match[1]);
        }

        return Array.from(keywords).map(keyword => {
            const item = new vscode.CompletionItem(keyword, vscode.CompletionItemKind.Text);
            item.detail = 'Dialogue keyword';
            item.insertText = keyword + ']';
            return item;
        });
    }

    private getFunctionArgCompletions(document: vscode.TextDocument, linePrefix: string): vscode.CompletionItem[] {
        if (linePrefix.includes('has_symptom')) {
            return this.getSymptomCompletions(document);
        }
        if (linePrefix.includes('asked_about')) {
            return this.getTopicCompletions();
        }
        // has_keyword and has_breakthrough would use document-specific values
        return [];
    }

    private getVariableCompletions(document: vscode.TextDocument): vscode.CompletionItem[] {
        const items: vscode.CompletionItem[] = [];
        const parsed = this.parser.parse(document);

        const seenVars = new Set<string>();
        for (const v of parsed.variables) {
            if (!seenVars.has(v.name)) {
                seenVars.add(v.name);
                const item = new vscode.CompletionItem(v.name, vscode.CompletionItemKind.Variable);
                item.detail = v.isSet ? `Set at line ${v.line + 1}` : 'Variable reference';
                items.push(item);
            }
        }

        // Add common state variables
        const commonVars = ['breakthrough_sleep', 'admitted_anxiety', 'admitted_sleep', 'revealed_childhood'];
        for (const v of commonVars) {
            if (!seenVars.has(v)) {
                const item = new vscode.CompletionItem(v, vscode.CompletionItemKind.Variable);
                item.detail = 'Common state variable';
                items.push(item);
            }
        }

        return items;
    }
}
