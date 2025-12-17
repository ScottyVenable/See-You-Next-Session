/**
 * SDNS Dialogue System - Legacy Compatibility Layer
 * This file re-exports from the new SDNS module for backwards compatibility
 * 
 * @deprecated Import from '../sdns' instead
 */

// Re-export everything from the new SDNS module
export * from '../sdns/index.js';
export { default } from '../sdns/index.js';

// Legacy alias for loadPatientDialogue  
import { loadPatientDialogue as loadSession } from '../sdns/index.js';
export const loadPatientDialogue = loadSession;

console.warn('[DEPRECATED] Import from "../sdns" instead of "../dialogue"');
