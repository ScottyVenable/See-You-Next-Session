/**
 * Cognition Keywords
 * Keywords related to thoughts, beliefs, and thinking patterns
 * 
 * @module data/keywords/categories/cognition
 */

export const COGNITION_KEYWORDS = {
    // ========================================================================
    // NEGATIVE SELF-BELIEFS
    // ========================================================================

    'cognition.not-good-enough': {
        id: 'cognition.not-good-enough',
        category: 'cognition',
        displayText: 'not good enough',
        description: 'Core belief of inadequacy',
        aliases: ['not enough', 'inadequate', 'never good enough'],
        style: {
            color: '#9b59b6',
            bgColor: 'rgba(155, 89, 182, 0.18)',
            icon: 'x-circle',
            importance: 'critical'
        },
        effects: {
            focusCost: 8,
            reveals: ['core-belief-inadequacy'],
            triggers: ['cognitive-distortion'],
            rapportChange: 3
        },
        menuOptions: [
            {
                id: 'note-core-belief',
                label: 'Note: Core belief identified',
                icon: 'alert-circle',
                action: 'note',
                params: { template: 'Core belief: "Not good enough"' }
            }
        ]
    },

    'cognition.failure': {
        id: 'cognition.failure',
        category: 'cognition',
        displayText: 'failure',
        description: 'Belief of being a failure',
        aliases: ['failed', 'failing', 'never succeed'],
        style: {
            color: '#9b59b6',
            bgColor: 'rgba(155, 89, 182, 0.15)',
            icon: 'thumbs-down',
            importance: 'high'
        },
        effects: {
            focusCost: 7,
            reveals: ['self-criticism'],
            rapportChange: 2
        }
    },

    'cognition.unlovable': {
        id: 'cognition.unlovable',
        category: 'cognition',
        displayText: 'unlovable',
        description: 'Belief of being unworthy of love',
        aliases: ['no one loves me', 'cant be loved', 'dont deserve love'],
        style: {
            color: '#8e44ad',
            bgColor: 'rgba(142, 68, 173, 0.2)',
            icon: 'heart-off',
            importance: 'critical'
        },
        effects: {
            focusCost: 10,
            reveals: ['core-belief-unlovable'],
            triggers: ['attachment-issue'],
            rapportChange: 4
        }
    },

    // ========================================================================
    // COGNITIVE DISTORTIONS
    // ========================================================================

    'cognition.always-wrong': {
        id: 'cognition.always-wrong',
        category: 'cognition',
        displayText: 'always',
        description: 'All-or-nothing thinking',
        aliases: ['never', 'every time', 'without exception'],
        style: {
            color: '#3498db',
            bgColor: 'rgba(52, 152, 219, 0.15)',
            icon: 'repeat',
            importance: 'medium'
        },
        effects: {
            focusCost: 4,
            reveals: ['cognitive-distortion-absolute']
        },
        note: 'Look for all-or-nothing thinking patterns'
    },

    'cognition.should': {
        id: 'cognition.should',
        category: 'cognition',
        displayText: 'should',
        description: 'Should statements - self-imposed rules',
        aliases: ['must', 'have to', 'supposed to'],
        style: {
            color: '#3498db',
            bgColor: 'rgba(52, 152, 219, 0.12)',
            icon: 'check-square',
            importance: 'medium'
        },
        effects: {
            focusCost: 4,
            reveals: ['cognitive-distortion-should']
        }
    },

    'cognition.mind-reading': {
        id: 'cognition.mind-reading',
        category: 'cognition',
        displayText: 'they think',
        description: 'Assuming knowledge of others\' thoughts',
        aliases: ['they must think', 'everyone thinks', 'people see me as'],
        style: {
            color: '#3498db',
            bgColor: 'rgba(52, 152, 219, 0.15)',
            icon: 'eye',
            importance: 'medium'
        },
        effects: {
            focusCost: 5,
            reveals: ['cognitive-distortion-mindreading']
        },
        menuOptions: [
            {
                id: 'challenge-thought',
                label: 'Ask: How do you know that?',
                icon: 'message-circle',
                action: 'queue-topic',
                params: { topic: 'cognition.evidence' }
            }
        ]
    },

    'cognition.catastrophizing': {
        id: 'cognition.catastrophizing',
        category: 'cognition',
        displayText: 'worst case',
        description: 'Expecting the worst outcome',
        aliases: ['disaster', 'terrible', 'awful', 'end of the world'],
        style: {
            color: '#e74c3c',
            bgColor: 'rgba(231, 76, 60, 0.15)',
            icon: 'alert-triangle',
            importance: 'high'
        },
        effects: {
            focusCost: 6,
            reveals: ['cognitive-distortion-catastrophizing']
        }
    },

    // ========================================================================
    // FEAR & WORRY THOUGHTS
    // ========================================================================

    'cognition.what-if': {
        id: 'cognition.what-if',
        category: 'cognition',
        displayText: 'what if',
        description: 'Anticipatory worry pattern',
        aliases: ['but what if', 'imagine if'],
        style: {
            color: '#e74c3c',
            bgColor: 'rgba(231, 76, 60, 0.12)',
            icon: 'help-circle',
            importance: 'medium'
        },
        effects: {
            focusCost: 4,
            reveals: ['anticipatory-anxiety']
        }
    },

    'cognition.something-wrong': {
        id: 'cognition.something-wrong',
        category: 'cognition',
        displayText: 'something wrong',
        description: 'Vague sense that something is wrong',
        aliases: ['off', 'not right', 'bad feeling'],
        style: {
            color: '#9b59b6',
            bgColor: 'rgba(155, 89, 182, 0.12)',
            icon: 'alert-circle',
            importance: 'medium'
        },
        effects: {
            focusCost: 5,
            reveals: ['generalized-anxiety']
        }
    },

    'cognition.going-crazy': {
        id: 'cognition.going-crazy',
        category: 'cognition',
        displayText: 'going crazy',
        description: 'Fear of losing control or sanity',
        aliases: ['losing my mind', 'insane', 'mental'],
        style: {
            color: '#8e44ad',
            bgColor: 'rgba(142, 68, 173, 0.18)',
            icon: 'alert-octagon',
            importance: 'critical'
        },
        effects: {
            focusCost: 8,
            reveals: ['fear-of-losing-control'],
            rapportChange: 3
        },
        menuOptions: [
            {
                id: 'normalize',
                label: 'Note: Normalize experience',
                icon: 'heart',
                action: 'note'
            }
        ]
    },

    // ========================================================================
    // IDENTITY & SELF-PERCEPTION
    // ========================================================================

    'cognition.fake': {
        id: 'cognition.fake',
        category: 'cognition',
        displayText: 'fake',
        description: 'Feeling inauthentic or like an imposter',
        aliases: ['imposter', 'fraud', 'pretending', 'not real me'],
        style: {
            color: '#f39c12',
            bgColor: 'rgba(243, 156, 18, 0.15)',
            icon: 'mask',
            importance: 'high'
        },
        effects: {
            focusCost: 6,
            reveals: ['imposter-feelings']
        }
    },

    'cognition.dont-know-who': {
        id: 'cognition.dont-know-who',
        category: 'cognition',
        displayText: 'don\'t know who I am',
        description: 'Identity confusion',
        aliases: ['lost myself', 'who am I', 'dont recognize myself'],
        style: {
            color: '#8e44ad',
            bgColor: 'rgba(142, 68, 173, 0.18)',
            icon: 'user-x',
            importance: 'high'
        },
        effects: {
            focusCost: 7,
            reveals: ['identity-confusion'],
            rapportChange: 2
        }
    },

    // ========================================================================
    // SUICIDAL IDEATION (CRITICAL)
    // ========================================================================

    'cognition.better-off': {
        id: 'cognition.better-off',
        category: 'cognition',
        displayText: 'better off without me',
        description: 'CRITICAL: Suicidal ideation indicator',
        aliases: ['everyone be better', 'wouldnt miss me', 'dont want to be here'],
        style: {
            color: '#c0392b',
            bgColor: 'rgba(192, 57, 43, 0.25)',
            icon: 'alert-octagon',
            animation: 'pulse',
            importance: 'critical'
        },
        effects: {
            focusCost: 0,
            reveals: ['suicidal-ideation'],
            triggers: ['safety-critical'],
            rapportChange: 5
        },
        menuOptions: [
            {
                id: 'safety-immediate',
                label: '⚠️ IMMEDIATE SAFETY ASSESSMENT',
                icon: 'shield',
                action: 'queue-topic',
                params: { topic: 'safety.immediate', priority: 'critical' }
            }
        ],
        note: 'CRITICAL: Always assess for safety immediately'
    },

    'cognition.end-it': {
        id: 'cognition.end-it',
        category: 'cognition',
        displayText: 'end it',
        description: 'CRITICAL: Direct suicidal ideation',
        aliases: ['kill myself', 'not be alive', 'disappear'],
        style: {
            color: '#c0392b',
            bgColor: 'rgba(192, 57, 43, 0.3)',
            icon: 'alert-octagon',
            animation: 'pulse',
            importance: 'critical'
        },
        effects: {
            focusCost: 0,
            reveals: ['active-suicidal-ideation'],
            triggers: ['safety-critical'],
            rapportChange: 5
        },
        menuOptions: [
            {
                id: 'safety-immediate',
                label: '⚠️ IMMEDIATE SAFETY ASSESSMENT',
                icon: 'shield',
                action: 'queue-topic',
                params: { topic: 'safety.immediate', priority: 'critical' }
            }
        ],
        note: 'CRITICAL: Direct SI - immediate safety protocol'
    }
};

export default COGNITION_KEYWORDS;
