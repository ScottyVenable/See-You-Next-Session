/**
 * ErrorHandler - Comprehensive Error Handling System
 * Provides centralized error logging, tracking, and dev-friendly display
 * 
 * @module utils/ErrorHandler
 * @version 1.0.0
 */

// Error severity levels
export const ErrorLevel = {
    DEBUG: 'debug',
    INFO: 'info',
    WARN: 'warn',
    ERROR: 'error',
    CRITICAL: 'critical',
};

// Error categories for filtering
export const ErrorCategory = {
    DIALOGUE: 'dialogue',
    SDNS: 'sdns',
    PATIENT: 'patient',
    SAVE: 'save',
    AUDIO: 'audio',
    UI: 'ui',
    GAME_STATE: 'game-state',
    NETWORK: 'network',
    GENERAL: 'general',
};

/**
 * Error log entry structure
 */
class ErrorEntry {
    constructor(message, level, category, details = {}) {
        this.id = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.timestamp = new Date();
        this.message = message;
        this.level = level;
        this.category = category;
        this.details = details;
        this.stack = details.stack || new Error().stack;
        this.context = details.context || {};
        this.resolved = false;
    }

    toJSON() {
        return {
            id: this.id,
            timestamp: this.timestamp.toISOString(),
            message: this.message,
            level: this.level,
            category: this.category,
            details: this.details,
            context: this.context,
            resolved: this.resolved,
        };
    }
}

/**
 * Main ErrorHandler class
 */
class ErrorHandler {
    constructor() {
        this.errors = [];
        this.maxErrors = 100; // Keep last 100 errors
        this.listeners = new Set();
        this.isDevMode = import.meta.env?.DEV ?? true;

        // Track error counts by category
        this.errorCounts = {};
        Object.values(ErrorCategory).forEach(cat => {
            this.errorCounts[cat] = 0;
        });

        // Initialize global error handlers
        this.setupGlobalHandlers();
    }

