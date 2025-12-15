// Patient 2: Bipolar I Disorder
export const BIPOLAR_PATIENT = {
    id: 'patient-bipolar',
    name: 'Marcus',
    age: 34,
    gender: 'male',
    difficulty: 'medium',
    correctDiagnosis: 'bipolar-1',

    // Story file reference
    storyFile: 'marcus-bipolar',

    // Visual appearance
    appearance: {
        baseSprite: '/assets/characters/marcus-base.png',
        // Symptom overlays - positions relative to base sprite
        symptomOverlays: {
            // Manic presentation symptoms
            'dilated-pupils': {
                sprite: '/assets/characters/overlays/dilated-pupils.png',
                position: { x: 0, y: 0 },
                hotspot: { x: 180, y: 105, width: 100, height: 50 },
                phase: 'manic',
            },
            'rapid-eye-movement': {
                sprite: '/assets/characters/overlays/rapid-eye-movement.png',
                position: { x: 0, y: 0 },
                hotspot: { x: 180, y: 100, width: 100, height: 60 },
                phase: 'manic',
            },
            'fidgeting': {
                sprite: '/assets/characters/overlays/fidgeting.png',
                position: { x: 0, y: 0 },
                hotspot: { x: 120, y: 350, width: 160, height: 100 },
                phase: 'manic',
            },
            'flashy-clothes': {
                sprite: '/assets/characters/overlays/flashy-clothes.png',
                position: { x: 0, y: 0 },
                hotspot: { x: 100, y: 200, width: 200, height: 180 },
                phase: 'manic',
            },
            // Depressive presentation symptoms
            'slumped-posture': {
                sprite: '/assets/characters/overlays/slumped-posture.png',
                position: { x: 0, y: 0 },
                hotspot: { x: 100, y: 180, width: 200, height: 200 },
                phase: 'depressive',
            },
            'flat-expression': {
                sprite: '/assets/characters/overlays/flat-expression.png',
                position: { x: 0, y: 0 },
                hotspot: { x: 160, y: 80, width: 120, height: 100 },
                phase: 'depressive',
            },
        },
    },

    // Symptoms that can be discovered (changes based on phase)
    hiddenSymptoms: {
        manic: ['dilated-pupils', 'rapid-eye-movement', 'fidgeting', 'flashy-clothes'],
        depressive: ['slumped-posture', 'flat-expression'],
    },

    // Key contradictions
    contradictions: [
        {
            id: 'contradiction-sleep-energy',
            keyword: 'sleep-decrease',
            symptom: 'dilated-pupils',
            description: 'Claims to need very little sleep but shows physical signs of stress',
        },
        {
            id: 'contradiction-spending',
            keyword: 'spending',
            symptom: 'fidgeting',
            description: 'Impulsive spending pattern during elevated mood states',
        },
        {
            id: 'contradiction-mood-cycle',
            keyword: 'dark-period',
            symptom: 'flat-expression',
            description: 'History of alternating between extreme highs and crushing lows',
        },
    ],

    // Dialogue phases (turns)
    phases: [
        {
            turn: 1,
            presentation: 'manic',
            dialogue: [
                {
                    id: 'turn1-intro',
                    text: "Doc! Great to see you! I've been looking forward to this all week!",
                    keywords: [],
                    speakerMood: 'manic',
                },
                {
                    id: 'turn1-ideas',
                    text: "Oh man, where do I even start? So I've had these [amazing ideas] lately!",
                    keywords: [
                        {
                            text: 'amazing ideas',
                            id: 'keyword-great-ideas',
                            relatedSymptom: 'dilated-pupils',
                        }
                    ],
                    speakerMood: 'manic',
                },
                {
                    id: 'turn1-sleep',
                    text: "Sleep? Who needs sleep when you're this [full of energy]? I've only needed like [three or four hours] the past couple weeks!",
                    keywords: [
                        {
                            text: 'full of energy',
                            id: 'keyword-energy-claims',
                            relatedSymptom: null,
                        },
                        {
                            text: 'three or four hours',
                            id: 'keyword-sleep-decrease',
                            contradicts: 'dilated-pupils',
                        }
                    ],
                    speakerMood: 'dismissive',
                },
            ],
        },
        {
            turn: 2,
            presentation: 'manic',
            dialogue: [
                {
                    id: 'turn2-spending',
                    text: "Look at this! I ordered all the equipment for the food truck! Got an amazing deal - only $15,000!",
                    keywords: [
                        {
                            text: '$15,000',
                            id: 'keyword-spending',
                            relatedSymptom: 'fidgeting',
                        }
                    ],
                    speakerMood: 'excited',
                },
                {
                    id: 'turn2-investment',
                    text: "I put it on the credit card. But it's an INVESTMENT, doc! I've already done the research - food trucks can make [six figures]!",
                    keywords: [
                        {
                            text: 'six figures',
                            id: 'keyword-grandiose',
                            relatedSymptom: null,
                        }
                    ],
                    speakerMood: 'manic',
                },
            ],
        },
        {
            turn: 3,
            presentation: 'depressive',
            dialogue: [
                {
                    id: 'turn3-shift',
                    text: "$15,000. What was I thinking?",
                    keywords: [],
                    speakerMood: 'depressive',
                },
                {
                    id: 'turn3-crash',
                    text: "The [dark periods] always come after. Like a crash.",
                    keywords: [
                        {
                            text: 'dark periods',
                            id: 'keyword-dark-period',
                            contradicts: 'flat-expression',
                        }
                    ],
                    speakerMood: 'depressive',
                },
                {
                    id: 'turn3-worthless',
                    text: "I felt [worthless]. Completely worthless.",
                    keywords: [
                        {
                            text: 'worthless',
                            id: 'keyword-worthless',
                            relatedSymptom: 'slumped-posture',
                        }
                    ],
                    speakerMood: 'depressive',
                },
            ],
        },
        {
            turn: 4,
            presentation: 'mixed',
            dialogue: [
                {
                    id: 'turn4-question',
                    text: "Doc... is something wrong with me? Really wrong?",
                    keywords: [],
                    speakerMood: 'scared',
                },
                {
                    id: 'turn4-pattern',
                    text: "The highs and the lows... they're connected? The same thing?",
                    keywords: [],
                    speakerMood: 'realization',
                },
            ],
        },
    ],

    // Diagnosis criteria hints
    diagnosisHints: [
        'Patient shows rapid cycling between elevated and depressed mood states',
        'Decreased need for sleep during manic phase',
        'Impulsive spending behavior',
        'Grandiose thinking (unrealistic business plans)',
        'History of mood episodes with associated consequences',
        'Visible shift in energy, posture, and expression within session',
    ],

    // Session summary template
    sessionSummary: {
        presenting: 'Patient presented initially with elevated mood and pressured speech, showing a dramatic shift to depressed affect mid-session.',
        keyFindings: [
            'Significant decrease in sleep need (3-4 hours/night for 2+ weeks)',
            'Impulsive financial decisions ($15,000 credit card purchase)',
            'History of similar episodes with negative consequences',
            'Observable mood cycling within session',
            'Insight into pattern emerging during session',
        ],
    },
};

export default BIPOLAR_PATIENT;
