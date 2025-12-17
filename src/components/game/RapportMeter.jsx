import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import styled from 'styled-components';
import { Heart, HeartBreak, Handshake, ShieldWarning, UserCircle } from '@phosphor-icons/react';

// Rapport levels with thresholds and effects
const RAPPORT_LEVELS = {
    GUARDED: { min: 0, max: 24, label: 'Guarded', color: '#ef4444', icon: ShieldWarning },
    CAUTIOUS: { min: 25, max: 49, label: 'Cautious', color: '#f97316', icon: UserCircle },
    NEUTRAL: { min: 50, max: 74, label: 'Neutral', color: '#eab308', icon: Handshake },
    COMFORTABLE: { min: 75, max: 89, label: 'Comfortable', color: '#22c55e', icon: Heart },
    TRUSTING: { min: 90, max: 100, label: 'Trusting', color: '#3b82f6', icon: Heart },
};

// Get current rapport level based on value
const getRapportLevel = (value) => {
    for (const [key, level] of Object.entries(RAPPORT_LEVELS)) {
        if (value >= level.min && value <= level.max) {
            return { key, ...level };
        }
    }
    return { key: 'NEUTRAL', ...RAPPORT_LEVELS.NEUTRAL };
};

// Styled Components
const MeterContainer = styled(motion.div)`
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px 16px;
    background: rgba(15, 23, 42, 0.9);
    border-radius: 12px;
    border: 1px solid rgba(148, 163, 184, 0.2);
    min-width: 180px;
    backdrop-filter: blur(8px);
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
`;

const Title = styled.span`
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(148, 163, 184, 0.8);
    font-weight: 600;
`;

const LevelBadge = styled(motion.div)`
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.7rem;
    font-weight: 600;
    background: ${props => props.$color}22;
    color: ${props => props.$color};
    border: 1px solid ${props => props.$color}44;
`;

const BarContainer = styled.div`
    position: relative;
    height: 8px;
    background: rgba(30, 41, 59, 0.8);
    border-radius: 4px;
    overflow: hidden;
`;

const BarFill = styled(motion.div)`
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    border-radius: 4px;
    background: ${props => props.$color};
    box-shadow: 0 0 12px ${props => props.$color}66;
`;

const BarSegments = styled.div`
    position: absolute;
    inset: 0;
    display: flex;
    pointer-events: none;
`;

const Segment = styled.div`
    flex: 1;
    border-right: 1px solid rgba(15, 23, 42, 0.5);
    &:last-child {
        border-right: none;
    }
`;

const ChangeIndicator = styled(motion.div)`
    position: absolute;
    right: -8px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.75rem;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 4px;
    background: ${props => props.$positive ? '#22c55e' : '#ef4444'};
    color: white;
    white-space: nowrap;
`;

const EffectsList = styled(motion.div)`
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 4px;
    padding-top: 8px;
    border-top: 1px solid rgba(148, 163, 184, 0.1);
`;

const Effect = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.65rem;
    color: ${props => props.$active ? props.$color : 'rgba(148, 163, 184, 0.4)'};
    
    svg {
        width: 12px;
        height: 12px;
    }
`;

// Effects that unlock at different rapport levels
const RAPPORT_EFFECTS = [
    { threshold: 25, label: 'Patient shares surface details', icon: '[1]' },
    { threshold: 50, label: 'Patient is more forthcoming', icon: '[2]' },
    { threshold: 75, label: 'Patient reveals hidden concerns', icon: '[3]' },
    { threshold: 90, label: 'Full trust - breakthrough possible', icon: '[4]' },
];

function RapportMeter({
    value = 50,
    maxValue = 100,
    showEffects = false,
    onChange,
    compact = false
}) {
    const [displayValue, setDisplayValue] = useState(value);
    const [recentChange, setRecentChange] = useState(null);
    const [prevValue, setPrevValue] = useState(value);

    const level = getRapportLevel(displayValue);
    const IconComponent = level.icon;
    const percentage = (displayValue / maxValue) * 100;

    // Animate value changes
    useEffect(() => {
        if (value !== prevValue) {
            const change = value - prevValue;
            setRecentChange(change);
            setPrevValue(value);

            // Clear change indicator after animation
            const timer = setTimeout(() => setRecentChange(null), 2000);
            return () => clearTimeout(timer);
        }
    }, [value, prevValue]);

    // Smooth value transition
    useEffect(() => {
        setDisplayValue(value);
    }, [value]);

    if (compact) {
        return (
            <MeterContainer
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ minWidth: '120px', padding: '8px 12px' }}
            >
                <Header>
                    <Title>Rapport</Title>
                    <LevelBadge $color={level.color}>
                        <IconComponent weight="fill" size={12} />
                        {displayValue}%
                    </LevelBadge>
                </Header>
                <BarContainer>
                    <BarFill
                        $color={level.color}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                    />
                </BarContainer>
            </MeterContainer>
        );
    }

    return (
        <MeterContainer
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
            <Header>
                <Title>Patient Rapport</Title>
                <LevelBadge
                    $color={level.color}
                    key={level.key}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    <IconComponent weight="fill" size={12} />
                    {level.label}
                </LevelBadge>
            </Header>

            <div style={{ position: 'relative' }}>
                <BarContainer>
                    <BarFill
                        $color={level.color}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                    />
                    <BarSegments>
                        {[...Array(4)].map((_, i) => (
                            <Segment key={i} />
                        ))}
                    </BarSegments>
                </BarContainer>

                <AnimatePresence>
                    {recentChange !== null && recentChange !== 0 && (
                        <ChangeIndicator
                            $positive={recentChange > 0}
                            initial={{ opacity: 0, x: 10, y: '-50%' }}
                            animate={{ opacity: 1, x: 0, y: '-50%' }}
                            exit={{ opacity: 0, x: -10, y: '-50%' }}
                            transition={{ duration: 0.3 }}
                        >
                            {recentChange > 0 ? '+' : ''}{recentChange}
                        </ChangeIndicator>
                    )}
                </AnimatePresence>
            </div>

            {showEffects && (
                <EffectsList
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ delay: 0.2 }}
                >
                    {RAPPORT_EFFECTS.map((effect, index) => (
                        <Effect
                            key={index}
                            $active={displayValue >= effect.threshold}
                            $color={level.color}
                        >
                            <span>{effect.icon}</span>
                            <span>{effect.label}</span>
                        </Effect>
                    ))}
                </EffectsList>
            )}
        </MeterContainer>
    );
}

// Export utilities for other components
export { RAPPORT_LEVELS, getRapportLevel, RAPPORT_EFFECTS };
export default RapportMeter;
