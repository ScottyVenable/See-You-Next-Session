import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import styled from 'styled-components';
import {
    UsersThree,
    Users,
    Baby,
    House,
    Briefcase,
    Buildings,
    HeartBreak,
    Target,
    Heart,
    HandHeart,
    Handshake,
    Confetti,
    ShieldCheck,
    MaskHappy,
    SmileyNervous,
    CloudSun,
    Moon,
    FirstAid,
    User,
    PuzzlePiece,
    Barbell,
    Star,
    Sparkle,
    Lightning,
    ArrowUp,
    ArrowDown,
    Minus,
} from '@phosphor-icons/react';

// Topic configurations - softer, more cohesive color palette
// rapportImpact: 'empathetic' (+8), 'neutral' (0), 'probing' (-3), 'challenging' (-8)
const DIALOGUE_TOPICS = {
    family: {
        icon: UsersThree,
        label: 'Family',
        color: '#c084fc',
        shortcut: '1',
        options: [
            { id: 'parents', icon: Users, label: 'Parents', prompt: 'Tell me about your parents.', focusCost: 0, rapportImpact: 'neutral' },
            { id: 'siblings', icon: Baby, label: 'Siblings', prompt: 'Do you have any siblings?', focusCost: 0, rapportImpact: 'neutral' },
            { id: 'childhood', icon: Sparkle, label: 'Childhood', prompt: 'What was your childhood like?', focusCost: 1, rapportImpact: 'probing' },
            { id: 'home', icon: House, label: 'Home Life', prompt: 'How is your home environment?', focusCost: 0, rapportImpact: 'empathetic' },
        ]
    },
    work: {
        icon: Briefcase,
        label: 'Work',
        color: '#60a5fa',
        shortcut: '2',
        options: [
            { id: 'job', icon: Buildings, label: 'Current Job', prompt: 'Tell me about your job.', focusCost: 0, rapportImpact: 'neutral' },
            { id: 'stress', icon: HeartBreak, label: 'Work Stress', prompt: 'How stressful is your work?', focusCost: 1, rapportImpact: 'empathetic' },
            { id: 'colleagues', icon: Users, label: 'Colleagues', prompt: 'How do you get along with coworkers?', focusCost: 0, rapportImpact: 'neutral' },
            { id: 'goals', icon: Target, label: 'Career Goals', prompt: 'What are your career aspirations?', focusCost: 0, rapportImpact: 'empathetic' },
        ]
    },
    relationships: {
        icon: Heart,
        label: 'Relationships',
        color: '#f472b6',
        shortcut: '3',
        options: [
            { id: 'romantic', icon: HandHeart, label: 'Romantic', prompt: 'Tell me about your romantic life.', focusCost: 1, rapportImpact: 'probing' },
            { id: 'friends', icon: Handshake, label: 'Friends', prompt: 'How are your friendships?', focusCost: 0, rapportImpact: 'empathetic' },
            { id: 'social', icon: Confetti, label: 'Social Life', prompt: 'Do you enjoy socializing?', focusCost: 0, rapportImpact: 'neutral' },
            { id: 'trust', icon: ShieldCheck, label: 'Trust', prompt: 'Do you find it easy to trust others?', focusCost: 1, rapportImpact: 'challenging' },
        ]
    },
    emotions: {
        icon: MaskHappy,
        label: 'Emotions',
        color: '#fbbf24',
        shortcut: '4',
        options: [
            { id: 'anxiety', icon: SmileyNervous, label: 'Anxiety', prompt: 'Do you experience anxiety?', focusCost: 1, rapportImpact: 'probing' },
            { id: 'mood', icon: CloudSun, label: 'Mood', prompt: 'How has your mood been lately?', focusCost: 0, rapportImpact: 'empathetic' },
            { id: 'sleep', icon: Moon, label: 'Sleep', prompt: 'How have you been sleeping?', focusCost: 0, rapportImpact: 'neutral' },
            { id: 'coping', icon: FirstAid, label: 'Coping', prompt: 'How do you cope with stress?', focusCost: 1, rapportImpact: 'empathetic' },
        ]
    },
    selfImage: {
        icon: User,
        label: 'Self',
        color: '#34d399',
        shortcut: '5',
        options: [
            { id: 'identity', icon: PuzzlePiece, label: 'Identity', prompt: 'How would you describe yourself?', focusCost: 0, rapportImpact: 'neutral' },
            { id: 'confidence', icon: Barbell, label: 'Confidence', prompt: 'How confident do you feel?', focusCost: 1, rapportImpact: 'probing' },
            { id: 'values', icon: Star, label: 'Values', prompt: 'What matters most to you?', focusCost: 0, rapportImpact: 'empathetic' },
            { id: 'future', icon: Sparkle, label: 'Future', prompt: 'How do you see your future?', focusCost: 0, rapportImpact: 'empathetic' },
        ]
    }
};

