/**
 * Relationship Keywords
 * Keywords related to social connections, relationships, and interactions
 * 
 * @module data/keywords/categories/relationships
 */

export const RELATIONSHIP_KEYWORDS = {
    // ========================================================================
    // SOCIAL SUPPORT
    // ========================================================================

    'relationship.no-one': {
        id: 'relationship.no-one',
        category: 'relationship',
        displayText: 'no one',
        description: 'Feeling alone or without support',
        aliases: ['nobody', 'alone', 'by myself', 'on my own'],
        style: {
            color: '#3498db',
            bgColor: 'rgba(52, 152, 219, 0.15)',
            icon: 'user-x',
            importance: 'high'
        },
        effects: {
            focusCost: 6,
            reveals: ['social-isolation'],
            rapportChange: 2
        }
    },

    'relationship.burden': {
        id: 'relationship.burden',
        category: 'relationship',
        displayText: 'burden',
        description: 'Feeling like a burden to others',
        aliases: ['bother people', 'in the way', 'too much for them'],
        style: {
            color: '#9b59b6',
            bgColor: 'rgba(155, 89, 182, 0.18)',
            icon: 'weight',
            importance: 'critical'
        },
        effects: {
            focusCost: 8,
            reveals: ['perceived-burden'],
            triggers: ['depression-marker'],
            rapportChange: 3
        },
        menuOptions: [
            {
                id: 'safety-note',
                label: '⚠️ Monitor for SI',
                icon: 'alert-circle',
                action: 'note'
            }
        ],
        note: 'Perceived burdensomeness is risk factor for SI'
    },

    'relationship.support': {
        id: 'relationship.support',
        category: 'relationship',
        displayText: 'support',
        description: 'Reference to supportive relationships',
        aliases: ['supportive', 'there for me', 'helps me'],
        style: {
            color: '#27ae60',
            bgColor: 'rgba(39, 174, 96, 0.15)',
            icon: 'users',
            importance: 'medium'
        },
        effects: {
            focusCost: 3,
            reveals: ['social-support-present']
        }
    },

    // ========================================================================
    // FAMILY
    // ========================================================================

    'relationship.family': {
        id: 'relationship.family',
        category: 'relationship',
        displayText: 'family',
        description: 'Reference to family members',
        aliases: ['parents', 'siblings', 'relatives'],
        style: {
            color: '#f39c12',
            bgColor: 'rgba(243, 156, 18, 0.12)',
            icon: 'home',
            importance: 'low'
        },
        effects: {
            focusCost: 2
        },
        menuOptions: [
            {
                id: 'explore-family',
                label: 'Ask: Tell me about your family',
                icon: 'message-circle',
                action: 'queue-topic',
                params: { topic: 'family.background' }
            }
        ]
    },

    'relationship.parents': {
        id: 'relationship.parents',
        category: 'relationship',
        displayText: 'parents',
        description: 'Reference to parents',
        aliases: ['mom', 'dad', 'mother', 'father'],
        style: {
            color: '#f39c12',
            bgColor: 'rgba(243, 156, 18, 0.15)',
            icon: 'users',
            importance: 'medium'
        },
        effects: {
            focusCost: 4
        },
        menuOptions: [
            {
                id: 'explore-parents',
                label: 'Ask: About your parents',
                icon: 'message-circle',
                action: 'queue-topic',
                params: { topic: 'family.parents' }
            }
        ]
    },

    'relationship.childhood': {
        id: 'relationship.childhood',
        category: 'relationship',
        displayText: 'growing up',
        description: 'Reference to childhood experiences',
        aliases: ['as a child', 'when I was young', 'childhood'],
        style: {
            color: '#f39c12',
            bgColor: 'rgba(243, 156, 18, 0.18)',
            icon: 'star',
            importance: 'high'
        },
        effects: {
            focusCost: 6,
            reveals: ['childhood-history']
        }
    },

    // ========================================================================
    // ROMANTIC
    // ========================================================================

    'relationship.partner': {
        id: 'relationship.partner',
        category: 'relationship',
        displayText: 'partner',
        description: 'Reference to romantic partner',
        aliases: ['spouse', 'husband', 'wife', 'boyfriend', 'girlfriend'],
        style: {
            color: '#e74c3c',
            bgColor: 'rgba(231, 76, 60, 0.12)',
            icon: 'heart',
            importance: 'medium'
        },
        effects: {
            focusCost: 4
        }
    },

    'relationship.breakup': {
        id: 'relationship.breakup',
        category: 'relationship',
        displayText: 'broke up',
        description: 'End of romantic relationship',
        aliases: ['divorce', 'separated', 'left me', 'ended things'],
        style: {
            color: '#e74c3c',
            bgColor: 'rgba(231, 76, 60, 0.18)',
            icon: 'heart-off',
            importance: 'high'
        },
        effects: {
            focusCost: 7,
            reveals: ['recent-loss'],
            triggers: ['stressor-identified'],
            rapportChange: 2
        }
    },

    // ========================================================================
    // LOSS
    // ========================================================================

    'relationship.death': {
        id: 'relationship.death',
        category: 'relationship',
        displayText: 'died',
        description: 'Reference to death of someone',
        aliases: ['passed away', 'lost them', 'gone', 'funeral'],
        style: {
            color: '#2c3e50',
            bgColor: 'rgba(44, 62, 80, 0.18)',
            icon: 'cloud',
            importance: 'critical'
        },
        effects: {
            focusCost: 8,
            reveals: ['grief-loss'],
            triggers: ['grief-marker'],
            rapportChange: 4
        },
        menuOptions: [
            {
                id: 'express-condolence',
                label: 'Express condolences',
                icon: 'heart',
                action: 'empathy-response'
            },
            {
                id: 'explore-loss',
                label: 'Ask: Tell me about them',
                icon: 'message-circle',
                action: 'queue-topic',
                params: { topic: 'loss.explore' }
            }
        ]
    },

    // ========================================================================
    // CONFLICT
    // ========================================================================

    'relationship.fighting': {
        id: 'relationship.fighting',
        category: 'relationship',
        displayText: 'fighting',
        description: 'Interpersonal conflict',
        aliases: ['arguing', 'arguments', 'conflict', 'yelling'],
        style: {
            color: '#e74c3c',
            bgColor: 'rgba(231, 76, 60, 0.15)',
            icon: 'alert-triangle',
            importance: 'medium'
        },
        effects: {
            focusCost: 5,
            reveals: ['relationship-conflict']
        }
    },

    'relationship.abuse': {
        id: 'relationship.abuse',
        category: 'relationship',
        displayText: 'hurt me',
        description: 'Reference to abuse or mistreatment',
        aliases: ['abuse', 'hit me', 'violent', 'cruel'],
        style: {
            color: '#c0392b',
            bgColor: 'rgba(192, 57, 43, 0.2)',
            icon: 'alert-octagon',
            animation: 'pulse',
            importance: 'critical'
        },
        effects: {
            focusCost: 0,
            reveals: ['trauma-history'],
            triggers: ['trauma-marker', 'safety-check'],
            rapportChange: 5
        },
        menuOptions: [
            {
                id: 'safety-assessment',
                label: '⚠️ Current safety?',
                icon: 'shield',
                action: 'queue-topic',
                params: { topic: 'safety.current', priority: 'high' }
            }
        ]
    },

    // ========================================================================
    // WORK/SOCIAL
    // ========================================================================

    'relationship.coworkers': {
        id: 'relationship.coworkers',
        category: 'relationship',
        displayText: 'coworkers',
        description: 'Reference to workplace relationships',
        aliases: ['colleagues', 'boss', 'manager', 'team'],
        style: {
            color: '#3498db',
            bgColor: 'rgba(52, 152, 219, 0.12)',
            icon: 'briefcase',
            importance: 'low'
        },
        effects: {
            focusCost: 3
        }
    },

    'relationship.friends': {
        id: 'relationship.friends',
        category: 'relationship',
        displayText: 'friends',
        description: 'Reference to friendships',
        aliases: ['friend', 'buddy', 'close friends'],
        style: {
            color: '#27ae60',
            bgColor: 'rgba(39, 174, 96, 0.12)',
            icon: 'users',
            importance: 'low'
        },
        effects: {
            focusCost: 2
        },
        menuOptions: [
            {
                id: 'explore-social',
                label: 'Ask: About friendships',
                icon: 'message-circle',
                action: 'queue-topic',
                params: { topic: 'social.friends' }
            }
        ]
    },

    'relationship.no-friends': {
        id: 'relationship.no-friends',
        category: 'relationship',
        displayText: 'no friends',
        description: 'Lack of friendships',
        aliases: ['dont have friends', 'no real friends', 'lost touch'],
        style: {
            color: '#3498db',
            bgColor: 'rgba(52, 152, 219, 0.18)',
            icon: 'user-minus',
            importance: 'high'
        },
        effects: {
            focusCost: 6,
            reveals: ['social-isolation'],
            rapportChange: 2
        }
    }
};

export default RELATIONSHIP_KEYWORDS;
