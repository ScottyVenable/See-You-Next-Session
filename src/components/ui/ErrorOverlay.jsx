import React, { useState, useEffect, useCallback } from 'react';
import { errorHandler, ErrorLevel, ErrorCategory } from '../../utils/ErrorHandler.js';

/**
 * ErrorOverlay - Real-time error display overlay for development
 * Shows errors as they happen with filtering and management
 */
function ErrorOverlay() {
    const [errors, setErrors] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [filter, setFilter] = useState({ level: null, category: null });
    const [stats, setStats] = useState({ total: 0 });

    // Only show in dev mode
    const [isDevMode] = useState(() => import.meta.env?.DEV ?? true);

    useEffect(() => {
        if (!isDevMode) return;

        // Subscribe to error updates
        const unsubscribe = errorHandler.subscribe((entry) => {
            setErrors(prev => [...prev.slice(-49), entry]); // Keep last 50
            setStats(errorHandler.getStats());
        });

        // Load initial errors
        setErrors(errorHandler.getErrors());
        setStats(errorHandler.getStats());

        return unsubscribe;
    }, [isDevMode]);

    const clearErrors = useCallback(() => {
        errorHandler.clear();
        setErrors([]);
        setStats({ total: 0 });
    }, []);

    const filteredErrors = errors.filter(e => {
        if (filter.level && e.level !== filter.level) return false;
        if (filter.category && e.category !== filter.category) return false;
        return true;
    });

    const copyAllErrors = useCallback(() => {
        const logText = filteredErrors.map(e => {
            const time = new Date(e.timestamp).toLocaleTimeString();
            return `[${time}] [${e.level}] [${e.category}] ${e.message}${e.context ? `\n  Context: ${JSON.stringify(e.context)}` : ''}`;
        }).join('\n');
        
        navigator.clipboard.writeText(logText).then(() => {
            console.log('Debug logs copied to clipboard');
        }).catch(err => {
            console.error('Failed to copy logs:', err);
        });
    }, [filteredErrors]);

    const getErrorCount = (level) => {
        return errors.filter(e => e.level === level).length;
    };

    if (!isDevMode) return null;

    // Minimized badge view
    if (isMinimized) {
        const errorCount = getErrorCount(ErrorLevel.ERROR) + getErrorCount(ErrorLevel.CRITICAL);
        const warnCount = getErrorCount(ErrorLevel.WARN);

        return (
            <div
                style={styles.minimizedBadge}
                onClick={() => setIsMinimized(false)}
                title="Click to expand error panel"
            >
                <span style={styles.badgeIcon}>🔧</span>
                {errorCount > 0 && (
                    <span style={{ ...styles.badgeCount, background: '#e74c3c' }}>
                        {errorCount}
                    </span>
                )}
                {warnCount > 0 && (
                    <span style={{ ...styles.badgeCount, background: '#f39c12' }}>
                        {warnCount}
                    </span>
                )}
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <div style={styles.headerLeft}>
                    <span style={styles.headerIcon}>🔧</span>
                    <span style={styles.headerTitle}>Debug Logs</span>
                    <span style={styles.headerCount}>
                        {stats.total} total
                    </span>
                </div>
                <div style={styles.headerRight}>
                    <button
                        style={styles.headerButton}
                        onClick={copyAllErrors}
                        title="Copy all logs"
                    >
                        Copy
                    </button>
                    <button
                        style={styles.headerButton}
                        onClick={() => setIsExpanded(!isExpanded)}
                        title={isExpanded ? 'Collapse' : 'Expand'}
                    >
                        {isExpanded ? '▼' : '▲'}
                    </button>
                    <button
                        style={styles.headerButton}
                        onClick={() => setIsMinimized(true)}
                        title="Minimize"
                    >
                        _
                    </button>
                </div>
            </div>

            {isExpanded && (
                <>
                    {/* Stats Row */}
                    <div style={styles.statsRow}>
                        <StatBadge
                            label="Critical"
                            count={getErrorCount(ErrorLevel.CRITICAL)}
                            color="#9b59b6"
                            onClick={() => setFilter(f => ({
                                ...f,
                                level: f.level === ErrorLevel.CRITICAL ? null : ErrorLevel.CRITICAL
                            }))}
                            active={filter.level === ErrorLevel.CRITICAL}
                        />
                        <StatBadge
                            label="Error"
                            count={getErrorCount(ErrorLevel.ERROR)}
                            color="#e74c3c"
                            onClick={() => setFilter(f => ({
                                ...f,
                                level: f.level === ErrorLevel.ERROR ? null : ErrorLevel.ERROR
                            }))}
                            active={filter.level === ErrorLevel.ERROR}
                        />
                        <StatBadge
                            label="Warn"
                            count={getErrorCount(ErrorLevel.WARN)}
                            color="#f39c12"
                            onClick={() => setFilter(f => ({
                                ...f,
                                level: f.level === ErrorLevel.WARN ? null : ErrorLevel.WARN
                            }))}
                            active={filter.level === ErrorLevel.WARN}
                        />
                        <StatBadge
                            label="Info"
                            count={getErrorCount(ErrorLevel.INFO)}
                            color="#3498db"
                            onClick={() => setFilter(f => ({
                                ...f,
                                level: f.level === ErrorLevel.INFO ? null : ErrorLevel.INFO
                            }))}
                            active={filter.level === ErrorLevel.INFO}
                        />
                        <button
                            style={styles.clearButton}
                            onClick={clearErrors}
                        >
                            Clear All
                        </button>
                    </div>

                    {/* Category Filter */}
                    <div style={styles.categoryRow}>
                        <select
                            style={styles.categorySelect}
                            value={filter.category || ''}
                            onChange={(e) => setFilter(f => ({
                                ...f,
                                category: e.target.value || null
                            }))}
                        >
                            <option value="">All Categories</option>
                            {Object.values(ErrorCategory).map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Error List */}
                    <div style={styles.errorList}>
                        {filteredErrors.length === 0 ? (
                            <div style={styles.noErrors}>
                                ✨ No errors to display
                            </div>
                        ) : (
                            filteredErrors.slice().reverse().map(error => (
                                <ErrorItem key={error.id} error={error} />
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

function StatBadge({ label, count, color, onClick, active }) {
    return (
        <button
            style={{
                ...styles.statBadge,
                borderColor: active ? color : 'transparent',
                background: active ? `${color}22` : 'transparent',
            }}
            onClick={onClick}
        >
            <span style={{ ...styles.statDot, background: color }}></span>
            <span style={styles.statLabel}>{label}</span>
            <span style={styles.statCount}>{count}</span>
        </button>
    );
}

function ErrorItem({ error }) {
    const [expanded, setExpanded] = useState(false);

    const levelColors = {
        [ErrorLevel.DEBUG]: '#888',
        [ErrorLevel.INFO]: '#3498db',
        [ErrorLevel.WARN]: '#f39c12',
        [ErrorLevel.ERROR]: '#e74c3c',
        [ErrorLevel.CRITICAL]: '#9b59b6',
    };

    const color = levelColors[error.level] || '#888';
    const time = error.timestamp.toLocaleTimeString();

    return (
        <div
            style={{
                ...styles.errorItem,
                borderLeftColor: color,
            }}
            onClick={() => setExpanded(!expanded)}
        >
            <div style={styles.errorItemHeader}>
                <span style={{ ...styles.errorLevel, color }}>{error.level}</span>
                <span style={styles.errorCategory}>[{error.category}]</span>
                <span style={styles.errorTime}>{time}</span>
            </div>
            <div style={styles.errorMessage}>
                {error.message}
            </div>
            {expanded && error.details && Object.keys(error.details).length > 0 && (
                <pre style={styles.errorDetails}>
                    {JSON.stringify(error.details, null, 2)}
                </pre>
            )}
        </div>
    );
}

const styles = {
    container: {
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        width: '400px',
        maxHeight: '50vh',
        background: 'rgba(13, 13, 26, 0.95)',
        border: '1px solid #34495e',
        borderRadius: '8px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '12px',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        backdropFilter: 'blur(10px)',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 12px',
        borderBottom: '1px solid #34495e',
        background: 'rgba(52, 73, 94, 0.5)',
        borderRadius: '8px 8px 0 0',
    },
    headerLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    headerIcon: {
        fontSize: '16px',
    },
    headerTitle: {
        color: '#ecf0f1',
        fontWeight: '600',
    },
    headerCount: {
        color: '#7f8c8d',
        fontSize: '11px',
    },
    headerRight: {
        display: 'flex',
        gap: '4px',
    },
    headerButton: {
        background: 'transparent',
        border: 'none',
        color: '#95a5a6',
        cursor: 'pointer',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
    },
    statsRow: {
        display: 'flex',
        gap: '4px',
        padding: '8px',
        borderBottom: '1px solid #2c3e50',
        flexWrap: 'wrap',
    },
    statBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 8px',
        border: '1px solid transparent',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '11px',
        background: 'transparent',
        color: '#bdc3c7',
    },
    statDot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
    },
    statLabel: {
        color: '#95a5a6',
    },
    statCount: {
        fontWeight: '600',
        color: '#ecf0f1',
    },
    clearButton: {
        marginLeft: 'auto',
        padding: '4px 8px',
        background: '#c0392b',
        border: 'none',
        borderRadius: '4px',
        color: 'white',
        cursor: 'pointer',
        fontSize: '11px',
    },
    categoryRow: {
        padding: '8px',
        borderBottom: '1px solid #2c3e50',
    },
    categorySelect: {
        width: '100%',
        padding: '6px',
        background: '#1a1a2e',
        border: '1px solid #34495e',
        borderRadius: '4px',
        color: '#ecf0f1',
        fontSize: '11px',
    },
    errorList: {
        flex: 1,
        overflow: 'auto',
        maxHeight: '300px',
    },
    noErrors: {
        padding: '20px',
        textAlign: 'center',
        color: '#7f8c8d',
    },
    errorItem: {
        padding: '8px 12px',
        borderBottom: '1px solid #2c3e50',
        borderLeft: '3px solid',
        cursor: 'pointer',
        transition: 'background 0.15s',
    },
    errorItemHeader: {
        display: 'flex',
        gap: '8px',
        marginBottom: '4px',
    },
    errorLevel: {
        fontWeight: '600',
        textTransform: 'uppercase',
        fontSize: '10px',
    },
    errorCategory: {
        color: '#7f8c8d',
        fontSize: '10px',
    },
    errorTime: {
        marginLeft: 'auto',
        color: '#7f8c8d',
        fontSize: '10px',
    },
    errorMessage: {
        color: '#ecf0f1',
        wordBreak: 'break-word',
    },
    errorDetails: {
        marginTop: '8px',
        padding: '8px',
        background: '#0d0d1a',
        borderRadius: '4px',
        fontSize: '10px',
        color: '#bdc3c7',
        overflow: 'auto',
        maxHeight: '100px',
    },
    minimizedBadge: {
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 12px',
        background: 'rgba(13, 13, 26, 0.95)',
        border: '1px solid #34495e',
        borderRadius: '20px',
        cursor: 'pointer',
        zIndex: 10000,
    },
    badgeIcon: {
        fontSize: '16px',
    },
    badgeCount: {
        padding: '2px 6px',
        borderRadius: '10px',
        fontSize: '11px',
        fontWeight: '600',
        color: 'white',
    },
};

export default ErrorOverlay;