// ============================================
// STYLED COMPONENTS - Cleaner Glassmorphism UI
// ============================================

const SelectorWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    background: linear-gradient(
        135deg,
        rgba(15, 23, 42, 0.9) 0%,
        rgba(30, 41, 59, 0.85) 100%
    );
    backdrop-filter: blur(12px);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 
        0 4px 24px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
`;

const SectionLabel = styled.div`
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: rgba(255, 255, 255, 0.4);
    margin-bottom: -4px;
`;

const TopicsRow = styled.div`
    display: flex;
    gap: 12px;
    justify-content: center;
`;

const TopicButtonWrapper = styled.div`
    position: relative;
    
    &:hover .tooltip {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }
`;

const Tooltip = styled.span`
    position: absolute;
    bottom: calc(100% + 10px);
    left: 50%;
    transform: translateX(-50%) translateY(4px);
    padding: 6px 12px;
    background: rgba(0, 0, 0, 0.9);
    color: white;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-radius: 6px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: all 0.2s ease;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 8px;
    
    &::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border: 5px solid transparent;
        border-top-color: rgba(0, 0, 0, 0.9);
    }
`;

const ShortcutKey = styled.span`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    font-size: 10px;
    font-weight: 700;
`;

const FocusCostBadge = styled.span`
    display: inline-flex;
    align-items: center;
    gap: 3px;
    padding: 2px 6px;
    background: ${props => props.$hasCost ? 'rgba(251, 191, 36, 0.2)' : 'rgba(52, 211, 153, 0.2)'};
    color: ${props => props.$hasCost ? '#fbbf24' : '#34d399'};
    border-radius: 4px;
    font-size: 9px;
    font-weight: 700;
    margin-left: auto;
`;

const RapportBadge = styled.span`
    display: inline-flex;
    align-items: center;
    gap: 2px;
    padding: 2px 5px;
    border-radius: 4px;
    font-size: 8px;
    font-weight: 700;
    background: ${props => {
        switch (props.$impact) {
            case 'empathetic': return 'rgba(52, 211, 153, 0.2)';
            case 'probing': return 'rgba(251, 191, 36, 0.2)';
            case 'challenging': return 'rgba(239, 68, 68, 0.2)';
            default: return 'rgba(148, 163, 184, 0.2)';
        }
    }};
    color: ${props => {
        switch (props.$impact) {
            case 'empathetic': return '#34d399';
            case 'probing': return '#fbbf24';
            case 'challenging': return '#ef4444';
            default: return '#94a3b8';
        }
    }};
`;

// Rapport impact values
const RAPPORT_VALUES = {
    empathetic: 8,
    neutral: 0,
    probing: -3,
    challenging: -8,
};

const getRapportIcon = (impact) => {
    switch (impact) {
        case 'empathetic': return ArrowUp;
        case 'probing': return ArrowDown;
        case 'challenging': return ArrowDown;
        default: return Minus;
    }
};

const TopicButton = styled.button`
    position: relative;
    border: none;
    background: transparent;
    padding: 0;
    outline: none;
    cursor: pointer;
    opacity: ${props => props.$disabled ? 0.3 : 1};
    pointer-events: ${props => props.$disabled ? 'none' : 'auto'};
    transition: opacity 0.2s ease;

    .shadow {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.4);
        border-radius: 14px;
        transform: translateY(3px);
        transition: transform 0.5s cubic-bezier(0.3, 0.7, 0.4, 1);
    }

    .edge {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 14px;
        background: linear-gradient(
            to bottom,
            ${props => props.$edgeLight} 0%,
            ${props => props.$edgeDark} 100%
        );
    }

    .front {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 52px;
        height: 52px;
        color: white;
        background: linear-gradient(
            145deg,
            ${props => props.$bgColor} 0%,
            ${props => props.$bgDark} 100%
        );
        border-radius: 14px;
        transform: translateY(-4px);
        transition: transform 0.5s cubic-bezier(0.3, 0.7, 0.4, 1);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }

    &:hover .shadow {
        transform: translateY(5px);
        transition: transform 0.2s cubic-bezier(0.3, 0.7, 0.4, 1.5);
    }

    &:hover .front {
        transform: translateY(-6px);
        transition: transform 0.2s cubic-bezier(0.3, 0.7, 0.4, 1.5);
    }

    &:active .shadow {
        transform: translateY(1px);
        transition: transform 0.05s;
    }

    &:active .front {
        transform: translateY(-2px);
        transition: transform 0.05s;
    }

    .front svg {
        user-select: none;
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
    }

    &.selected .front {
        box-shadow: 
            inset 0 1px 0 rgba(255, 255, 255, 0.2),
            0 0 0 2px rgba(255, 255, 255, 0.9),
            0 0 20px ${props => props.$bgColor}80;
    }
