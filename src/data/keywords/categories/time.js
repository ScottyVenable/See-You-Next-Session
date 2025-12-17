/**
 * Time & Duration Keywords
 * Keywords related to time periods, duration, and frequency
 * 
 * @module data/keywords/categories/time
 */

export const TIME_KEYWORDS = {
    // ========================================================================
    // DURATION - How long something has lasted
    // ========================================================================

    'time.months': {
        id: 'time.months',
        category: 'time',
        displayText: 'months',
        description: 'A duration spanning multiple months - indicates a persistent issue',
        aliases: ['for months', 'several months', 'a few months', 'months now'],
        style: {
            color: '#6b7fd7',
            bgColor: 'rgba(107, 127, 215, 0.15)',
            icon: 'calendar',
            importance: 'medium'
        },
        effects: {
            focusCost: 5,
            reveals: ['chronicity'],
            setVars: { 'duration_mentioned': true }
        },
        menuOptions: [
            {
                id: 'note-duration',
                label: 'Note: Long-term issue',
                icon: 'note',
                action: 'note',
                params: { template: 'Patient reports issue lasting months' }
            },
            {
                id: 'ask-specifics',
                label: 'Ask: How many months?',
                icon: 'message-circle',
                action: 'queue-topic',
                params: { topic: 'duration.specifics' }
            }
        ],
        note: 'Important for establishing chronicity of symptoms'
    },

    'time.weeks': {
        id: 'time.weeks',
        category: 'time',
        displayText: 'weeks',
        description: 'A duration spanning weeks',
        aliases: ['for weeks', 'several weeks', 'a few weeks'],
        style: {
            color: '#6b7fd7',
            bgColor: 'rgba(107, 127, 215, 0.12)',
            icon: 'calendar',
            importance: 'low'
        },
        effects: {
            focusCost: 3
        },
        menuOptions: [
            {
                id: 'note-duration',
                label: 'Note: Recent issue',
                icon: 'note',
                action: 'note'
            }
        ]
    },

    'time.years': {
        id: 'time.years',
        category: 'time',
        displayText: 'years',
        description: 'A duration spanning years - indicates a chronic, long-standing issue',
        aliases: ['for years', 'several years', 'many years'],
        style: {
            color: '#e74c3c',
            bgColor: 'rgba(231, 76, 60, 0.15)',
            icon: 'calendar',
            importance: 'high'
        },
        effects: {
            focusCost: 8,
            reveals: ['chronic-issue'],
            rapportChange: 2
        },
        menuOptions: [
            {
                id: 'note-chronic',
                label: 'Note: Chronic condition',
                icon: 'alert-circle',
                action: 'note',
                params: { template: 'Patient reports years-long history' }
            }
        ],
        note: 'Critical for diagnosis - indicates deeply rooted patterns'
    },

    'time.always': {
        id: 'time.always',
        category: 'time',
        displayText: 'always',
        description: 'Patient indicates this has always been the case',
        aliases: ['my whole life', 'as long as I can remember', 'since I was young'],
        style: {
            color: '#e74c3c',
            bgColor: 'rgba(231, 76, 60, 0.18)',
            icon: 'infinity',
            importance: 'critical'
        },
        effects: {
            focusCost: 10,
            reveals: ['lifelong-pattern'],
            triggers: ['early-onset-discovery']
        },
        menuOptions: [
            {
                id: 'note-lifelong',
                label: 'Note: Lifelong pattern',
                icon: 'alert-circle',
                action: 'note'
            },
            {
                id: 'ask-childhood',
                label: 'Ask: Tell me about childhood',
                icon: 'message-circle',
                action: 'queue-topic',
                params: { topic: 'family.childhood' }
            }
        ]
    },

    // ========================================================================
    // FREQUENCY - How often something occurs
    // ========================================================================

    'time.every-night': {
        id: 'time.every-night',
        category: 'time',
        displayText: 'every night',
        description: 'Something occurring nightly - indicates consistent pattern',
        aliases: ['each night', 'nightly', 'every single night'],
        style: {
            color: '#9b59b6',
            bgColor: 'rgba(155, 89, 182, 0.15)',
            icon: 'moon',
            importance: 'high'
        },
        effects: {
            focusCost: 6,
            reveals: ['sleep-disturbance-pattern']
        },
        menuOptions: [
            {
                id: 'note-nightly',
                label: 'Note: Nightly occurrence',
                icon: 'note',
                action: 'note'
            }
        ]
    },

    'time.constantly': {
        id: 'time.constantly',
        category: 'time',
        displayText: 'constantly',
        description: 'Something happening all the time without relief',
        aliases: ['all the time', 'non-stop', 'without break', '24/7'],
        style: {
            color: '#e74c3c',
            bgColor: 'rgba(231, 76, 60, 0.15)',
            icon: 'repeat',
            importance: 'high'
        },
        effects: {
            focusCost: 7,
            reveals: ['persistent-symptoms']
        }
    },

    'time.sometimes': {
        id: 'time.sometimes',
        category: 'time',
        displayText: 'sometimes',
        description: 'Occasional occurrence - may indicate minimization',
        aliases: ['occasionally', 'now and then', 'once in a while'],
        style: {
            color: '#6b7fd7',
            bgColor: 'rgba(107, 127, 215, 0.1)',
            icon: 'clock',
            importance: 'low'
        },
        effects: {
            focusCost: 2
        },
        menuOptions: [
            {
                id: 'probe-frequency',
                label: 'Ask: How often exactly?',
                icon: 'message-circle',
                action: 'queue-topic',
                params: { topic: 'frequency.clarification' }
            }
        ],
        note: 'Watch for minimization - "sometimes" may mean "often"'
    },

    // ========================================================================
    // RECENCY - When something started
    // ========================================================================

    'time.recently': {
        id: 'time.recently',
        category: 'time',
        displayText: 'recently',
        description: 'Something that started in the recent past',
        aliases: ['lately', 'these days', 'not long ago'],
        style: {
            color: '#3498db',
            bgColor: 'rgba(52, 152, 219, 0.12)',
            icon: 'clock',
            importance: 'medium'
        },
        effects: {
            focusCost: 4
        },
        menuOptions: [
            {
                id: 'ask-trigger',
                label: 'Ask: What changed recently?',
                icon: 'message-circle',
                action: 'queue-topic',
                params: { topic: 'precipitant' }
            }
        ]
    },

    'time.since-event': {
        id: 'time.since-event',
        category: 'time',
        displayText: 'since [event]',
        description: 'Symptoms connected to a specific event - critical for understanding onset',
        style: {
            color: '#e67e22',
            bgColor: 'rgba(230, 126, 34, 0.15)',
            icon: 'flag',
            importance: 'critical'
        },
        effects: {
            focusCost: 8,
            reveals: ['precipitating-event'],
            triggers: ['event-connection']
        },
        menuOptions: [
            {
                id: 'note-precipitant',
                label: 'Note: Precipitating event',
                icon: 'alert-circle',
                action: 'note'
            },
            {
                id: 'explore-event',
                label: 'Ask: Tell me about that event',
                icon: 'message-circle',
                action: 'queue-topic'
            }
        ]
    }
};

export default TIME_KEYWORDS;
