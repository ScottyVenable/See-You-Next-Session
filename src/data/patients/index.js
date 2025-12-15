import { TUTORIAL_PATIENT } from './tutorial-patient.js';
import { BIPOLAR_PATIENT } from './bipolar-patient.js';
import { FACTITIOUS_PATIENT } from './factitious-patient.js';

export const PATIENTS = {
    'patient-tutorial': TUTORIAL_PATIENT,
    'patient-bipolar': BIPOLAR_PATIENT,
    'patient-factitious': FACTITIOUS_PATIENT,
};

// Re-export individual patients
export { TUTORIAL_PATIENT, BIPOLAR_PATIENT, FACTITIOUS_PATIENT };

export const getPatientById = (id) => PATIENTS[id] || null;

export const getAllPatients = () => Object.values(PATIENTS);

export const getPatientsByDifficulty = (difficulty) => {
    return Object.values(PATIENTS).filter(p => p.difficulty === difficulty);
};
