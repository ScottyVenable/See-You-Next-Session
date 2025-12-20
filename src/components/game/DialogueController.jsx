/**
 * DialogueController - Manages dialogue flow using SDNS dialogue system
 * Bridges the dialogue engine with the UI components
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import styled from 'styled-components';
import { useDialogue } from '../../sdns/index.js';

// Styled components for dialogue display
const DialogueContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const SpeechBubble = styled(motion.div)`
    background: ${props => props.$isAction
        ? 'rgba(148, 163, 184, 0.1)'
        : 'rgba(30, 41, 59, 0.9)'};
    border: 1px solid rgba(148, 163, 184, 0.2);
    border-radius: 12px;
    padding: 16px 20px;
    max-width: 100%;
    font-style: ${props => props.$isAction ? 'italic' : 'normal'};
    color: ${props => props.$isAction ? 'rgba(148, 163, 184, 0.8)' : 'white'};
`;

const SpeakerName = styled.div`
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: ${props => {
        switch (props.$speaker) {
            case 'PATIENT': return '#60a5fa';
            case 'THERAPIST': return '#34d399';
            case 'NARRATOR': return '#94a3b8';
            default: return '#94a3b8';
        }
    }};
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const MoodIndicator = styled.span`
    font-size: 0.65rem;
    padding: 2px 8px;
    background: rgba(148, 163, 184, 0.15);
    border-radius: 10px;
    text-transform: capitalize;
    font-weight: 500;
`;

const SpeechText = styled.p`
    margin: 0;
    line-height: 1.6;
    font-size: 1rem;
`;

const Keyword = styled.span`
    background: linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(251, 191, 36, 0.1) 100%);
    color: #fbbf24;
    padding: 2px 6px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        background: rgba(251, 191, 36, 0.3);
        transform: scale(1.02);
    }
`;

const ContinueIndicator = styled(motion.div)`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px;
    font-size: 0.75rem;
    color: rgba(148, 163, 184, 0.6);
    cursor: pointer;
    
    &:hover {
        color: rgba(148, 163, 184, 0.9);
    }
`;

const DialogueHistory = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 300px;
    overflow-y: auto;
    padding-right: 8px;
    
    &::-webkit-scrollbar {
        width: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
        background: rgba(148, 163, 184, 0.3);
        border-radius: 2px;
    }
`;

const HistoryItem = styled.div`
    opacity: 0.6;
    font-size: 0.85rem;
    padding: 8px 12px;
    background: rgba(15, 23, 42, 0.5);
    border-radius: 8px;
    
    .speaker {
        font-weight: 600;
        font-size: 0.7rem;
        text-transform: uppercase;
        margin-bottom: 4px;
        color: rgba(148, 163, 184, 0.7);
    }
`;

/**
 * Renders text with clickable keywords
 */
function RenderTextWithKeywords({ text, keywords, onKeywordClick }) {
    if (!keywords || keywords.length === 0) {
        return <span>{text}</span>;
    }

    // Create a regex to find all keywords
    const parts = [];
    let lastIndex = 0;

    keywords.forEach(keyword => {
        const index = text.indexOf(keyword.text, lastIndex);
        if (index !== -1) {
            // Add text before keyword
            if (index > lastIndex) {
                parts.push({ type: 'text', content: text.slice(lastIndex, index) });
            }
            // Add keyword
            parts.push({ type: 'keyword', content: keyword.text, data: keyword });
            lastIndex = index + keyword.text.length;
        }
    });

    // Add remaining text
    if (lastIndex < text.length) {
        parts.push({ type: 'text', content: text.slice(lastIndex) });
    }

    return (
        <>
            {parts.map((part, i) =>
                part.type === 'keyword' ? (
                    <Keyword
                        key={i}
                        onClick={() => onKeywordClick?.(part.data)}
                        title="Click to collect this keyword"
                    >
                        {part.content}
                    </Keyword>
                ) : (
                    <span key={i}>{part.content}</span>
                )
            )}
        </>
    );
}

