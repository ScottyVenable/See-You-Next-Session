/**
 * Behavior Keywords
 * Keywords related to actions, habits, and behavioral patterns
 * 
 * @module data/keywords/categories/behaviors
 */

export const BEHAVIOR_KEYWORDS = {
    // ========================================================================
    // AVOIDANCE BEHAVIORS
    // ========================================================================

    'behavior.avoiding': {
        id: 'behavior.avoiding',
        category: 'behavior',
        displayText: 'avoiding',
        description: 'Patient avoids certain situations or activities',
        aliases: ['avoid', 'stay away from', 'dont go'],
        style: {
            color: '#27ae60',
            bgColor: 'rgba(39, 174, 96, 0.12)',
            icon: 'arrow-right',
            importance: 'medium'
        },
        effects: {
            focusCost: 5,
            reveals: ['avoidance-behavior']
        },
        menuOptions: [
            {
                id: 'ask-what-avoid',
                label: 'Ask: What do you avoid?',
                icon: 'message-circle',
                action: 'queue-topic',
                params: { topic: 'avoidance.specifics' }
            }
        ]
    },

    'behavior.isolation': {
        id: 'behavior.isolation',
        category: 'behavior',
        displayText: 'isolating',
        description: 'Withdrawing from social contact',
        aliases: ['isolate', 'stay home', 'avoid people', 'keep to myself'],
        style: {
            color: '#3498db',
            bgColor: 'rgba(52, 152, 219, 0.15)',
            icon: 'user-minus',
            importance: 'high'
        },
        effects: {
            focusCost: 6,
            reveals: ['social-withdrawal'],
            rapportChange: 2
        }
    },

    // ========================================================================
    // CHECKING & COMPULSIVE
    // ========================================================================

    'behavior.checking': {
        id: 'behavior.checking',
        category: 'behavior',
        displayText: 'checking',
        description: 'Repetitive checking behavior',
        aliases: ['check', 'double-check', 'triple-check', 'make sure'],
        style: {
            color: '#9b59b6',
            bgColor: 'rgba(155, 89, 182, 0.15)',
            icon: 'check-square',
            importance: 'high'
        },
        effects: {
            focusCost: 6,
            reveals: ['checking-behavior']
        },
        menuOptions: [
            {
                id: 'ask-what-check',
                label: 'Ask: What do you check?',
                icon: 'message-circle',
                action: 'queue-topic',
                params: { topic: 'checking.specifics' }
            },
            {
                id: 'ask-how-often',
                label: 'Ask: How many times?',
                icon: 'message-circle',
                action: 'queue-topic',
                params: { topic: 'checking.frequency' }
            }
        ]
    },

    'behavior.over-and-over': {
        id: 'behavior.over-and-over',
        category: 'behavior',
        displayText: 'over and over',
        description: 'Repetitive action pattern',
        aliases: ['again and again', 'repeatedly', 'multiple times', 'cant stop'],
        style: {
            color: '#9b59b6',
            bgColor: 'rgba(155, 89, 182, 0.18)',
            icon: 'repeat',
            importance: 'high'
        },
        effects: {
            focusCost: 7,
            reveals: ['compulsive-pattern'],
            triggers: ['ocd-indicator']
        }
    },

    // ========================================================================
    // REASSURANCE SEEKING
    // ========================================================================

    'behavior.reassurance-seeking': {
        id: 'behavior.reassurance-seeking',
        category: 'behavior',
        displayText: 'need reassurance',
        description: 'Seeking validation from others',
        aliases: ['tell me its okay', 'is that normal', 'am I right'],
        style: {
            color: '#f39c12',
            bgColor: 'rgba(243, 156, 18, 0.15)',
            icon: 'help-circle',
            importance: 'medium'
        },
        effects: {
            focusCost: 4,
            reveals: ['reassurance-seeking']
        },
        menuOptions: [
            {
                id: 'note-reassurance',
                label: 'Note: Seeks validation',
                icon: 'note',
                action: 'note'
            }
        ]
    },

    // ========================================================================
    // SLEEP BEHAVIORS
    // ========================================================================

    'behavior.cant-sleep': {
        id: 'behavior.cant-sleep',
        category: 'behavior',
        displayText: 'can\'t sleep',
        description: 'Difficulty falling or staying asleep',
        aliases: ['trouble sleeping', 'cant fall asleep', 'insomnia', 'lie awake'],
        style: {
            color: '#9b59b6',
            bgColor: 'rgba(155, 89, 182, 0.15)',
            icon: 'moon',
            importance: 'high'
        },
        effects: {
            focusCost: 6,
            reveals: ['sleep-disturbance'],
            triggers: ['insomnia-indicator']
        },
        menuOptions: [
            {
                id: 'ask-sleep-pattern',
                label: 'Ask: What happens at night?',
                icon: 'message-circle',
                action: 'queue-topic',
                params: { topic: 'sleep.pattern' }
            }
        ]
    },

    'behavior.racing-mind': {
        id: 'behavior.racing-mind',
        category: 'behavior',
        displayText: 'mind racing',
        description: 'Thoughts moving rapidly, hard to control',
        aliases: ['cant stop thinking', 'thoughts wont stop', 'mind wont shut off'],
        style: {
            color: '#e74c3c',
            bgColor: 'rgba(231, 76, 60, 0.15)',
            icon: 'zap',
            importance: 'high'
        },
        effects: {
            focusCost: 7,
            reveals: ['racing-thoughts']
        }
    },

    // ========================================================================
    // EATING BEHAVIORS
    // ========================================================================

    'behavior.not-eating': {
        id: 'behavior.not-eating',
        category: 'behavior',
        displayText: 'not eating',
        description: 'Reduced appetite or eating avoidance',
        aliases: ['lost appetite', 'dont feel hungry', 'skipping meals'],
        style: {
            color: '#e67e22',
            bgColor: 'rgba(230, 126, 34, 0.15)',
            icon: 'x-circle',
            importance: 'medium'
        },
        effects: {
            focusCost: 5,
            reveals: ['appetite-change']
        }
    },

    'behavior.overeating': {
        id: 'behavior.overeating',
        category: 'behavior',
        displayText: 'overeating',
        description: 'Increased eating or emotional eating',
        aliases: ['eating too much', 'comfort eating', 'binge'],
        style: {
            color: '#e67e22',
            bgColor: 'rgba(230, 126, 34, 0.15)',
            icon: 'plus-circle',
            importance: 'medium'
        },
        effects: {
            focusCost: 5,
            reveals: ['appetite-change']
        }
    },

    // ========================================================================
    // SELF-HARM & SUBSTANCE
    // ========================================================================

    'behavior.self-harm': {
        id: 'behavior.self-harm',
        category: 'behavior',
        displayText: 'hurt myself',
        description: 'Self-harming behavior - CRITICAL SAFETY INDICATOR',
        aliases: ['cutting', 'burning', 'hitting myself'],
        style: {
            color: '#c0392b',
            bgColor: 'rgba(192, 57, 43, 0.25)',
            icon: 'alert-octagon',
            animation: 'pulse',
            importance: 'critical'
        },
        effects: {
            focusCost: 0, // No cost - always collectible
            reveals: ['self-harm'],
            triggers: ['safety-critical'],
            rapportChange: 5
        },
        menuOptions: [
            {
                id: 'safety-protocol',
                label: '⚠️ SAFETY ASSESSMENT',
                icon: 'shield',
                action: 'queue-topic',
                params: { topic: 'safety.immediate', priority: 'critical' }
            }
        ],
        note: 'CRITICAL: Always trigger safety assessment'
    },

    'behavior.drinking': {
        id: 'behavior.drinking',
        category: 'behavior',
        displayText: 'drinking',
        description: 'Alcohol use that may be problematic',
        aliases: ['alcohol', 'few drinks', 'drinking more'],
        style: {
            color: '#e67e22',
            bgColor: 'rgba(230, 126, 34, 0.15)',
            icon: 'droplet',
            importance: 'high'
        },
        effects: {
            focusCost: 5,
            reveals: ['substance-use']
        },
        menuOptions: [
            {
                id: 'ask-quantity',
                label: 'Ask: How much/how often?',
                icon: 'message-circle',
                action: 'queue-topic',
                params: { topic: 'substance.quantity' }
            }
        ]
    },

    // ========================================================================
    // PERFORMANCE & WORK
    // ========================================================================

    'behavior.perfectionism': {
        id: 'behavior.perfectionism',
        category: 'behavior',
        displayText: 'has to be perfect',
        description: 'Perfectionist tendencies',
        aliases: ['perfect', 'exactly right', 'cant make mistakes'],
        style: {
            color: '#3498db',
            bgColor: 'rgba(52, 152, 219, 0.15)',
            icon: 'award',
            importance: 'medium'
        },
        effects: {
            focusCost: 5,
            reveals: ['perfectionism']
        }
    },

    'behavior.procrastinating': {
        id: 'behavior.procrastinating',
        category: 'behavior',
        displayText: 'procrastinating',
        description: 'Delaying tasks or decisions',
        aliases: ['putting off', 'avoiding tasks', 'cant get started'],
        style: {
            color: '#7f8c8d',
            bgColor: 'rgba(127, 140, 141, 0.12)',
            icon: 'clock',
            importance: 'low'
        },
        effects: {
            focusCost: 3,
            reveals: ['avoidance-behavior']
        }
    }
};

export default BEHAVIOR_KEYWORDS;