`;

const OptionsContainer = styled(motion.div)`
    width: 100%;
    overflow: hidden;
`;

const OptionsPanel = styled(motion.div)`
    display: flex;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;
    padding: 12px 8px;
    background: rgba(0, 0, 0, 0.25);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.05);
`;

const OptionButton = styled(motion.button)`
    position: relative;
    border: none;
    background: transparent;
    padding: 0;
    outline: none;
    cursor: pointer;
    opacity: ${props => props.$insufficientFocus ? 0.5 : 1};
    pointer-events: ${props => props.$insufficientFocus ? 'none' : 'auto'};

    .shadow {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.35);
        border-radius: 10px;
        transform: translateY(2px);
        transition: transform 0.4s cubic-bezier(0.3, 0.7, 0.4, 1);
    }

    .edge {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 10px;
        background: linear-gradient(
            to bottom,
            ${props => props.$edgeLight} 0%,
            ${props => props.$edgeDark} 100%
        );
    }

    .front {
        position: relative;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 16px;
        font-size: 13px;
        font-weight: 500;
        color: white;
        background: linear-gradient(
            145deg,
            ${props => props.$bgColor} 0%,
            ${props => props.$bgDark} 100%
        );
        border-radius: 10px;
        transform: translateY(-3px);
        transition: transform 0.4s cubic-bezier(0.3, 0.7, 0.4, 1);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15);
        white-space: nowrap;
    }

    &:hover .shadow {
        transform: translateY(4px);
        transition: transform 0.15s cubic-bezier(0.3, 0.7, 0.4, 1.5);
    }

    &:hover .front {
        transform: translateY(-5px);
        transition: transform 0.15s cubic-bezier(0.3, 0.7, 0.4, 1.5);
    }

    &:active .shadow {
        transform: translateY(1px);
        transition: transform 0.05s;
    }

    &:active .front {
        transform: translateY(-1px);
        transition: transform 0.05s;
    }

    .front span,
    .front svg {
        user-select: none;
    }
    
    .front svg {
        opacity: 0.9;
    }
