// Disorder definitions for the Handbook
export const DISORDERS = {
    'generalized-anxiety': {
        id: 'generalized-anxiety',
        name: 'Generalized Anxiety Disorder (GAD)',
        description: 'Persistent, excessive worry about various things that is difficult to control.',
        criteria: [
            'Persistent worry about multiple areas of life',
            'Difficulty controlling the worry',
            'Physical symptoms (muscle tension, fatigue, sleep problems)',
            'Restlessness or feeling on edge',
            'Difficulty concentrating',
            'Irritability',
        ],
        relatedSymptoms: [
            'bitten-nails',
            'bags-under-eyes',
            'chewed-lip',
            'looking-around',
            'trembling-hands',
            'sweating',
        ],
    },

    'bipolar-1': {
        id: 'bipolar-1',
        name: 'Bipolar I Disorder',
        description: 'Characterized by manic episodes lasting at least 7 days, often with depressive episodes.',
        criteria: [
            'At least one manic episode (elevated mood, high energy)',
            'Decreased need for sleep during mania',
            'Racing thoughts and rapid speech',
            'Impulsive behavior (spending, risky activities)',
            'Grandiosity or inflated self-esteem',
            'Depressive episodes with profound sadness',
        ],
        relatedSymptoms: [
            'mania-dilated-pupils',
            'mania-rapid-eye-movement',
            'mania-fidgeting',
            'mania-flashy-clothes',
            'depression-slumped-posture',
            'depression-flat-expression',
            'depression-bags-under-eyes',
        ],
    },

    'factitious-disorder': {
        id: 'factitious-disorder',
        name: 'Factitious Disorder',
        description: 'Intentionally faking or inducing illness to assume the "sick role" for attention.',
        criteria: [
            'Fabricating symptoms or medical history',
            'Exaggerating existing symptoms',
            'Inducing injury or illness intentionally',
            'Extensive, inconsistent medical histories',
            'Seeking the "sick role" without external incentive',
            'Behavior not explained by another mental disorder',
        ],
        relatedSymptoms: [
            'healthy-appearance',
            'inconsistent-story',
            'no-visible-wounds',
            'rosy-cheeks',
            'well-groomed',
        ],
    },
};

export const getDisorderById = (id) => DISORDERS[id] || null;

export const getAllDisorders = () => Object.values(DISORDERS);
