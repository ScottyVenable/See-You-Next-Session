// Patient 1: Tutorial - Generalized Anxiety Disorder
// Gregory Vigil - A 27-year-old who hedges everything, constantly seeks validation,
// and maintains a meticulous appearance that belies his inner turmoil.
export const TUTORIAL_PATIENT = {
    id: 'patient-tutorial',
    name: 'Gregory',
    fullName: 'Gregory Vigil',
    age: 27,
    gender: 'male',
    difficulty: 'easy',
    correctDiagnosis: 'generalized-anxiety',

    // Name etymology - thematic resonance
    nameEtymology: {
        gregory: 'watchful, alert',
        vigil: 'awake, keeping watch'
    },

    // Visual appearance
    appearance: {
        baseSprite: '/assets/characters/gregory-base.png',
        height: "6'1\"",
        hair: {
            color: 'orange-red',
            style: 'meticulously maintained',
            symbolism: 'danger, caution, impossible to hide'
        },
        clothing: {
            primary: 'all black',
            condition: 'immaculate, pressed',
            symbolism: 'power, sophistication, authority (facade)'
        },
        // Symptom overlays - positions relative to base sprite
        symptomOverlays: {
            'bitten-nails': {
                sprite: '/assets/characters/overlays/bitten-nails.png',
                position: { x: 0, y: 0 },
                hotspot: { x: 150, y: 400, width: 80, height: 60 },
                psychology: 'Anxious habit contradicting polished appearance'
            },
            'bags-under-eyes': {
                sprite: '/assets/characters/overlays/bags-under-eyes.png',
                position: { x: 0, y: 0 },
                hotspot: { x: 180, y: 120, width: 100, height: 40 },
                psychology: 'Sleep difficulties cannot be concealed'
            },
            'fidgeting-hands': {
                sprite: '/assets/characters/overlays/fidgeting-hands.png',
                position: { x: 0, y: 0 },
                hotspot: { x: 140, y: 380, width: 100, height: 80 },
                psychology: 'Jittery despite calm exterior'
            },
            'erratic-eye-movement': {
                sprite: '/assets/characters/overlays/erratic-eyes.png',
                position: { x: 0, y: 0 },
                hotspot: { x: 180, y: 100, width: 100, height: 60 },
                psychology: 'Constantly scanning environment for threats'
            },
            'bouncing-leg': {
                sprite: '/assets/characters/overlays/bouncing-leg.png',
                position: { x: 0, y: 0 },
                hotspot: { x: 200, y: 500, width: 80, height: 100 },
                psychology: 'Restless energy, unable to be still'
            },
            'shaky-hands': {
                sprite: '/assets/characters/overlays/shaky-hands.png',
                position: { x: 0, y: 0 },
                hotspot: { x: 150, y: 400, width: 80, height: 60 },
                psychology: 'Physical manifestation of inner anxiety'
            },
        },
    },

    // Symptoms that can be discovered
    hiddenSymptoms: [
        'bitten-nails',
        'bags-under-eyes',
        'fidgeting-hands',
        'erratic-eye-movement',
        'bouncing-leg',
        'shaky-hands'
    ],

    // Character traits affecting dialogue
    characterTraits: {
        hedging: true,  // Always qualifies statements
        validationSeeking: true,  // Frequently asks "Is that normal?"
        overExplaining: true,  // Gives too much detail trying to be "correct"
        guardedness: 80,  // 0-100 scale, very guarded initially
    },

    // Dialogue phases (one per turn) - LEGACY FALLBACK
    // Primary dialogue now lives in src/patients/gregory/dialogue/turn1.syns
    phases: [
        {
            turn: 1,
            dialogue: [
                {
                    id: 'turn1-intro',
                    text: "Thank you for... for seeing me, doctor. I hope I'm not— I mean, I know you're probably very busy.",
                    keywords: [],
                    speakerMood: 'guarded',
                },
                {
                    id: 'turn1-explain',
                    text: "I tried to keep my intake email concise, though I realize it may have been... perhaps [too detailed]? I wasn't sure how much information you'd need.",
                    keywords: [
                        {
                            text: 'too detailed',
                            id: 'keyword-overexplain',
                            relatedSymptom: null,
                        }
                    ],
                    speakerMood: 'nervous',
                },
                {
                    id: 'turn1-sleep',
                    text: "I mean, I sleep. I [do sleep]. Everyone has trouble sleeping sometimes, don't they?",
                    keywords: [
                        {
                            text: 'do sleep',
                            id: 'keyword-sleep-lie',
                            contradicts: 'bags-under-eyes', // This is the contradiction!
                        }
                    ],
                    speakerMood: 'defensive',
                },
                {
                    id: 'turn1-validation',
                    text: "That's— that's an [appropriate reason] to come to therapy, isn't it?",
                    keywords: [
                        {
                            text: 'appropriate reason',
                            id: 'keyword-validation-seek',
                            relatedSymptom: null,
                        }
                    ],
                    speakerMood: 'seeking-validation',
                },
            ],
        },
        {
            turn: 2,
            dialogue: [
                {
                    id: 'turn2-watched',
                    text: "I feel like I'm [constantly being watched]. Evaluated. Even when there probably aren't any eyes on me.",
                    keywords: [
                        {
                            text: 'constantly being watched',
                            id: 'keyword-hypervigilance',
                            relatedSymptom: 'erratic-eye-movement',
                        }
                    ],
                    speakerMood: 'anxious',
                },
                {
                    id: 'turn2-appearance',
                    text: "I try so hard to be... [correct]. To not stand out. But I'm six foot one with red hair. I always stand out.",
                    keywords: [
                        {
                            text: 'correct',
                            id: 'keyword-perfectionism',
                            relatedSymptom: null,
                        }
                    ],
                    speakerMood: 'vulnerable',
                },
                {
                    id: 'turn2-focus',
                    text: "It's like there's this [running commentary] in my head. 'Don't fidget. Make eye contact. Not too much eye contact.'",
                    keywords: [
                        {
                            text: 'running commentary',
                            id: 'keyword-self-monitoring',
                            relatedSymptom: 'fidgeting-hands',
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
                    text: "I've picked up some [habits]. I check things [over and over]. Even after I check, part of me isn't sure.",
                    keywords: [
                        {
                            text: 'habits',
                            id: 'keyword-habits',
                            relatedSymptom: 'bitten-nails',
                        },
                        {
                            text: 'over and over',
                            id: 'keyword-checking',
                            relatedSymptom: null,
                        }
                    ],
                    speakerMood: 'frustrated',
                },
                {
                    id: 'turn3-duration',
                    text: "These... difficulties have been [accumulating]. I kept hoping they would just... go away on their own.",
                    keywords: [
                        {
                            text: 'accumulating',
                            id: 'keyword-duration',
                            relatedSymptom: null,
                        }
                    ],
                    speakerMood: 'sad',
                },
            ],
        },
        {
            turn: 4,
            dialogue: [
                {
                    id: 'turn4-judgment',
                    text: "What if you think— what if you realize I'm just... [being dramatic]? Or attention-seeking?",
                    keywords: [
                        {
                            text: 'being dramatic',
                            id: 'keyword-fear-judgment',
                            relatedSymptom: null,
                        }
                    ],
                    speakerMood: 'anxious',
                },
                {
                    id: 'turn4-closing',
                    text: "I don't know if that's [normal]. Is that normal? I'm not the best judge of these things.",
                    keywords: [
                        {
                            text: 'normal',
                            id: 'keyword-self-doubt',
                            relatedSymptom: null,
                        }
                    ],
                    speakerMood: 'vulnerable',
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
                text: "*exhales* Okay. My sleep has been... not great. [Not great at all], actually. I lie awake for hours sometimes. Going over things in my head.",
                keywords: [
                    {
                        text: "Not great at all",
                        id: 'keyword-insomnia',
                        relatedSymptom: 'bags-under-eyes',
                    }
                ],
                speakerMood: 'relieved',
            },
        },
        'appearance-breakthrough': {
            triggerContradiction: { textKeyword: 'keyword-perfectionism', visualSymptom: 'bitten-nails' },
            dialogue: {
                id: 'breakthrough-appearance',
                text: "I know that probably sounds shallow. But if I look put-together, maybe people won't notice that I [don't feel put-together].",
                keywords: [
                    {
                        text: "don't feel put-together",
                        id: 'keyword-facade',
                        relatedSymptom: 'bitten-nails',
                    }
                ],
                speakerMood: 'vulnerable',
            },
        },
    },
};

export default TUTORIAL_PATIENT;