`;

// ============================================
// HELPER FUNCTIONS
// ============================================

const getColorVariants = (baseColor) => {
    const hex = baseColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    return {
        bg: baseColor,
        bgDark: `rgb(${Math.max(0, r - 25)}, ${Math.max(0, g - 25)}, ${Math.max(0, b - 25)})`,
        edgeLight: `rgb(${Math.max(0, r - 40)}, ${Math.max(0, g - 40)}, ${Math.max(0, b - 40)})`,
        edgeDark: `rgb(${Math.max(0, r - 70)}, ${Math.max(0, g - 70)}, ${Math.max(0, b - 70)})`,
    };
};

// ============================================
// ANIMATION VARIANTS
// ============================================

const containerVariants = {
    hidden: {
        height: 0,
        opacity: 0,
    },
    visible: {
        height: 'auto',
        opacity: 1,
        transition: {
            height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
            opacity: { duration: 0.2, delay: 0.1 },
            staggerChildren: 0.04,
            delayChildren: 0.1,
        }
    },
    exit: {
        height: 0,
        opacity: 0,
        transition: {
            height: { duration: 0.2, ease: [0.4, 0, 1, 1] },
            opacity: { duration: 0.1 },
        }
    }
};

const optionVariants = {
    hidden: {
        opacity: 0,
        scale: 0.8,
        y: -8,
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: 'spring',
            stiffness: 400,
            damping: 25,
        }
    },
    exit: {
        opacity: 0,
        scale: 0.9,
        transition: { duration: 0.1 }
    }
};

// ============================================
// MAIN COMPONENT
// ============================================

function DialogueSelector({ onSelectPrompt, disabledTopics = [], currentFocus = 100 }) {
    const [selectedTopic, setSelectedTopic] = useState(null);

    const handleTopicClick = useCallback((topicKey) => {
        setSelectedTopic(prev => prev === topicKey ? null : topicKey);
    }, []);

    const handleOptionClick = useCallback((topicKey, option) => {
        if (option.focusCost > currentFocus) return;

        if (onSelectPrompt) {
            onSelectPrompt({
                topic: topicKey,
                option: option.id,
                prompt: option.prompt,
                label: option.label,
                focusCost: option.focusCost,
                rapportImpact: option.rapportImpact,
                rapportValue: RAPPORT_VALUES[option.rapportImpact] || 0,
            });
        }
        setSelectedTopic(null);
    }, [onSelectPrompt, currentFocus]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ignore if typing in an input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            const key = e.key;
            const topics = Object.entries(DIALOGUE_TOPICS);

            // Number keys 1-5 to select topics
            const topicIndex = parseInt(key) - 1;
            if (topicIndex >= 0 && topicIndex < topics.length) {
                const [topicKey, topic] = topics[topicIndex];
                if (!disabledTopics.includes(topicKey)) {
                    handleTopicClick(topicKey);
                }
                return;
            }

            // Escape to close
            if (key === 'Escape' && selectedTopic) {
                setSelectedTopic(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedTopic, disabledTopics, handleTopicClick]);

    const topics = useMemo(() => Object.entries(DIALOGUE_TOPICS), []);

    const selectedTopicData = selectedTopic ? DIALOGUE_TOPICS[selectedTopic] : null;
    const selectedColors = selectedTopicData ? getColorVariants(selectedTopicData.color) : null;

    return (
        <SelectorWrapper>
            <SectionLabel>Choose a Topic</SectionLabel>
            <TopicsRow>
                {topics.map(([key, topic]) => {
                    const isDisabled = disabledTopics.includes(key);
                    const isSelected = selectedTopic === key;
                    const colors = getColorVariants(topic.color);
                    const Icon = topic.icon;

                    return (
                        <TopicButtonWrapper key={key}>
                            <Tooltip className="tooltip">
                                {topic.label}
                                <ShortcutKey>{topic.shortcut}</ShortcutKey>
                            </Tooltip>
                            <TopicButton
                                onClick={() => handleTopicClick(key)}
                                $bgColor={colors.bg}
                                $bgDark={colors.bgDark}
                                $edgeLight={colors.edgeLight}
                                $edgeDark={colors.edgeDark}
                                $disabled={isDisabled}
                                className={isSelected ? 'selected' : ''}
                            >
                                <span className="shadow" />
                                <span className="edge" />
                                <div className="front">
                                    <Icon size={24} weight="duotone" />
                                </div>
                            </TopicButton>
                        </TopicButtonWrapper>
                    );
                })}
            </TopicsRow>

            <AnimatePresence mode="wait">
                {selectedTopic && selectedTopicData && (
                    <OptionsContainer
                        key={selectedTopic}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <OptionsPanel>
                            {selectedTopicData.options.map((option) => {
                                const Icon = option.icon;
                                const insufficientFocus = option.focusCost > currentFocus;
                                const RapportIcon = getRapportIcon(option.rapportImpact);

                                return (
                                    <OptionButton
                                        key={option.id}
                                        variants={optionVariants}
                                        onClick={() => handleOptionClick(selectedTopic, option)}
                                        $bgColor={selectedColors.bg}
                                        $bgDark={selectedColors.bgDark}
                                        $edgeLight={selectedColors.edgeLight}
                                        $edgeDark={selectedColors.edgeDark}
                                        $insufficientFocus={insufficientFocus}
                                        whileTap={{ scale: 0.98 }}
                                        title={insufficientFocus ? `Requires ${option.focusCost} focus` : ''}
                                    >
                                        <span className="shadow" />
                                        <span className="edge" />
                                        <div className="front">
                                            <Icon size={16} weight="duotone" />
                                            <span>{option.label}</span>
                                            {option.rapportImpact !== 'neutral' && (
                                                <RapportBadge $impact={option.rapportImpact}>
                                                    <RapportIcon size={8} weight="bold" />
                                                </RapportBadge>
                                            )}
                                            {option.focusCost > 0 && (
                                                <FocusCostBadge $hasCost={true}>
                                                    <Lightning size={10} weight="fill" />
                                                    {option.focusCost}
                                                </FocusCostBadge>
                                            )}
                                        </div>
                                    </OptionButton>
                                );
                            })}
                        </OptionsPanel>
                    </OptionsContainer>
                )}
            </AnimatePresence>
        </SelectorWrapper>
    );
}

export default DialogueSelector;
