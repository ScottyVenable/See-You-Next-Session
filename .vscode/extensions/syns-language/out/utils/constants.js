"use strict";
/**
 * SYNS Language Constants - Keywords, directives, moods, etc.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MOOD_DESCRIPTIONS = exports.DOCUMENTATION = exports.BLOCK_TYPES = exports.OPERATORS = exports.BUILTIN_VARIABLES = exports.BUILTIN_FUNCTIONS = exports.DIRECTIVES = exports.MOODS = exports.SPEAKERS = void 0;
exports.SPEAKERS = ['PATIENT', 'THERAPIST', 'NARRATOR', 'SYSTEM'];
exports.MOODS = [
    'nervous', 'anxious', 'defensive', 'relieved', 'sad', 'angry', 'hopeful',
    'stressed', 'vulnerable', 'thoughtful', 'hesitant', 'guarded', 'dismissive',
    'surprised', 'embarrassed', 'frustrated', 'deflecting', 'honest', 'skeptical',
    'tired', 'exhausted', 'neutral', 'small-smile', 'guilty'
];
exports.DIRECTIVES = [
    'if', 'elseif', 'else', 'endif',
    'when', 'end', 'trigger',
    'reveal', 'unlock', 'set',
    'rapport', 'focus', 'pause'
];
exports.BUILTIN_FUNCTIONS = [
    'has_symptom', 'has_keyword', 'has_breakthrough', 'asked_about'
];
exports.BUILTIN_VARIABLES = [
    'rapport', 'focus', 'turn', 'breakthroughs'
];
exports.OPERATORS = ['>=', '<=', '==', '!=', '>', '<', '&&', '||', '!', '+', '-', '='];
exports.BLOCK_TYPES = {
    NORMAL: 'normal',
    RESPONSE: 'response',
    BREAKTHROUGH: 'breakthrough',
    WHEN: 'when'
};
// Documentation for hover provider
exports.DOCUMENTATION = {
    // Directives
    '@if': {
        signature: '@if <condition>',
        description: 'Starts a conditional block. Content inside is only shown if the condition is true.',
        example: '@if rapport >= 60\n    PATIENT (happy)\n    "Thanks!"\n@endif'
    },
    '@elseif': {
        signature: '@elseif <condition>',
        description: 'Alternative condition within an @if block.',
        example: '@elseif rapport >= 40'
    },
    '@else': {
        signature: '@else',
        description: 'Default branch when no @if or @elseif conditions are met.'
    },
    '@endif': {
        signature: '@endif',
        description: 'Closes an @if conditional block.'
    },
    '@when': {
        signature: '@when <event>:<id>',
        description: 'Defines a trigger that fires when a specific event occurs.',
        example: '@when symptom_revealed:insomnia'
    },
    '@end': {
        signature: '@end',
        description: 'Closes a @when trigger block.'
    },
    '@trigger': {
        signature: '@trigger <condition>',
        description: 'Defines the condition that triggers a breakthrough.',
        example: '@trigger keyword-sleep-lie + bags-under-eyes'
    },
    '@reveal': {
        signature: '@reveal <symptom-id>',
        description: 'Reveals a symptom or insight to the player.',
        example: '@reveal insomnia'
    },
    '@unlock': {
        signature: '@unlock <topic-id>',
        description: 'Unlocks a new topic for the player to explore.',
        example: '@unlock deep_sleep_discussion'
    },
    '@set': {
        signature: '@set <variable> = <value>',
        description: 'Sets a state variable that persists across the session.',
        example: '@set admitted_anxiety = true'
    },
    '@rapport': {
        signature: '@rapport <+/-amount>',
        description: 'Changes the patient rapport level.',
        example: '@rapport +10'
    },
    '@focus': {
        signature: '@focus <+/-amount>',
        description: 'Changes the player focus meter.',
        example: '@focus -15'
    },
    '@pause': {
        signature: '@pause <seconds>',
        description: 'Pauses dialogue for dramatic effect.',
        example: '@pause 1.5'
    },
    // Functions
    'has_symptom': {
        signature: 'has_symptom("<symptom-id>")',
        description: 'Returns true if the specified symptom has been revealed.',
        example: 'has_symptom("bags-under-eyes")'
    },
    'has_keyword': {
        signature: 'has_keyword("<keyword>")',
        description: 'Returns true if the player has used the specified keyword.',
        example: 'has_keyword("sleep")'
    },
    'has_breakthrough': {
        signature: 'has_breakthrough("<topic>")',
        description: 'Returns true if the specified breakthrough has been achieved.',
        example: 'has_breakthrough("sleep")'
    },
    'asked_about': {
        signature: 'asked_about("<topic>")',
        description: 'Returns true if the player has asked about the topic.',
        example: 'asked_about("family.parents")'
    },
    // Variables
    'rapport': {
        signature: 'rapport',
        description: 'The current rapport level with the patient (0-100).'
    },
    'focus': {
        signature: 'focus',
        description: 'The player\'s current focus meter value.'
    },
    'turn': {
        signature: 'turn',
        description: 'The current turn number in the session.'
    },
    'breakthroughs': {
        signature: 'breakthroughs',
        description: 'The number of breakthroughs achieved in the session.'
    },
    // Speakers
    'PATIENT': {
        signature: 'PATIENT [(mood)]',
        description: 'The patient character speaks. Can include a mood modifier.',
        example: 'PATIENT (nervous)\n"I\'m not sure about this..."'
    },
    'THERAPIST': {
        signature: 'THERAPIST',
        description: 'The therapist (player) character speaks.',
        example: 'THERAPIST\n"Tell me more about that."'
    },
    'NARRATOR': {
        signature: 'NARRATOR',
        description: 'Narrative description or stage directions.',
        example: 'NARRATOR\n*The patient shifts uncomfortably in their seat.*'
    },
    'SYSTEM': {
        signature: 'SYSTEM',
        description: 'System messages or game instructions.',
        example: 'SYSTEM\n"Tutorial: Try asking about sleep."'
    }
};
// Mood descriptions for hover
exports.MOOD_DESCRIPTIONS = {
    nervous: 'Showing anxiety or unease',
    anxious: 'Feeling worried or uneasy',
    defensive: 'Protecting oneself from perceived criticism',
    relieved: 'Feeling reassured after worry',
    sad: 'Showing or feeling sorrow',
    angry: 'Feeling or showing strong displeasure',
    hopeful: 'Feeling optimistic about the future',
    stressed: 'Under mental or emotional strain',
    vulnerable: 'Emotionally exposed or unguarded',
    thoughtful: 'Showing careful consideration',
    hesitant: 'Tentative or unsure',
    guarded: 'Wary and unwilling to share',
    dismissive: 'Brushing off the topic',
    surprised: 'Caught off guard',
    embarrassed: 'Feeling self-conscious',
    frustrated: 'Feeling upset or annoyed',
    deflecting: 'Redirecting away from the topic',
    honest: 'Speaking truthfully and openly',
    skeptical: 'Doubtful or questioning',
    tired: 'Showing fatigue',
    exhausted: 'Completely drained of energy',
    neutral: 'Showing no particular emotion',
    'small-smile': 'A slight, genuine smile',
    guilty: 'Feeling responsible for wrongdoing'
};
//# sourceMappingURL=constants.js.map