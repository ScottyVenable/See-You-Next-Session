import React from 'react';
import styled from 'styled-components';
import { motion } from 'motion/react';

/**
 * MenuButton - A 3D-style button with depth effect
 * Adapted from uiverse.io with game-appropriate theming
 * 
 * Variants:
 * - primary: Main action button (teal/success colored)
 * - secondary: Secondary actions (default, darker)
 * - accent: Highlighted actions (warning/gold colored)
 * - danger: Destructive actions (accent/red colored)
 */

const MenuButton = ({
    children,
    onClick,
    disabled = false,
    variant = 'secondary',
    icon,
    fullWidth = false,
    ...motionProps
}) => {
    return (
        <StyledWrapper $variant={variant} $fullWidth={fullWidth} $disabled={disabled}>
            <motion.button
                className="menu-button"
                onClick={disabled ? undefined : onClick}
                disabled={disabled}
                whileHover={disabled ? {} : { y: 4 }}
                whileTap={disabled ? {} : { y: 12 }}
                {...motionProps}
            >
                {icon && <span className="btn-icon">{icon}</span>}
                <span className="btn-text">{children}</span>
            </motion.button>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
    width: ${props => props.$fullWidth ? '100%' : 'auto'};
    
    .menu-button {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5em;
        cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
        outline: none;
        border: 0;
        vertical-align: middle;
        text-decoration: none;
        font-family: var(--font-body, 'JMH Typewriter', monospace);
        font-size: 1rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        padding: 1em 2em;
        width: ${props => props.$fullWidth ? '100%' : 'auto'};
        opacity: ${props => props.$disabled ? 0.5 : 1};
        
        /* Variant-based colors */
        ${props => {
        const variants = {
            primary: {
                bg: 'var(--color-bg-tertiary, #0f3460)',
                bgHover: 'var(--color-bg-secondary, #16213e)',
                border: 'var(--color-success, #4ecdc4)',
                shadow: 'rgba(78, 205, 196, 0.3)',
                shadowColor: 'var(--color-success, #4ecdc4)',
                text: 'var(--color-text, #eaeaea)',
            },
            secondary: {
                bg: 'var(--color-bg-secondary, #16213e)',
                bgHover: 'var(--color-bg-tertiary, #0f3460)',
                border: 'rgba(255, 255, 255, 0.2)',
                shadow: 'rgba(0, 0, 0, 0.4)',
                shadowColor: 'rgba(255, 255, 255, 0.1)',
                text: 'var(--color-text-muted, #a0a0a0)',
            },
            accent: {
                bg: 'rgba(255, 230, 109, 0.15)',
                bgHover: 'rgba(255, 230, 109, 0.25)',
                border: 'var(--color-warning, #ffe66d)',
                shadow: 'rgba(255, 230, 109, 0.3)',
                shadowColor: 'var(--color-warning, #ffe66d)',
                text: 'var(--color-warning, #ffe66d)',
            },
            danger: {
                bg: 'rgba(233, 69, 96, 0.15)',
                bgHover: 'rgba(233, 69, 96, 0.25)',
                border: 'var(--color-accent, #e94560)',
                shadow: 'rgba(233, 69, 96, 0.3)',
                shadowColor: 'var(--color-accent, #e94560)',
                text: 'var(--color-accent, #e94560)',
            }
        };
        const v = variants[props.$variant] || variants.secondary;
        return `
                color: ${v.text};
                background: ${v.bg};
                border: 2px solid ${v.border};
                border-radius: 0.75em;
                transform-style: preserve-3d;
                transition: background 150ms cubic-bezier(0, 0, 0.58, 1);
                
                &::before {
                    position: absolute;
                    content: '';
                    width: 100%;
                    height: 100%;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: ${v.bg};
                    border-radius: inherit;
                    box-shadow: 0 0 0 2px ${v.border}, 0 0.625em 0 0 ${v.shadow};
                    transform: translate3d(0, 0.75em, -1em);
                    transition: transform 150ms cubic-bezier(0, 0, 0.58, 1), 
                                box-shadow 150ms cubic-bezier(0, 0, 0.58, 1);
                }
                
                &:hover:not(:disabled) {
                    background: ${v.bgHover};
                }
                
                &:hover:not(:disabled)::before {
                    box-shadow: 0 0 0 2px ${v.border}, 0 0.5em 0 0 ${v.shadow};
                    transform: translate3d(0, 0.5em, -1em);
                }
                
                &:active:not(:disabled) {
                    background: ${v.bgHover};
                }
                
                &:active:not(:disabled)::before {
                    box-shadow: 0 0 0 2px ${v.border}, 0 0 ${v.shadow};
                    transform: translate3d(0, 0, -1em);
                }
            `;
    }}
    }
    
    .btn-icon {
        font-size: 1.1em;
        display: flex;
        align-items: center;
    }
    
    .btn-text {
        position: relative;
        z-index: 1;
    }
`;

export default MenuButton;