    /**
     * Set up global error catching
     */
    setupGlobalHandlers() {
        // Catch unhandled errors
        window.addEventListener('error', (event) => {
            this.log(
                event.message || 'Unknown error',
                ErrorLevel.ERROR,
                ErrorCategory.GENERAL,
                {
                    filename: event.filename,
                    lineno: event.lineno,
                    colno: event.colno,
                    stack: event.error?.stack,
                }
            );
        });

        // Catch unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.log(
                event.reason?.message || 'Unhandled Promise rejection',
                ErrorLevel.ERROR,
                ErrorCategory.GENERAL,
                {
                    reason: event.reason,
                    stack: event.reason?.stack,
                }
            );
        });

        // Override console.error to capture all errors
        const originalConsoleError = console.error;
        console.error = (...args) => {
            // Call original
            originalConsoleError.apply(console, args);

            // Log to our system (but avoid infinite loops)
            const message = args.map(arg =>
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ');

            if (!message.includes('[ErrorHandler]')) {
                this.log(message, ErrorLevel.ERROR, ErrorCategory.GENERAL, {
                    source: 'console.error',
                    args
                });
            }
        };

        // Override console.warn
        const originalConsoleWarn = console.warn;
        console.warn = (...args) => {
            originalConsoleWarn.apply(console, args);

            const message = args.map(arg =>
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ');

            if (!message.includes('[ErrorHandler]')) {
                this.log(message, ErrorLevel.WARN, ErrorCategory.GENERAL, {
                    source: 'console.warn',
                    args
                });
            }
        };
    }

    /**
     * Log an error
     * @param {string} message - Error message
     * @param {string} level - ErrorLevel
     * @param {string} category - ErrorCategory
     * @param {object} details - Additional details
     * @returns {ErrorEntry}
     */
    log(message, level = ErrorLevel.ERROR, category = ErrorCategory.GENERAL, details = {}) {
        const entry = new ErrorEntry(message, level, category, details);

        this.errors.push(entry);
        this.errorCounts[category] = (this.errorCounts[category] || 0) + 1;

        // Trim old errors
        if (this.errors.length > this.maxErrors) {
            this.errors = this.errors.slice(-this.maxErrors);
        }

        // Notify listeners
        this.notifyListeners(entry);

        // Dev mode logging with colors
        if (this.isDevMode) {
            this.devLog(entry);
        }

        return entry;
    }

    /**
     * Dev-friendly console output with colors
     */
    devLog(entry) {
        const colors = {
            [ErrorLevel.DEBUG]: '#888',
            [ErrorLevel.INFO]: '#2196F3',
            [ErrorLevel.WARN]: '#FF9800',
            [ErrorLevel.ERROR]: '#F44336',
            [ErrorLevel.CRITICAL]: '#9C27B0',
        };

        const categoryColors = {
            [ErrorCategory.DIALOGUE]: '#4CAF50',
            [ErrorCategory.SDNS]: '#00BCD4',
            [ErrorCategory.PATIENT]: '#E91E63',
            [ErrorCategory.SAVE]: '#795548',
            [ErrorCategory.AUDIO]: '#9C27B0',
            [ErrorCategory.UI]: '#FF5722',
            [ErrorCategory.GAME_STATE]: '#673AB7',
            [ErrorCategory.NETWORK]: '#2196F3',
            [ErrorCategory.GENERAL]: '#607D8B',
        };

        const levelColor = colors[entry.level] || '#888';
        const catColor = categoryColors[entry.category] || '#888';

        console.groupCollapsed(
            `%c[ErrorHandler] %c${entry.level.toUpperCase()} %c[${entry.category}] %c${entry.message}`,
            'color: #888; font-weight: bold;',
            `color: ${levelColor}; font-weight: bold;`,
            `color: ${catColor};`,
            'color: inherit;'
        );

        if (entry.details && Object.keys(entry.details).length > 0) {
            console.log('Details:', entry.details);
        }
        if (entry.context && Object.keys(entry.context).length > 0) {
            console.log('Context:', entry.context);
        }
        if (entry.stack) {
            console.log('Stack:', entry.stack);
        }
        console.log('Entry ID:', entry.id);
        console.groupEnd();
    }

    /**
     * Convenience methods for different error levels
     */
    debug(message, category = ErrorCategory.GENERAL, details = {}) {
        return this.log(message, ErrorLevel.DEBUG, category, details);
    }

    info(message, category = ErrorCategory.GENERAL, details = {}) {
        return this.log(message, ErrorLevel.INFO, category, details);
    }

    warn(message, category = ErrorCategory.GENERAL, details = {}) {
        return this.log(message, ErrorLevel.WARN, category, details);
    }

    error(message, category = ErrorCategory.GENERAL, details = {}) {
        return this.log(message, ErrorLevel.ERROR, category, details);
    }

    critical(message, category = ErrorCategory.GENERAL, details = {}) {
        return this.log(message, ErrorLevel.CRITICAL, category, details);
    }

    /**
     * Category-specific logging helpers
     */
    dialogue(message, level = ErrorLevel.ERROR, details = {}) {
        return this.log(message, level, ErrorCategory.DIALOGUE, details);
    }

    sdns(message, level = ErrorLevel.ERROR, details = {}) {
        return this.log(message, level, ErrorCategory.SDNS, details);
    }

    patient(message, level = ErrorLevel.ERROR, details = {}) {
        return this.log(message, level, ErrorCategory.PATIENT, details);
    }

    save(message, level = ErrorLevel.ERROR, details = {}) {
        return this.log(message, level, ErrorCategory.SAVE, details);
    }

    audio(message, level = ErrorLevel.ERROR, details = {}) {
        return this.log(message, level, ErrorCategory.AUDIO, details);
    }

    ui(message, level = ErrorLevel.ERROR, details = {}) {
        return this.log(message, level, ErrorCategory.UI, details);
    }

    gameState(message, level = ErrorLevel.ERROR, details = {}) {
        return this.log(message, level, ErrorCategory.GAME_STATE, details);
    }

    /**
     * Subscribe to error events
     * @param {Function} callback - Called with ErrorEntry on new errors
     * @returns {Function} Unsubscribe function
     */
    subscribe(callback) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    notifyListeners(entry) {
        this.listeners.forEach(callback => {
            try {
                callback(entry);
            } catch (e) {
                // Prevent listener errors from causing issues
            }
        });
    }

    /**
     * Get all errors, optionally filtered
     * @param {object} filters - { level, category, since, unresolved }
     */
    getErrors(filters = {}) {
        let result = [...this.errors];

        if (filters.level) {
            result = result.filter(e => e.level === filters.level);
        }
        if (filters.category) {
            result = result.filter(e => e.category === filters.category);
        }
        if (filters.since) {
            result = result.filter(e => e.timestamp >= filters.since);
        }
        if (filters.unresolved) {
            result = result.filter(e => !e.resolved);
        }

        return result;
    }

    /**
     * Get error statistics
     */
    getStats() {
        const byLevel = {};
        const byCategory = {};

        this.errors.forEach(e => {
            byLevel[e.level] = (byLevel[e.level] || 0) + 1;
            byCategory[e.category] = (byCategory[e.category] || 0) + 1;
        });

        return {
            total: this.errors.length,
            byLevel,
            byCategory,
            recentCount: this.errors.filter(e =>
                Date.now() - e.timestamp.getTime() < 60000
            ).length,
        };
    }

    /**
     * Mark an error as resolved
     */
    resolve(errorId) {
        const error = this.errors.find(e => e.id === errorId);
        if (error) {
            error.resolved = true;
        }
    }

    /**
     * Clear all errors
     */
    clear() {
        this.errors = [];
        Object.keys(this.errorCounts).forEach(key => {
            this.errorCounts[key] = 0;
        });
    }

    /**
     * Export errors for debugging
     */
    export() {
        return {
            exportedAt: new Date().toISOString(),
            stats: this.getStats(),
            errors: this.errors.map(e => e.toJSON()),
        };
    }

    /**
     * Create a try-catch wrapper for async functions
     * @param {Function} fn - Async function to wrap
     * @param {string} category - Error category
     * @param {string} context - Description of what the function does
     */
    wrapAsync(fn, category = ErrorCategory.GENERAL, context = '') {
        return async (...args) => {
            try {
                return await fn(...args);
            } catch (error) {
                this.log(error.message, ErrorLevel.ERROR, category, {
                    stack: error.stack,
                    context: { description: context, args },
                });
                throw error;
            }
        };
    }

    /**
     * Create a try-catch wrapper for sync functions
     */
    wrap(fn, category = ErrorCategory.GENERAL, context = '') {
        return (...args) => {
            try {
                return fn(...args);
            } catch (error) {
                this.log(error.message, ErrorLevel.ERROR, category, {
                    stack: error.stack,
                    context: { description: context, args },
                });
                throw error;
            }
        };
    }
}

// Singleton instance
export const errorHandler = new ErrorHandler();

// Default export
export default errorHandler;

/**
 * React hook for error handling
 */
export function useErrorHandler() {
    return errorHandler;
}

/**
 * Decorator for class methods (can be used manually)
 */
export function catchErrors(category = ErrorCategory.GENERAL) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args) {
            try {
                return await originalMethod.apply(this, args);
            } catch (error) {
                errorHandler.log(
                    `${propertyKey}: ${error.message}`,
                    ErrorLevel.ERROR,
                    category,
                    { stack: error.stack, method: propertyKey }
                );
                throw error;
            }
        };

        return descriptor;
    };
}
