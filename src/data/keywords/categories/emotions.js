/**
 * Emotion Keywords
 * Keywords related to feelings, emotional states, and affect
 * 
 * @module data/keywords/categories/emotions
 */

export const EMOTION_KEYWORDS = {
    // ========================================================================
    // ANXIETY SPECTRUM
    // ========================================================================

    'emotion.worried': {
        id: 'emotion.worried',
        category: 'emotion',
        displayText: 'worried',
        description: 'Expression of worry or concern',
        aliases: ['worry', 'worrying', 'concerned'],
        style: {
            color: '#e74c3c',
            bgColor: 'rgba(231, 76, 60, 0.12)',
            icon: 'alert-triangle',
            importance: 'medium'
        },
        effects: {
            focusCost: 4,
            reveals: ['anxiety-present']
        },
        menuOptions: [
            {
                id: 'ask-worry-content',
                label: 'Ask: What worries you most?',
                icon: 'message-circle',
                action: 'queue-topic',
                params: { topic: 'worry.content' }
            }
        ]
    },

    'emotion.anxious': {
        id: 'emotion.anxious',
        category: 'emotion',
        displayText: 'anxious',
        description: 'Direct expression of anxiety',
        aliases: ['anxiety', 'feeling anxious', 'so anxious'],
        style: {
            color: '#e74c3c',
            bgColor: 'rgba(231, 76, 60, 0.15)',
            icon: 'zap',
            importance: 'high'
        },
        effects: {
            focusCost: 6,
            reveals: ['anxiety-acknowledged'],
            rapportChange: 2
        },
        menuOptions: [
            {
                id: 'note-anxiety',
                label: 'Note: Patient acknowledges anxiety',
                icon: 'note',
                action: 'note'
            },
            {
                id: 'ask-physical',
                label: 'Ask: Physical symptoms?',
                icon: 'message-circle',
                action: 'queue-topic',
                params: { topic: 'anxiety.physical' }
            }
        ]
    },

    'emotion.terrified': {
        id: 'emotion.terrified',
        category: 'emotion',
        displayText: 'terrified',
        description: 'Intense fear expression',
        aliases: ['terror', 'terrifying', 'scared to death'],
        style: {
            color: '#c0392b',
            bgColor: 'rgba(192, 57, 43, 0.18)',
            icon: 'alert-circle',
            animation: 'shake',
            importance: 'critical'
        },
        effects: {
            focusCost: 8,
            reveals: ['severe-anxiety'],
            rapportChange: 3
        }
    },

    'emotion.on-edge': {
        id: 'emotion.on-edge',
        category: 'emotion',
        displayText: 'on edge',
        description: 'Feeling tense and easily startled',
        aliases: ['edgy', 'keyed up', 'wound up', 'tense'],
        style: {
            color: '#e74c3c',
            bgColor: 'rgba(231, 76, 60, 0.12)',
            icon: 'zap',
            importance: 'medium'
        },
        effects: {
            focusCost: 5,
            reveals: ['hyperarousal']
        }
    },

    // ========================================================================
    // DEPRESSION SPECTRUM
    // ========================================================================

    'emotion.sad': {
        id: 'emotion.sad',
        category: 'emotion',
        displayText: 'sad',
        description: 'Expression of sadness',
        aliases: ['sadness', 'feeling down', 'unhappy'],
        style: {
            color: '#3498db',
            bgColor: 'rgba(52, 152, 219, 0.12)',
            icon: 'cloud-rain',
            importance: 'medium'
        },
        effects: {
            focusCost: 4,
            reveals: ['low-mood']
        }
    },

    'emotion.hopeless': {
        id: 'emotion.hopeless',
        category: 'emotion',
        displayText: 'hopeless',
        description: 'Feeling that things will not improve',
        aliases: ['no hope', 'hopelessness', 'pointless'],
        style: {
            color: '#2c3e50',
            bgColor: 'rgba(44, 62, 80, 0.18)',
            icon: 'cloud',
            importance: 'critical'
        },
        effects: {
            focusCost: 10,
            reveals: ['hopelessness'],
            triggers: ['depression-marker'],
            rapportChange: 3
        },
        menuOptions: [
            {
                id: 'safety-check',
                label: '⚠️ Assess safety',
                icon: 'shield',
                action: 'queue-topic',
                params: { topic: 'safety.assessment', priority: 'high' }
            }
        ],
        note: 'Critical marker - always assess for safety'
    },

    'emotion.numb': {
        id: 'emotion.numb',
        category: 'emotion',
        displayText: 'numb',
        description: 'Emotional numbness or detachment',
        aliases: ['empty', 'nothing', 'cant feel anything'],
        style: {
            color: '#7f8c8d',
            bgColor: 'rgba(127, 140, 141, 0.15)',
            icon: 'minus-circle',
            importance: 'high'
        },
        effects: {
            focusCost: 7,
            reveals: ['anhedonia'],
            rapportChange: 2
        }
    },

    'emotion.worthless': {
        id: 'emotion.worthless',
        category: 'emotion',
        displayText: 'worthless',
        description: 'Feeling of having no value',
        aliases: ['no value', 'waste of space', 'burden'],
        style: {
            color: '#2c3e50',
            bgColor: 'rgba(44, 62, 80, 0.18)',
            icon: 'x-circle',
            importance: 'critical'
        },
        effects: {
            focusCost: 10,
            reveals: ['low-self-worth'],
            triggers: ['self-esteem-crisis'],
            rapportChange: 4
        },
        menuOptions: [
            {
                id: 'safety-check',
                label: '⚠️ Assess safety',
                icon: 'shield',
                action: 'queue-topic',
                params: { topic: 'safety.assessment', priority: 'high' }
            }
        ]
    },

    // ========================================================================
    // SHAME & GUILT
    // ========================================================================

    'emotion.ashamed': {
        id: 'emotion.ashamed',
        category: 'emotion',
        displayText: 'ashamed',
        description: 'Feeling of shame about oneself',
        aliases: ['shame', 'embarrassed', 'humiliated'],
        style: {
            color: '#9b59b6',
            bgColor: 'rgba(155, 89, 182, 0.15)',
            icon: 'eye-off',
            importance: 'high'
        },
        effects: {
            focusCost: 7,
            reveals: ['shame-present'],
            rapportChange: 3
        }
    },

    'emotion.guilty': {
        id: 'emotion.guilty',
        category: 'emotion',
        displayText: 'guilty',
        description: 'Feeling of guilt or self-blame',
        aliases: ['guilt', 'my fault', 'to blame'],
        style: {
            color: '#9b59b6',
            bgColor: 'rgba(155, 89, 182, 0.12)',
            icon: 'frown',
            importance: 'medium'
        },
        effects: {
            focusCost: 5,
            reveals: ['guilt-present']
        }
    },

    // ========================================================================
    // ANGER & FRUSTRATION
    // ========================================================================

    'emotion.angry': {
        id: 'emotion.angry',
        category: 'emotion',
        displayText: 'angry',
        description: 'Expression of anger',
        aliases: ['anger', 'mad', 'furious', 'pissed'],
        style: {
            color: '#c0392b',
            bgColor: 'rgba(192, 57, 43, 0.15)',
            icon: 'flame',
            importance: 'medium'
        },
        effects: {
            focusCost: 5,
            reveals: ['anger-present']
        },
        menuOptions: [
            {
                id: 'ask-anger-target',
                label: 'Ask: What makes you angry?',
                icon: 'message-circle',
                action: 'queue-topic',
                params: { topic: 'anger.source' }
            }
        ]
    },

    'emotion.frustrated': {
        id: 'emotion.frustrated',
        category: 'emotion',
        displayText: 'frustrated',
        description: 'Feeling of frustration',
        aliases: ['frustrating', 'frustration', 'irritated'],
        style: {
            color: '#e67e22',
            bgColor: 'rgba(230, 126, 34, 0.12)',
            icon: 'alert-triangle',
            importance: 'low'
        },
        effects: {
            focusCost: 3
        }
    },

    // ========================================================================
    // POSITIVE (for contrast/breakthroughs)
    // ========================================================================

    'emotion.relieved': {
        id: 'emotion.relieved',
        category: 'emotion',
        displayText: 'relieved',
        description: 'Feeling of relief - often appears after sharing',
        aliases: ['relief', 'weight off', 'feels good to say'],
        style: {
            color: '#27ae60',
            bgColor: 'rgba(39, 174, 96, 0.15)',
            icon: 'sun',
            importance: 'medium'
        },
        effects: {
            focusCost: 0,
            rapportChange: 5
        }
    },

    'emotion.hopeful': {
        id: 'emotion.hopeful',
        category: 'emotion',
        displayText: 'hopeful',
        description: 'Expression of hope - positive therapy indicator',
        aliases: ['hope', 'maybe things can change'],
        style: {
            color: '#27ae60',
            bgColor: 'rgba(39, 174, 96, 0.18)',
            icon: 'sunrise',
            importance: 'high'
        },
        effects: {
            focusCost: 0,
            rapportChange: 8,
            triggers: ['therapeutic-alliance']
        }
    }
};

export default EMOTION_KEYWORDS;
