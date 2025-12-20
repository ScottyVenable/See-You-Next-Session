import React, { Component } from 'react';
import { errorHandler, ErrorLevel, ErrorCategory } from '../../utils/ErrorHandler.js';

/**
 * ErrorBoundary - React Error Boundary with visual error display
 * Catches React rendering errors and displays dev-friendly information
 */
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            showDetails: false,
            copied: false,
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });

        // Log to our error handler
        errorHandler.log(
            error.message,
            ErrorLevel.CRITICAL,
            this.props.category || ErrorCategory.UI,
            {
                componentStack: errorInfo.componentStack,
                stack: error.stack,
                boundary: this.props.name || 'Unknown',
            }
        );
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    toggleDetails = () => {
        this.setState(prev => ({ showDetails: !prev.showDetails }));
    };

    copyErrors = async () => {
        const { error, errorInfo } = this.state;
        const boundaryName = this.props.name || 'Unknown';

        // Format error information for clipboard
        const errorText = [
            '=== ERROR REPORT ===',
            `Timestamp: ${new Date().toISOString()}`,
            `Component: ${boundaryName}`,
            '',
            '--- Error Message ---',
            error?.message || 'No message available',
            '',
            '--- Stack Trace ---',
            error?.stack || 'No stack trace available',
            '',
            '--- Component Stack ---',
            errorInfo?.componentStack || 'No component stack available',
            '',
            '===================',
        ].join('\n');

        try {
            await navigator.clipboard.writeText(errorText);
            // Brief visual feedback
            this.setState({ copied: true });
            setTimeout(() => this.setState({ copied: false }), 2000);
        } catch (err) {
            console.error('Failed to copy errors:', err);
        }
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback if provided
            if (this.props.fallback) {
                return this.props.fallback({
                    error: this.state.error,
                    errorInfo: this.state.errorInfo,
                    retry: this.handleRetry,
                });
            }

            // Default error UI
            return (
                <div style={styles.container}>
                    <div style={styles.card}>
                        <div style={styles.header}>
                            <span style={styles.icon}>⚠️</span>
                            <h2 style={styles.title}>Something went wrong</h2>
                        </div>

                        <p style={styles.message}>
                            {this.state.error?.message || 'An unexpected error occurred'}
                        </p>

                        {this.props.name && (
                            <p style={styles.boundary}>
                                Component: <code style={styles.code}>{this.props.name}</code>
                            </p>
                        )}

                        <div style={styles.buttons}>
                            <button
                                style={styles.retryButton}
                                onClick={this.handleRetry}
                            >
                                Try Again
                            </button>
                            <button
                                style={styles.copyButton}
                                onClick={this.copyErrors}
                            >
                                {this.state.copied ? 'Copied!' : 'Copy Errors'}
                            </button>
                            <button
                                style={styles.detailsButton}
                                onClick={this.toggleDetails}
                            >
                                {this.state.showDetails ? 'Hide Details' : 'Show Details'}
                            </button>
                        </div>

                        {this.state.showDetails && (
                            <div style={styles.details}>
                                <h3 style={styles.detailsTitle}>Stack Trace</h3>
                                <pre style={styles.stack}>
                                    {this.state.error?.stack}
                                </pre>

                                {this.state.errorInfo?.componentStack && (
                                    <>
                                        <h3 style={styles.detailsTitle}>Component Stack</h3>
                                        <pre style={styles.stack}>
                                            {this.state.errorInfo.componentStack}
                                        </pre>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        padding: '20px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    card: {
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        border: '1px solid #e74c3c',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '600px',
        width: '100%',
        boxShadow: '0 4px 20px rgba(231, 76, 60, 0.3)',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px',
    },
    icon: {
        fontSize: '32px',
    },
    title: {
        margin: 0,
        color: '#e74c3c',
        fontSize: '1.5rem',
    },
    message: {
        color: '#ecf0f1',
        fontSize: '1rem',
        marginBottom: '12px',
        lineHeight: '1.5',
    },
    boundary: {
        color: '#95a5a6',
        fontSize: '0.875rem',
        marginBottom: '16px',
    },
    code: {
        background: '#2c3e50',
        padding: '2px 6px',
        borderRadius: '4px',
        fontFamily: 'monospace',
        color: '#3498db',
    },
    buttons: {
        display: 'flex',
        gap: '12px',
        marginBottom: '16px',
    },
    retryButton: {
        background: '#27ae60',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: '500',
        transition: 'background 0.2s',
    },
    copyButton: {
        background: '#3498db',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: '500',
        transition: 'background 0.2s',
    },
    detailsButton: {
        background: 'transparent',
        color: '#95a5a6',
        border: '1px solid #34495e',
        padding: '10px 20px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.9rem',
    },
    details: {
        marginTop: '16px',
        borderTop: '1px solid #34495e',
        paddingTop: '16px',
    },
    detailsTitle: {
        color: '#f39c12',
        fontSize: '0.875rem',
        marginBottom: '8px',
        marginTop: '12px',
    },
    stack: {
        background: '#0d0d1a',
        padding: '12px',
        borderRadius: '6px',
        overflow: 'auto',
        maxHeight: '200px',
        fontSize: '0.75rem',
        color: '#bdc3c7',
        fontFamily: 'monospace',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
    },
};

export default ErrorBoundary;
