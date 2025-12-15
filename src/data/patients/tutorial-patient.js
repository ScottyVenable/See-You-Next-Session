// Patient 1: Tutorial - Generalized Anxiety Disorder
export const TUTORIAL_PATIENT = {
    id: 'patient-tutorial',
    name: 'Alex',
    age: 28,
    gender: 'male',
    difficulty: 'easy',
    correctDiagnosis: 'generalized-anxiety',

    // Visual appearance
    appearance: {
        baseSprite: '/assets/characters/alex-base.png',
        // Symptom overlays - positions relative to base sprite
        symptomOverlays: {
            'bitten-nails': {
                sprite: '/assets/characters/overlays/bitten-nails.png',
                position: { x: 0, y: 0 },
                hotspot: { x: 150, y: 400, width: 80, height: 60 },
            },
            'bags-under-eyes': {
                sprite: '/assets/characters/overlays/bags-under-eyes.png',
                position: { x: 0, y: 0 },
                hotspot: { x: 180, y: 120, width: 100, height: 40 },
            },
            'chewed-lip': {
                sprite: '/assets/characters/overlays/chewed-lip.png',
                position: { x: 0, y: 0 },
                hotspot: { x: 200, y: 180, width: 60, height: 30 },
            },
            'looking-around': {
                sprite: '/assets/characters/overlays/looking-around.png',
                position: { x: 0, y: 0 },
                hotspot: { x: 180, y: 100, width: 100, height: 60 },
            },
        },
    },

    // Symptoms that can be discovered
    hiddenSymptoms: ['bitten-nails', 'bags-under-eyes', 'chewed-lip', 'looking-around'],

    // Dialogue phases (one per turn)
    phases: [
        {
            turn: 1,
            dialogue: [
                {
                    id: 'turn1-intro',
                    text: "Thanks for seeing me, doctor. I... I've been having a rough time lately.",
                    keywords: [],
                    speakerMood: 'nervous',
                },
                {
                    id: 'turn1-worry',
                    text: "I just can't stop [worrying about everything]. Work, my family, even little things like whether I locked the door.",
                    keywords: [
                        {
                            text: 'worrying about everything',
                            id: 'keyword-worry',
                            relatedSymptom: null,
                        }
                    ],
                    speakerMood: 'anxious',
                },
                {
                    id: 'turn1-sleep',
                    text: "I'm [sleeping fine, really]. Just a bit tired from work.",
                    keywords: [
                        {
                            text: 'sleeping fine, really',
                            id: 'keyword-sleep-lie',
                            contradicts: 'bags-under-eyes', // This is the contradiction!
                        }
                    ],
                    speakerMood: 'defensive',
                },
            ],
        },
        {
            turn: 2,
            dialogue: [
                {
                    id: 'turn2-physical',
                    text: "My body feels tense all the time. Like I'm [always on edge], waiting for something bad to happen.",
                    keywords: [
                        {
                            text: 'always on edge',
                            id: 'keyword-tense',
                            relatedSymptom: 'trembling-hands',
                        }
                    ],
                    speakerMood: 'stressed',
                },
                {
                    id: 'turn2-focus',
                    text: "It's [hard to concentrate at work]. My [mind just races from one worry to the next].",
                    keywords: [
                        {
                            text: 'hard to concentrate at work',
                            id: 'keyword-concentrate',
                            relatedSymptom: 'looking-around',
                        },
                        {
                            text: 'mind just races from one worry to the next',
                            id: 'keyword-racing-mind',
                            relatedSymptom: ''
                        }
                    ],
                    speakerMood: 'frustrated',
                },
            ],
        },
        {
            turn: 3,
            dialogue: [
                {
                    id: 'turn3-habits',
                    text: "I've picked up some [nervous habits] I guess. Small things. Nothing serious.",
                    keywords: [
                        {
                            text: 'nervous habits',
                            id: 'keyword-habits',
                            relatedSymptom: 'bitten-nails',
                        }
                    ],
                    speakerMood: 'dismissive',
                },
                {
                    id: 'turn3-duration',
                    text: "This has been going on for [about six months now]. I kept hoping it would just... go away.",
                    keywords: [
                        {
                            text: 'about six months now',
                            id: 'keyword-duration',
                            relatedSymptom: null,
                            //todo: implement font changes for keywords based on type.
                        }
                    ],
                    speakerMood: 'sad', // todo: "appears sad" vs "is sad" when observed -- good for fictitious disorder for example
                },
            ],
        },
        {
            turn: 4,
            dialogue: [
                {
                    id: 'turn4-impact',
                    text: "I want to get better. This worry is [affecting my relationships]. My partner says I'm never really present.",
                    keywords: [
                        {
                            text: 'affecting my relationships',
                            id: 'keyword-impact',
                            relatedSymptom: null,
                        }
                    ],
                    speakerMood: 'vulnerable',
                },
                {
                    id: 'turn4-closing',
                    text: "Do you... do you think you can help me?",
                    keywords: [],
                    speakerMood: 'hopeful',
                },
            ],
        },
    ],

    // Breakthrough dialogue - unlocked when contradictions are found
    breakthroughDialogue: {
        'sleep-breakthrough': {
            triggerContradiction: { textKeyword: 'keyword-sleep-lie', visualSymptom: 'bags-under-eyes' },
            dialogue: {
                id: 'breakthrough-sleep',
                text: "*sighs* Okay, you're right. I [haven't slept properly in weeks]. I lie awake for hours, my mind just won't stop.",
                keywords: [
                    {
                        text: "haven't slept properly in weeks",
                        id: 'keyword-insomnia',
                        relatedSymptom: 'bags-under-eyes',
                    }
                ],
                speakerMood: 'relieved',
            },
        },
    },
};

export default TUTORIAL_PATIENT;
