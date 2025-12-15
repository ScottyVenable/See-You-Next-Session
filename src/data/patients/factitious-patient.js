// Patient 3: Factitious Disorder (Munchausen Syndrome) - BOSS LEVEL
export const FACTITIOUS_PATIENT = {
    id: 'patient-factitious',
    name: 'Victoria',
    age: 35,
    gender: 'female',
    difficulty: 'hard',
    correctDiagnosis: 'factitious-disorder',

    // Story file reference
    storyFile: 'victoria-factitious',

    // Visual appearance - The KEY here is she looks TOO healthy
    appearance: {
        baseSprite: '/assets/characters/victoria-base.png',
        // These are "negative symptoms" - evidence that contradicts her claims
        symptomOverlays: {
            'healthy-appearance': {
                sprite: '/assets/characters/overlays/healthy-glow.png',
                position: { x: 0, y: 0 },
                hotspot: { x: 140, y: 60, width: 120, height: 200 },
                description: 'Clear, healthy skin with good color - unusual for claimed chronic illness',
            },
            'no-visible-wounds': {
                sprite: '/assets/characters/overlays/smooth-skin.png',
                position: { x: 0, y: 0 },
                hotspot: { x: 100, y: 220, width: 200, height: 120 },
                description: 'No visible surgical scars despite claims of seven surgeries',
            },
            'rosy-cheeks': {
                sprite: '/assets/characters/overlays/rosy-cheeks.png',
                position: { x: 0, y: 0 },
                hotspot: { x: 160, y: 100, width: 80, height: 50 },
                description: 'Healthy complexion contradicts chronic fatigue claims',
            },
            'manicured-nails': {
                sprite: '/assets/characters/overlays/manicured-nails.png',
                position: { x: 0, y: 0 },
                hotspot: { x: 140, y: 380, width: 100, height: 60 },
                description: 'Perfect manicure - high maintenance for someone in chronic pain',
            },
            'designer-clothes': {
                sprite: '/assets/characters/overlays/designer-clothes.png',
                position: { x: 0, y: 0 },
                hotspot: { x: 100, y: 180, width: 200, height: 200 },
                description: 'Immaculate, expensive clothing - extensive self-care despite illness claims',
            },
            'perfect-hair': {
                sprite: '/assets/characters/overlays/perfect-hair.png',
                position: { x: 0, y: 0 },
                hotspot: { x: 120, y: 20, width: 160, height: 100 },
                description: 'Professionally styled hair - time-consuming maintenance',
            },
        },
    },

    // Symptoms that can be discovered
    // Note: These are "absence of expected symptoms" or "too healthy" indicators
    hiddenSymptoms: [
        'healthy-appearance',
        'no-visible-wounds',
        'rosy-cheeks',
        'manicured-nails',
        'designer-clothes',
        'perfect-hair',
    ],

    // Key contradictions - the core of Factitious Disorder detection
    contradictions: [
        {
            id: 'contradiction-appearance-illness',
            keyword: 'chronic-pain',
            symptom: 'healthy-appearance',
            description: 'Claims severe chronic pain but shows no physical signs of chronic illness',
            isCritical: true,
        },
        {
            id: 'contradiction-surgery-scars',
            keyword: 'multiple-surgeries',
            symptom: 'no-visible-wounds',
            description: 'Claims seven surgeries but no visible surgical scars',
            isCritical: true,
        },
        {
            id: 'contradiction-fatigue-appearance',
            keyword: 'rare-conditions',
            symptom: 'rosy-cheeks',
            description: 'Claims debilitating conditions but has healthy, glowing complexion',
            isCritical: false,
        },
        {
            id: 'contradiction-maintenance',
            keyword: 'chronic-pain',
            symptom: 'manicured-nails',
            description: 'Extensive beauty maintenance contradicts inability to function normally',
            isCritical: false,
        },
    ],

    // Dialogue phases (turns)
    phases: [
        {
            turn: 1,
            dialogue: [
                {
                    id: 'turn1-intro',
                    text: "Thank you for seeing me, doctor. I know you specialize in mental health, but I was hoping you might understand what the others can't.",
                    keywords: [],
                    speakerMood: 'suffering-performance',
                },
                {
                    id: 'turn1-conditions',
                    text: "I have a [rare autoimmune condition]. Several, actually. Lupus, fibromyalgia, and something called Ehlers-Danlos syndrome.",
                    keywords: [
                        {
                            text: 'rare autoimmune condition',
                            id: 'keyword-rare-conditions',
                            contradicts: 'healthy-appearance',
                        }
                    ],
                    speakerMood: 'performative',
                },
                {
                    id: 'turn1-doctors',
                    text: "I've seen 23 doctors in the past two years. Twenty-three! And they all eventually turn me away.",
                    keywords: [
                        {
                            text: '23 doctors',
                            id: 'keyword-doctor-frustration',
                            relatedSymptom: null,
                        }
                    ],
                    speakerMood: 'frustrated-performance',
                },
            ],
        },
        {
            turn: 2,
            dialogue: [
                {
                    id: 'turn2-surgeries',
                    text: "I've had [seven surgeries] in the past four years. Exploratory surgeries, mostly.",
                    keywords: [
                        {
                            text: 'seven surgeries',
                            id: 'keyword-multiple-surgeries',
                            contradicts: 'no-visible-wounds',
                        }
                    ],
                    speakerMood: 'vulnerable-performance',
                },
                {
                    id: 'turn2-scars',
                    text: "But the scars have healed well. You probably can't even see them.",
                    keywords: [],
                    speakerMood: 'deflecting',
                    // This is a red flag - remarkably good healing for 7 surgeries
                },
                {
                    id: 'turn2-knowledge',
                    text: "I've had to become my own advocate. I've read every medical journal, every study. Did you know that fibromyalgia often presents with [comorbid conditions]?",
                    keywords: [
                        {
                            text: 'comorbid conditions',
                            id: 'keyword-medical-knowledge',
                            relatedSymptom: null,
                        }
                    ],
                    speakerMood: 'knowledgeable',
                },
                {
                    id: 'turn2-new-symptoms',
                    text: "Actually, I've been having some [new symptoms] lately. My neurologist thinks it might be MS now.",
                    keywords: [
                        {
                            text: 'new symptoms',
                            id: 'keyword-new-symptoms',
                            relatedSymptom: null,
                        }
                    ],
                    speakerMood: 'excited-performance',
                    // Red flag: she sounds eager about potential new diagnosis
                },
            ],
        },
        {
            turn: 3,
            dialogue: [
                {
                    id: 'turn3-confrontation',
                    text: "What do you mean? Are you saying you don't believe me either? I KNEW this would happen!",
                    keywords: [],
                    speakerMood: 'defensive',
                    triggeredBy: 'player-questions-symptoms',
                },
                {
                    id: 'turn3-mother',
                    text: "My mother was always sick. Cancer, eventually. She was in and out of hospitals my whole childhood.",
                    keywords: [],
                    speakerMood: 'vulnerable-real',
                },
                {
                    id: 'turn3-invisible',
                    text: "I was the healthy one. The one everyone expected to be fine.",
                    keywords: [],
                    speakerMood: 'revealing',
                },
            ],
        },
        {
            turn: 4,
            dialogue: [
                {
                    id: 'turn4-attention',
                    text: "When I'm sick... people SEE me. My husband stays home from work. My daughter sits with me.",
                    keywords: [],
                    speakerMood: 'vulnerable-real',
                },
                {
                    id: 'turn4-realization',
                    text: "When I'm well... I'm nobody. Have I been making myself sick for ATTENTION?",
                    keywords: [],
                    speakerMood: 'realization',
                },
                {
                    id: 'turn4-help',
                    text: "I need help, don't I? Real help.",
                    keywords: [],
                    speakerMood: 'breakthrough',
                },
            ],
        },
    ],

    // Boss-specific mechanics
    bossFeatures: {
        // Victoria's performance is convincing at first
        initialDeceptionLevel: 'high',

        // Key insight: contradictions are ABSENCE of expected symptoms
        detectionStrategy: 'inverse',

        // Red flags to watch for (beyond visual symptoms)
        redFlags: [
            'Excessive medical knowledge',
            'Enthusiasm about new diagnoses',
            'Pattern of doctor-shopping',
            'No objective test results support claims',
            'Symptoms that conveniently cannot be verified',
            'Story inconsistencies when pressed',
        ],

        // Breakthrough requires finding specific contradiction combo
        requiredBreakthroughs: ['appearance-illness', 'surgery-scars'],
    },

    // Diagnosis criteria hints
    diagnosisHints: [
        'Discrepancy between claimed symptoms and physical presentation',
        'Extensive medical knowledge beyond typical patient',
        'History of multiple procedures with no conclusive findings',
        'Pattern of seeking medical attention despite negative workups',
        'Symptoms may serve psychological need for care/attention',
        'Childhood history of illness-focused family dynamics',
    ],

    // Session summary template
    sessionSummary: {
        presenting: 'Patient presents with extensive somatic complaints and medical history inconsistent with physical presentation.',
        keyFindings: [
            'Claims multiple rare conditions but appears healthy and well-groomed',
            'Reports seven surgeries with no visible scarring',
            'Demonstrates sophisticated medical knowledge',
            'History of 23+ providers with no definitive diagnosis',
            'Childhood association of illness with attention/care',
            'Genuine distress emerges when performance is gently challenged',
        ],
        clinicalNote: 'Consider Factitious Disorder - patient may be unconsciously producing/exaggerating symptoms for psychological reasons rather than external gain.',
    },
};

export default FACTITIOUS_PATIENT;
