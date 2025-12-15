// Symptom definitions (Visual Tokens)
export const SYMPTOMS = {
    // Anxiety-related
    'bitten-nails': {
        id: 'bitten-nails',
        name: 'Bitten Nails',
        description: 'Fingernails appear short and ragged from habitual biting.',
        category: 'physical',
        bodyLocation: 'hands',
        focusCost: 15,
        relatedDisorders: ['generalized-anxiety'],
    },

    'bags-under-eyes': {
        id: 'bags-under-eyes',
        name: 'Bags Under Eyes',
        description: 'Dark circles and puffiness beneath the eyes, indicating sleep deprivation.',
        category: 'physical',
        bodyLocation: 'face',
        focusCost: 15,
        relatedDisorders: ['generalized-anxiety', 'bipolar-1'],
    },

    'chewed-lip': {
        id: 'chewed-lip',
        name: 'Chewed Lip',
        description: 'Lips appear raw or damaged from nervous chewing.',
        category: 'physical',
        bodyLocation: 'face',
        focusCost: 15,
        relatedDisorders: ['generalized-anxiety'],
    },

    'looking-around': {
        id: 'looking-around',
        name: 'Constantly Looking Around',
        description: 'Eyes dart around the room, unable to maintain steady focus.',
        category: 'behavioral',
        bodyLocation: 'face',
        focusCost: 15,
        relatedDisorders: ['generalized-anxiety'],
    },

    'trembling-hands': {
        id: 'trembling-hands',
        name: 'Trembling Hands',
        description: 'Visible shaking or tremor in the hands.',
        category: 'physical',
        bodyLocation: 'hands',
        focusCost: 15,
        relatedDisorders: ['generalized-anxiety'],
    },

    'sweating': {
        id: 'sweating',
        name: 'Visible Sweating',
        description: 'Perspiration visible on forehead or palms despite normal temperature.',
        category: 'physical',
        bodyLocation: 'face',
        focusCost: 15,
        relatedDisorders: ['generalized-anxiety'],
    },

    // Bipolar-related (Manic)
    'dilated-pupils': {
        id: 'dilated-pupils',
        name: 'Dilated Pupils',
        description: 'Pupils appear unusually large, indicating heightened arousal.',
        category: 'physical',
        bodyLocation: 'face',
        focusCost: 15,
        relatedDisorders: ['bipolar-1'],
    },

    'rapid-eye-movement': {
        id: 'rapid-eye-movement',
        name: 'Rapid Eye Movement',
        description: 'Eyes move quickly, tracking multiple things at once.',
        category: 'behavioral',
        bodyLocation: 'face',
        focusCost: 15,
        relatedDisorders: ['bipolar-1'],
    },

    'fidgeting': {
        id: 'fidgeting',
        name: 'Fidgeting',
        description: 'Constant small movements - tapping, shifting, unable to sit still.',
        category: 'behavioral',
        bodyLocation: 'body',
        focusCost: 15,
        relatedDisorders: ['bipolar-1', 'generalized-anxiety'],
    },

    'flashy-clothes': {
        id: 'flashy-clothes',
        name: 'Flashy/Revealing Clothing',
        description: 'Dressed in bright colors, excessive jewelry, or revealing clothes.',
        category: 'appearance',
        bodyLocation: 'body',
        focusCost: 15,
        relatedDisorders: ['bipolar-1'],
    },

    // Bipolar-related (Depressive)
    'slumped-posture': {
        id: 'slumped-posture',
        name: 'Slumped Posture',
        description: 'Body appears collapsed inward, shoulders hunched.',
        category: 'behavioral',
        bodyLocation: 'body',
        focusCost: 15,
        relatedDisorders: ['bipolar-1'],
    },

    'flat-expression': {
        id: 'flat-expression',
        name: 'Flat Expression',
        description: 'Face shows little to no emotional expression.',
        category: 'behavioral',
        bodyLocation: 'face',
        focusCost: 15,
        relatedDisorders: ['bipolar-1'],
    },

    // Factitious-related
    'healthy-appearance': {
        id: 'healthy-appearance',
        name: 'Healthy Appearance',
        description: 'Despite claims of illness, appears physically healthy.',
        category: 'appearance',
        bodyLocation: 'body',
        focusCost: 15,
        relatedDisorders: ['factitious-disorder'],
    },

    'no-visible-wounds': {
        id: 'no-visible-wounds',
        name: 'No Visible Wounds',
        description: 'Claims of injury but no physical evidence visible.',
        category: 'physical',
        bodyLocation: 'body',
        focusCost: 15,
        relatedDisorders: ['factitious-disorder'],
    },

    'rosy-cheeks': {
        id: 'rosy-cheeks',
        name: 'Rosy Cheeks',
        description: 'Healthy color in the face, indicating good circulation.',
        category: 'appearance',
        bodyLocation: 'face',
        focusCost: 15,
        relatedDisorders: ['factitious-disorder'],
    },

    'well-groomed': {
        id: 'well-groomed',
        name: 'Well Groomed',
        description: 'Hair and appearance are carefully maintained.',
        category: 'appearance',
        bodyLocation: 'body',
        focusCost: 15,
        relatedDisorders: ['factitious-disorder'],
    },
};

export const getSymptomById = (id) => SYMPTOMS[id] || null;

export const getSymptomsByDisorder = (disorderId) => {
    return Object.values(SYMPTOMS).filter(s =>
        s.relatedDisorders.includes(disorderId)
    );
};

export const getAllSymptoms = () => Object.values(SYMPTOMS);
