import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import '../../styles/dialogue-radial.css';

// Topic configurations with icons and sub-options
const DIALOGUE_TOPICS = {
    family: {
        icon: '👨‍👩‍👧',
        label: 'Family',
        color: '#e056fd',
        options: [
            { id: 'parents', icon: '👫', label: 'Parents', prompt: 'Tell me about your parents.' },
            { id: 'siblings', icon: '👧', label: 'Siblings', prompt: 'Do you have any siblings?' },
            { id: 'childhood', icon: '💒', label: 'Childhood', prompt: 'What was your childhood like?' },
            { id: 'home', icon: '🏠', label: 'Home Life', prompt: 'How is your home environment?' },
        ]
    },
    work: {
        icon: '💼',
        label: 'Work',
        color: '#4a9eff',
        options: [
            { id: 'job', icon: '🏢', label: 'Current Job', prompt: 'Tell me about your job.' },
            { id: 'stress', icon: '😰', label: 'Work Stress', prompt: 'How stressful is your work?' },
            { id: 'colleagues', icon: '👥', label: 'Colleagues', prompt: 'How do you get along with coworkers?' },
            { id: 'goals', icon: '🎯', label: 'Career Goals', prompt: 'What are your career aspirations?' },
        ]
    },
    relationships: {
        icon: '💕',
        label: 'Relationships',
        color: '#ff6b6b',
        options: [
            { id: 'romantic', icon: '💑', label: 'Romantic', prompt: 'Tell me about your romantic life.' },
            { id: 'friends', icon: '🤝', label: 'Friends', prompt: 'How are your friendships?' },
            { id: 'social', icon: '🎉', label: 'Social Life', prompt: 'Do you enjoy socializing?' },
            { id: 'trust', icon: '🤲', label: 'Trust', prompt: 'Do you find it easy to trust others?' },
        ]
    },
    emotions: {
        icon: '🎭',
        label: 'Emotions',
        color: '#f1c40f',
        options: [
            { id: 'anxiety', icon: '😟', label: 'Anxiety', prompt: 'Do you experience anxiety?' },
            { id: 'mood', icon: '🌤️', label: 'Mood', prompt: 'How has your mood been lately?' },
            { id: 'sleep', icon: '😴', label: 'Sleep', prompt: 'How have you been sleeping?' },
            { id: 'coping', icon: '🛡️', label: 'Coping', prompt: 'How do you cope with stress?' },
        ]
    },
    selfImage: {
        icon: '🪞',
        label: 'Self',
        color: '#00b894',
        options: [
            { id: 'identity', icon: '🧩', label: 'Identity', prompt: 'How would you describe yourself?' },
            { id: 'confidence', icon: '💪', label: 'Confidence', prompt: 'How confident do you feel?' },
            { id: 'values', icon: '⭐', label: 'Values', prompt: 'What matters most to you?' },
            { id: 'future', icon: '🔮', label: 'Future', prompt: 'How do you see your future?' },
        ]
    }
};

// Calculate radial positions for sub-options
const getRadialPosition = (index, total, radius = 70) => {
    // Start from top (-90 degrees) and spread evenly
    const startAngle = -90;
    const spreadAngle = 180; // Half circle spread
    const angleStep = spreadAngle / (total - 1 || 1);
    const angle = startAngle + (index * angleStep);
    const rad = (angle * Math.PI) / 180;

    return {
        x: Math.cos(rad) * radius,
        y: Math.sin(rad) * radius
    };
};

// Single Topic Button with radial sub-menu
function TopicButton({ topic, topicKey, onSelectOption, isActive, onActivate, position }) {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
        onActivate(topicKey);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleOptionClick = (option) => {
        onSelectOption(topicKey, option);
        setIsHovered(false);
    };

    return (
        <div
            className={`topic-button-container ${isActive ? 'active' : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ '--topic-color': topic.color }}
        >
            <motion.button
                className="topic-button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                style={{
                    background: isHovered
                        ? `linear-gradient(135deg, ${topic.color}, ${topic.color}dd)`
                        : 'var(--color-bg-tertiary)'
                }}
            >
                <span className="topic-icon">{topic.icon}</span>
                <span className="topic-label">{topic.label}</span>
            </motion.button>

            {/* Radial Sub-options */}
            <AnimatePresence>
                {isHovered && (
                    <div className="radial-options">
                        {topic.options.map((option, index) => {
                            const pos = getRadialPosition(index, topic.options.length, 80);
                            return (
                                <motion.button
                                    key={option.id}
                                    className="radial-option"
                                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                        x: pos.x,
                                        y: pos.y
                                    }}
                                    exit={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 400,
                                        damping: 20,
                                        delay: index * 0.05
                                    }}
                                    onClick={() => handleOptionClick(option)}
                                    whileHover={{ scale: 1.15 }}
                                    whileTap={{ scale: 0.9 }}
                                    style={{ '--option-color': topic.color }}
                                >
                                    <span className="option-icon">{option.icon}</span>
                                    <motion.span
                                        className="option-tooltip"
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 + index * 0.05 }}
                                    >
                                        {option.label}
                                    </motion.span>
                                </motion.button>
                            );
                        })}

                        {/* Connection lines (decorative) */}
                        <svg className="radial-connections" viewBox="-100 -100 200 200">
                            {topic.options.map((option, index) => {
                                const pos = getRadialPosition(index, topic.options.length, 80);
                                return (
                                    <motion.line
                                        key={option.id}
                                        x1="0"
                                        y1="0"
                                        x2={pos.x}
                                        y2={pos.y}
                                        stroke={topic.color}
                                        strokeWidth="1"
                                        strokeOpacity="0.3"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        exit={{ pathLength: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.03 }}
                                    />
                                );
                            })}
                        </svg>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Main Dialogue Radial Component
function DialogueRadial({ onSelectPrompt, disabled = false, availableTopics = null }) {
    const [activeTopic, setActiveTopic] = useState(null);

    // Filter topics if specific ones are provided
    const topics = availableTopics
        ? Object.fromEntries(
            Object.entries(DIALOGUE_TOPICS).filter(([key]) => availableTopics.includes(key))
        )
        : DIALOGUE_TOPICS;

    const handleSelectOption = (topicKey, option) => {
        if (onSelectPrompt) {
            onSelectPrompt({
                topic: topicKey,
                option: option.id,
                label: option.label,
                prompt: option.prompt,
                icon: option.icon
            });
        }
    };

    if (disabled) {
        return (
            <div className="dialogue-radial disabled">
                <div className="radial-disabled-message">
                    <span className="disabled-icon">🔇</span>
                    <span>Waiting for response...</span>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            className="dialogue-radial"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="radial-header">
                <span className="header-icon">💬</span>
                <span className="header-text">Choose a topic to discuss</span>
            </div>

            <div className="topics-container">
                {Object.entries(topics).map(([key, topic], index) => (
                    <TopicButton
                        key={key}
                        topicKey={key}
                        topic={topic}
                        isActive={activeTopic === key}
                        onActivate={setActiveTopic}
                        onSelectOption={handleSelectOption}
                        position={index}
                    />
                ))}
            </div>

            <div className="radial-hint">
                <span className="hint-icon">💡</span>
                <span>Hover over a topic to see questions</span>
            </div>
        </motion.div>
    );
}

export default DialogueRadial;
export { DIALOGUE_TOPICS };
