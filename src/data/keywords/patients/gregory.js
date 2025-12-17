/**
 * Gregory Vigil - Patient-Specific Keywords
 * Keywords unique to Gregory's presentation and story
 * 
 * @module data/keywords/patients/gregory
 */

export const GREGORY_KEYWORDS = {
    // ========================================================================
    // GREGORY'S UNIQUE EXPRESSIONS
    // ========================================================================

    'gregory.time.months-actually': {
        id: 'gregory.time.months-actually',
        category: 'time',
        patientId: 'gregory',
        displayText: 'Months, actually',
        description: 'Gregory reveals the true duration of his struggles',
        style: {
            color: '#6b7fd7',
            bgColor: 'rgba(107, 127, 215, 0.18)',
            icon: 'calendar',
            importance: 'high'
        },
        effects: {
            focusCost: 5,
            reveals: ['symptom-duration'],
            rapportChange: 3,
            setVars: { 'gregory_admitted_duration': true }
        },
        menuOptions: [
            {
                id: 'note-duration',
                label: 'Note: Months of struggling',
                icon: 'note',
                action: 'note',
                params: { template: 'Gregory has been struggling for months before seeking help' }
            },
            {
                id: 'ask-why-wait',
                label: 'Ask: What made you wait?',
                icon: 'message-circle',
                action: 'queue-topic',
                params: { topic: 'therapy.delay' }
            }
        ],
        note: 'First admission of duration - builds trust'
    },

    'gregory.cognition.overreacting': {
        id: 'gregory.cognition.overreacting',
        category: 'cognition',
        patientId: 'gregory',
        displayText: 'overreacting',
        description: 'Gregory minimizes his own experiences',
        style: {
            color: '#9b59b6',
            bgColor: 'rgba(155, 89, 182, 0.15)',
            icon: 'minimize',
            importance: 'medium'
        },
        effects: {
            focusCost: 4,
            reveals: ['self-doubt', 'minimization'],
            rapportChange: 2
        },
        menuOptions: [
            {
                id: 'validate',
                label: 'Note: Validate his concerns',
                icon: 'heart',
                action: 'note'
            }
        ],
        note: 'Classic anxiety presentation - doubting own experiences'
    },

    'gregory.cognition.nothing-serious': {
        id: 'gregory.cognition.nothing-serious',
        category: 'cognition',
        patientId: 'gregory',
        displayText: 'nothing serious',
        description: 'Gregory downplays his symptoms',
        style: {
            color: '#7f8c8d',
            bgColor: 'rgba(127, 140, 141, 0.12)',
            icon: 'minimize-2',
            importance: 'medium'
        },
        effects: {
            focusCost: 3,
            reveals: ['minimization']
        }
    },

    // ========================================================================
    // SLEEP ISSUES
    // ========================================================================

    'gregory.behavior.sleep-fine': {
        id: 'gregory.behavior.sleep-fine',
        category: 'behavior',
        patientId: 'gregory',
        displayText: 'I sleep fine',
        description: 'Gregory\'s defensive denial about sleep issues',
        style: {
            color: '#e74c3c',
            bgColor: 'rgba(231, 76, 60, 0.12)',
            icon: 'moon',
            importance: 'high'
        },
        effects: {
            focusCost: 5,
            contradicts: ['bags-under-eyes', 'exhausted-appearance'],
            reveals: ['denial-sleep']
        },
        menuOptions: [
            {
                id: 'note-contradiction',
                label: 'Note: Contradicts appearance',
                icon: 'alert-triangle',
                action: 'note',
                params: { template: 'Says sleep is fine, but shows visible signs of sleep deprivation' }
            }
        ],
        note: 'Will contradict visible symptoms'
    },

    'gregory.behavior.mind-wont-shutoff': {
        id: 'gregory.behavior.mind-wont-shutoff',
        category: 'behavior',
        patientId: 'gregory',
        displayText: 'shut off',
        description: 'Gregory describing racing thoughts at night',
        style: {
            color: '#9b59b6',
            bgColor: 'rgba(155, 89, 182, 0.15)',
            icon: 'zap',
            importance: 'high'
        },
        effects: {
            focusCost: 6,
            reveals: ['racing-thoughts', 'rumination'],
            triggers: ['anxiety-marker']
        }
    },

    'gregory.behavior.replaying-conversations': {
        id: 'gregory.behavior.replaying-conversations',
        category: 'behavior',
        patientId: 'gregory',
        displayText: 'Replaying conversations',
        description: 'Gregory admits to ruminating on past interactions',
        style: {
            color: '#e74c3c',
            bgColor: 'rgba(231, 76, 60, 0.15)',
            icon: 'repeat',
            importance: 'high'
        },
        effects: {
            focusCost: 7,
            reveals: ['rumination', 'social-anxiety'],
            rapportChange: 4
        },
        menuOptions: [
            {
                id: 'explore-content',
                label: 'Ask: What conversations?',
                icon: 'message-circle',
                action: 'queue-topic',
                params: { topic: 'rumination.content' }
            }
        ]
    },

    // ========================================================================
    // SOCIAL ANXIETY / HYPERVIGILANCE
    // ========================================================================

    'gregory.emotion.being-watched': {
        id: 'gregory.emotion.being-watched',
        category: 'emotion',
        patientId: 'gregory',
        displayText: 'being watched',
        description: 'Gregory feels observed and judged',
        style: {
            color: '#e74c3c',
            bgColor: 'rgba(231, 76, 60, 0.18)',
            icon: 'eye',
            importance: 'high'
        },
        effects: {
            focusCost: 7,
            reveals: ['hypervigilance', 'paranoid-ideation'],
            triggers: ['anxiety-marker']
        },
        menuOptions: [
            {
                id: 'explore-watched',
                label: 'Ask: Tell me more about that',
                icon: 'message-circle',
                action: 'queue-topic',
                params: { topic: 'social.hypervigilance' }
            }
        ]
    },

    'gregory.cognition.doing-correctly': {
        id: 'gregory.cognition.doing-correctly',
        category: 'cognition',
        patientId: 'gregory',
        displayText: 'doing things correctly',
        description: 'Gregory\'s perfectionism and need for rules',
        style: {
            color: '#3498db',
            bgColor: 'rgba(52, 152, 219, 0.15)',
            icon: 'check-square',
            importance: 'high'
        },
        effects: {
            focusCost: 6,
            reveals: ['perfectionism', 'rule-bound-thinking']
        }
    },

    'gregory.cognition.following-process': {
        id: 'gregory.cognition.following-process',
        category: 'cognition',
        patientId: 'gregory',
        displayText: 'following the process correctly',
        description: 'Gregory seeks structure and rules even in therapy',
        style: {
            color: '#3498db',
            bgColor: 'rgba(52, 152, 219, 0.15)',
            icon: 'list',
            importance: 'medium'
        },
        effects: {
            focusCost: 4,
            reveals: ['perfectionism-therapy']
        }
    },

    // ========================================================================
    // SELF-DOUBT
    // ========================================================================

    'gregory.cognition.not-best-judge': {
        id: 'gregory.cognition.not-best-judge',
        category: 'cognition',
        patientId: 'gregory',
        displayText: 'not the best judge',
        description: 'Gregory doubts his own perception',
        style: {
            color: '#9b59b6',
            bgColor: 'rgba(155, 89, 182, 0.15)',
            icon: 'help-circle',
            importance: 'high'
        },
        effects: {
            focusCost: 6,
            reveals: ['self-doubt', 'external-locus'],
            rapportChange: 2
        }
    },

    'gregory.cognition.trust-perception': {
        id: 'gregory.cognition.trust-perception',
        category: 'cognition',
        patientId: 'gregory',
        displayText: 'trust my own perception',
        description: 'Gregory admits he cannot trust himself',
        style: {
            color: '#8e44ad',
            bgColor: 'rgba(142, 68, 173, 0.2)',
            icon: 'eye-off',
            importance: 'critical'
        },
        effects: {
            focusCost: 10,
            reveals: ['deep-self-doubt', 'external-validation'],
            triggers: ['breakthrough-potential'],
            rapportChange: 6
        },
        menuOptions: [
            {
                id: 'note-breakthrough',
                label: '★ Major insight',
                icon: 'star',
                action: 'note',
                params: { template: 'Gregory admits he cannot trust his own perception - core issue' }
            }
        ],
        note: 'This is a potential breakthrough moment'
    },

    // ========================================================================
    // APPEARANCE & PERFORMANCE
    // ========================================================================

    'gregory.behavior.checking-mirrors': {
        id: 'gregory.behavior.checking-mirrors',
        category: 'behavior',
        patientId: 'gregory',
        displayText: 'check myself in mirrors',
        description: 'Gregory compulsively checks his appearance',
        style: {
            color: '#9b59b6',
            bgColor: 'rgba(155, 89, 182, 0.15)',
            icon: 'square',
            importance: 'high'
        },
        effects: {
            focusCost: 6,
            reveals: ['appearance-anxiety', 'checking-behavior']
        }
    },

    'gregory.cognition.not-put-together': {
        id: 'gregory.cognition.not-put-together',
        category: 'cognition',
        patientId: 'gregory',
        displayText: 'don\'t feel put-together',
        description: 'Gregory reveals the disconnect between appearance and feelings',
        style: {
            color: '#e74c3c',
            bgColor: 'rgba(231, 76, 60, 0.18)',
            icon: 'layers',
            importance: 'high'
        },
        effects: {
            focusCost: 7,
            reveals: ['disconnect-inside-outside', 'mask'],
            rapportChange: 4
        }
    },

    'gregory.behavior.performing': {
        id: 'gregory.behavior.performing',
        category: 'behavior',
        patientId: 'gregory',
        displayText: 'performing',
        description: 'Gregory admits to constantly performing normalcy',
        style: {
            color: '#f39c12',
            bgColor: 'rgba(243, 156, 18, 0.18)',
            icon: 'theater',
            importance: 'critical'
        },
        effects: {
            focusCost: 8,
            reveals: ['masking', 'exhaustion-from-performing'],
            triggers: ['identity-insight'],
            rapportChange: 5
        },
        menuOptions: [
            {
                id: 'explore-performing',
                label: 'Ask: What does performing look like?',
                icon: 'message-circle',
                action: 'queue-topic',
                params: { topic: 'self.performance' }
            }
        ]
    },

    // ========================================================================
    // FAMILY HISTORY
    // ========================================================================

    'gregory.relationship.high-expectations': {
        id: 'gregory.relationship.high-expectations',
        category: 'relationship',
        patientId: 'gregory',
        displayText: 'high expectations',
        description: 'Gregory\'s family had perfectionist standards',
        style: {
            color: '#f39c12',
            bgColor: 'rgba(243, 156, 18, 0.15)',
            icon: 'award',
            importance: 'high'
        },
        effects: {
            focusCost: 6,
            reveals: ['family-expectations', 'perfectionism-origin']
        }
    },

    'gregory.emotion.terrified-mistakes': {
        id: 'gregory.emotion.terrified-mistakes',
        category: 'emotion',
        patientId: 'gregory',
        displayText: 'terrified of making mistakes',
        description: 'Gregory reveals childhood fear',
        style: {
            color: '#c0392b',
            bgColor: 'rgba(192, 57, 43, 0.18)',
            icon: 'alert-triangle',
            importance: 'critical'
        },
        effects: {
            focusCost: 9,
            reveals: ['childhood-anxiety', 'perfectionism-origin'],
            triggers: ['family-breakthrough'],
            rapportChange: 6
        }
    },

    'gregory.cognition.feelings-didnt-matter': {
        id: 'gregory.cognition.feelings-didnt-matter',
        category: 'cognition',
        patientId: 'gregory',
        displayText: 'feelings didn\'t matter',
        description: 'Gregory learned to suppress emotions',
        style: {
            color: '#8e44ad',
            bgColor: 'rgba(142, 68, 173, 0.2)',
            icon: 'slash',
            importance: 'critical'
        },
        effects: {
            focusCost: 10,
            reveals: ['emotional-invalidation', 'childhood-invalidation'],
            triggers: ['family-breakthrough'],
            rapportChange: 8
        },
        menuOptions: [
            {
                id: 'note-invalidation',
                label: '★ Childhood invalidation',
                icon: 'star',
                action: 'note',
                params: { template: 'Gregory learned emotions were less important than appearance' }
            }
        ],
        note: 'Key insight into the origin of his anxiety'
    },

    // ========================================================================
    // PHYSICAL APPEARANCE NOTES
    // ========================================================================

    'gregory.appearance.red-hair': {
        id: 'gregory.appearance.red-hair',
        category: 'appearance',
        patientId: 'gregory',
        displayText: 'red hair',
        description: 'Gregory feels he stands out due to appearance',
        style: {
            color: '#e67e22',
            bgColor: 'rgba(230, 126, 34, 0.12)',
            icon: 'user',
            importance: 'low'
        },
        effects: {
            focusCost: 2
        }
    },

    'gregory.appearance.cant-blend-in': {
        id: 'gregory.appearance.cant-blend-in',
        category: 'appearance',
        patientId: 'gregory',
        displayText: 'blend in',
        description: 'Gregory wants to be invisible but cannot',
        style: {
            color: '#3498db',
            bgColor: 'rgba(52, 152, 219, 0.15)',
            icon: 'eye-off',
            importance: 'high'
        },
        effects: {
            focusCost: 6,
            reveals: ['desire-to-disappear', 'standing-out'],
            rapportChange: 3
        }
    }
};

export default GREGORY_KEYWORDS;