/**
 * DialogueController Component
 * Manages and displays dialogue from .syns files
 */
function DialogueController({
    gameState,
    actions,
    dialogueSource,
    patientName = 'Patient',
    onKeywordCollected,
    onDialogueEnd,
    showHistory = true,
}) {
    const dialogue = useDialogue(gameState, actions);
    const [isTyping, setIsTyping] = useState(false);

    // Load dialogue when source changes
    useEffect(() => {
        if (dialogueSource) {
            dialogue.loadDialogue(dialogueSource);
            dialogue.startBlock('START');
        }
    }, [dialogueSource]);

    // Handle keyword click
    const handleKeywordClick = useCallback((keyword) => {
        if (onKeywordCollected) {
            onKeywordCollected({
                id: keyword.id,
                type: 'text',
                content: keyword.text,
                contradicts: keyword.contradicts,
                reveals: keyword.reveals,
            });
        }
    }, [onKeywordCollected]);

    // Handle continue/advance
    const handleContinue = useCallback(() => {
        if (dialogue.isPaused) {
            dialogue.skipPause();
        }

        const result = dialogue.advance();

        if (!result && !dialogue.speechQueue.length) {
            if (onDialogueEnd) {
                onDialogueEnd();
            }
        }
    }, [dialogue, onDialogueEnd]);

    // Handle player response
    const handlePlayerResponse = useCallback((topic, subtopic) => {
        dialogue.handleResponse(topic, subtopic);
    }, [dialogue]);

    const { currentSpeech, dialogueHistory, isPlaying, isPaused } = dialogue;

    return (
        <DialogueContainer>
            {/* History of previous dialogue */}
            {showHistory && dialogueHistory.length > 1 && (
                <DialogueHistory>
                    {dialogueHistory.slice(0, -1).map((speech, index) => (
                        <HistoryItem key={index}>
                            <div className="speaker">
                                {speech.speaker === 'PATIENT' ? patientName : speech.speaker}
                            </div>
                            <div>{speech.text}</div>
                        </HistoryItem>
                    ))}
                </DialogueHistory>
            )}

            {/* Current speech */}
            <AnimatePresence mode="wait">
                {currentSpeech && (
                    <SpeechBubble
                        key={dialogueHistory.length}
                        $isAction={currentSpeech.isAction}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <SpeakerName $speaker={currentSpeech.speaker}>
                            {currentSpeech.speaker === 'PATIENT' ? patientName : currentSpeech.speaker}
                            {currentSpeech.mood && (
                                <MoodIndicator>{currentSpeech.mood}</MoodIndicator>
                            )}
                        </SpeakerName>
                        <SpeechText>
                            {currentSpeech.isAction ? (
                                <em>*{currentSpeech.text}*</em>
                            ) : (
                                <>
                                    &ldquo;
                                    <RenderTextWithKeywords
                                        text={currentSpeech.text}
                                        keywords={currentSpeech.keywords}
                                        onKeywordClick={handleKeywordClick}
                                    />
                                    &rdquo;
                                </>
                            )}
                        </SpeechText>
                    </SpeechBubble>
                )}
            </AnimatePresence>

            {/* Continue indicator */}
            {isPlaying && !isPaused && (
                <ContinueIndicator
                    onClick={handleContinue}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        Click to continue →
                    </motion.span>
                </ContinueIndicator>
            )}

            {/* Pause indicator */}
            {isPaused && (
                <ContinueIndicator onClick={dialogue.skipPause}>
                    <motion.span
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1, repeat: Infinity }}
                    >
                        ...
                    </motion.span>
                </ContinueIndicator>
            )}
        </DialogueContainer>
    );
}

// Export the response handler for use with DialogueSelector
export function useDialogueResponses(dialogue) {
    return useCallback((topic, subtopic) => {
        if (dialogue) {
            return dialogue.handleResponse(topic, subtopic);
        }
        return null;
    }, [dialogue]);
}

export default DialogueController;
