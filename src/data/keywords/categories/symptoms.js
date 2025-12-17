/**
 * Symptom Keywords
 * Keywords directly related to clinical symptoms and signs
 * 
 * @module data/keywords/categories/symptoms
 */

export const SYMPTOM_KEYWORDS = {
    // ========================================================================
    // PHYSICAL SYMPTOMS
    // ========================================================================

    'symptom.heart-racing': {
        id: 'symptom.heart-racing',
        category: 'symptom',
        displayText: 'heart racing',
        description: 'Rapid heartbeat or palpitations',
        aliases: ['pounding heart', 'heart beating fast', 'palpitations'],
        style: {
            color: '#e74c3c',
            bgColor: 'rgba(231, 76, 60, 0.15)',
            icon: 'heart',
            animation: 'pulse',
            importance: 'high'
        },
        effects: {
            focusCost: 6,
            reveals: ['physical-anxiety'],
            triggers: ['panic-indicator']
        }
    },

    'symptom.sweating': {
        id: 'symptom.sweating',
        category: 'symptom',
        displayText: 'sweating',
        description: 'Excessive sweating unrelated to temperature',
        aliases: ['sweaty', 'cold sweat', 'sweating through'],
        style: {
            color: '#3498db',
            bgColor: 'rgba(52, 152, 219, 0.12)',
            icon: 'droplet',
            importance: 'medium'
        },
        effects: {
            focusCost: 4,
            reveals: ['physical-anxiety']
        }
    },

    'symptom.trembling': {
        id: 'symptom.trembling',
        category: 'symptom',
        displayText: 'trembling',
        description: 'Shaking or tremors',
        aliases: ['shaking', 'hands shaking', 'cant stop shaking'],
        style: {
            color: '#e74c3c',
            bgColor: 'rgba(231, 76, 60, 0.12)',
            icon: 'activity',
            importance: 'medium'
        },
        effects: {
            focusCost: 5,
            reveals: ['physical-anxiety']
        }
    },

    'symptom.chest-pain': {
        id: 'symptom.chest-pain',
        category: 'symptom',
        displayText: 'chest pain',
        description: 'Pain or tightness in chest',
        aliases: ['chest tightness', 'pressure in chest', 'heart attack feeling'],
        style: {
            color: '#c0392b',
            bgColor: 'rgba(192, 57, 43, 0.18)',
            icon: 'alert-circle',
            importance: 'critical'
        },
        effects: {
            focusCost: 8,
            reveals: ['panic-symptoms'],
            triggers: ['panic-marker']
        },
        menuOptions: [
            {
                id: 'note-medical',
                label: 'Note: Rule out medical causes',
                icon: 'alert-circle',
                action: 'note'
            }
        ]
    },

    'symptom.dizzy': {
        id: 'symptom.dizzy',
        category: 'symptom',
        displayText: 'dizzy',
        description: 'Dizziness or lightheadedness',
        aliases: ['lightheaded', 'faint', 'room spinning'],
        style: {
            color: '#9b59b6',
            bgColor: 'rgba(155, 89, 182, 0.12)',
            icon: 'loader',
            importance: 'medium'
        },
        effects: {
            focusCost: 5,
            reveals: ['physical-anxiety']
        }
    },

    'symptom.nausea': {
        id: 'symptom.nausea',
        category: 'symptom',
        displayText: 'nausea',
        description: 'Feeling sick to stomach',
        aliases: ['sick to my stomach', 'queasy', 'want to throw up'],
        style: {
            color: '#27ae60',
            bgColor: 'rgba(39, 174, 96, 0.12)',
            icon: 'frown',
            importance: 'low'
        },
        effects: {
            focusCost: 3,
            reveals: ['physical-symptoms']
        }
    },

    // ========================================================================
    // SLEEP SYMPTOMS
    // ========================================================================

    'symptom.insomnia': {
        id: 'symptom.insomnia',
        category: 'symptom',
        displayText: 'insomnia',
        description: 'Chronic difficulty sleeping',
        aliases: ['cant sleep', 'sleepless', 'up all night'],
        style: {
            color: '#9b59b6',
            bgColor: 'rgba(155, 89, 182, 0.18)',
            icon: 'moon',
            importance: 'high'
        },
        effects: {
            focusCost: 7,
            reveals: ['insomnia'],
            triggers: ['sleep-disorder-marker']
        }
    },

    'symptom.nightmares': {
        id: 'symptom.nightmares',
        category: 'symptom',
        displayText: 'nightmares',
        description: 'Disturbing dreams',
        aliases: ['bad dreams', 'wake up scared', 'night terrors'],
        style: {
            color: '#8e44ad',
            bgColor: 'rgba(142, 68, 173, 0.15)',
            icon: 'cloud-lightning',
            importance: 'high'
        },
        effects: {
            focusCost: 6,
            reveals: ['sleep-disturbance'],
            triggers: ['trauma-indicator']
        }
    },

    'symptom.fatigue': {
        id: 'symptom.fatigue',
        category: 'symptom',
        displayText: 'exhausted',
        description: 'Persistent tiredness or lack of energy',
        aliases: ['tired', 'no energy', 'wiped out', 'drained'],
        style: {
            color: '#7f8c8d',
            bgColor: 'rgba(127, 140, 141, 0.15)',
            icon: 'battery-low',
            importance: 'medium'
        },
        effects: {
            focusCost: 4,
            reveals: ['fatigue']
        }
    },

    // ========================================================================
    // COGNITIVE SYMPTOMS
    // ========================================================================

    'symptom.cant-concentrate': {
        id: 'symptom.cant-concentrate',
        category: 'symptom',
        displayText: 'can\'t concentrate',
        description: 'Difficulty focusing or paying attention',
        aliases: ['distracted', 'mind wandering', 'cant focus'],
        style: {
            color: '#3498db',
            bgColor: 'rgba(52, 152, 219, 0.12)',
            icon: 'target',
            importance: 'medium'
        },
        effects: {
            focusCost: 4,
            reveals: ['concentration-problems']
        }
    },

    'symptom.memory-problems': {
        id: 'symptom.memory-problems',
        category: 'symptom',
        displayText: 'forgetting things',
        description: 'Difficulty with memory',
        aliases: ['memory issues', 'keep forgetting', 'cant remember'],
        style: {
            color: '#3498db',
            bgColor: 'rgba(52, 152, 219, 0.12)',
            icon: 'database',
            importance: 'medium'
        },
        effects: {
            focusCost: 5,
            reveals: ['cognitive-symptoms']
        }
    },

    'symptom.brain-fog': {
        id: 'symptom.brain-fog',
        category: 'symptom',
        displayText: 'brain fog',
        description: 'Mental cloudiness or confusion',
        aliases: ['foggy', 'hazy', 'not thinking clearly'],
        style: {
            color: '#7f8c8d',
            bgColor: 'rgba(127, 140, 141, 0.15)',
            icon: 'cloud',
            importance: 'medium'
        },
        effects: {
            focusCost: 4,
            reveals: ['cognitive-symptoms']
        }
    },

    // ========================================================================
    // DISSOCIATIVE SYMPTOMS
    // ========================================================================

    'symptom.unreal': {
        id: 'symptom.unreal',
        category: 'symptom',
        displayText: 'doesn\'t feel real',
        description: 'Derealization experience',
        aliases: ['not real', 'dreamlike', 'world feels fake'],
        style: {
            color: '#8e44ad',
            bgColor: 'rgba(142, 68, 173, 0.18)',
            icon: 'eye-off',
            importance: 'high'
        },
        effects: {
            focusCost: 8,
            reveals: ['dissociation'],
            rapportChange: 3
        }
    },

    'symptom.outside-body': {
        id: 'symptom.outside-body',
        category: 'symptom',
        displayText: 'outside my body',
        description: 'Depersonalization experience',
        aliases: ['watching myself', 'not in my body', 'floating above'],
        style: {
            color: '#8e44ad',
            bgColor: 'rgba(142, 68, 173, 0.2)',
            icon: 'user',
            importance: 'critical'
        },
        effects: {
            focusCost: 10,
            reveals: ['dissociation'],
            triggers: ['dissociation-marker'],
            rapportChange: 4
        }
    },

    // ========================================================================
    // WEIGHT/APPETITE
    // ========================================================================

    'symptom.weight-loss': {
        id: 'symptom.weight-loss',
        category: 'symptom',
        displayText: 'losing weight',
        description: 'Unintentional weight loss',
        aliases: ['lost weight', 'clothes dont fit', 'getting thin'],
        style: {
            color: '#e67e22',
            bgColor: 'rgba(230, 126, 34, 0.15)',
            icon: 'trending-down',
            importance: 'high'
        },
        effects: {
            focusCost: 6,
            reveals: ['physical-changes']
        }
    },

    'symptom.weight-gain': {
        id: 'symptom.weight-gain',
        category: 'symptom',
        displayText: 'gaining weight',
        description: 'Unintentional weight gain',
        aliases: ['gained weight', 'getting heavy'],
        style: {
            color: '#e67e22',
            bgColor: 'rgba(230, 126, 34, 0.15)',
            icon: 'trending-up',
            importance: 'medium'
        },
        effects: {
            focusCost: 4,
            reveals: ['physical-changes']
        }
    }
};

export default SYMPTOM_KEYWORDS;
