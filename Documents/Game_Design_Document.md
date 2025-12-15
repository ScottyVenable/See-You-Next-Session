# See You Next Session - Game Design Document (GDD)

**Version:** 1.0  
**Date:** December 14, 2025  
**Authors:** Scott & Kiki  
**Status:** MVP Planning

---

## 1. Executive Summary

**"See You Next Session"** is a narrative simulation and puzzle game where the player assumes the role of a mental health professional. The core gameplay loop revolves around managing mental energy ("Focus") to identify contradictions between a patient's spoken dialogue and their physical presentation.

**The Goal:** Accurately diagnose patients within a limited time frame (1-hour session simulated in 4 turns) by synthesizing observed clues and spoken statements.

**Target Audience:** Fans of *Papers, Please*, *Ace Attorney*, and narrative-driven simulation games.

---

## 2. Detailed Mechanics (The "Under the Hood")

### 2.1 The Token System (Drag-and-Drop Logic)
The game treats information as physical objects called **Tokens**.
*   **Text Tokens:** Created by clicking highlighted keywords in the patient's dialogue (e.g., "I haven't slept").
*   **Visual Tokens:** Created by observing specific physical traits on the patient model during "Focus Mode" (e.g., *Dilated Pupils*).

**Interaction Logic:**
*   **Token + Handbook:** Dragging a token to the Handbook checks if the symptom aligns with a specific disorder.
*   **Token + Token (Synthesis):** Dragging a Visual Token onto a Text Token attempts to find a **Contradiction**.
    *   **Correct Match (Breakthrough):** If the visual cue contradicts the text (e.g., Patient says "I'm calm" + Visual "Trembling Hands"), a **Breakthrough** occurs. The patient opens up, new dialogue unlocks, and Focus is restored.
    *   **Incorrect Match:** The tokens bounce apart with a "confusion" animation. The player loses a small amount of Focus representing mental strain.

### 2.2 Focus Resource Math
The **Focus Meter** represents the therapist's mental stamina. It is a finite resource that must be managed carefully.

*   **Starting Focus:** 100 Points (Max).
*   **Costs:**
    *   **Enter Focus Mode:** 0 Points (Free to toggle).
    *   **"Look" Action (Identify Symptom):** -15 Points.
    *   **Incorrect Synthesis Match:** -10 Points.
*   **Restoration:**
    *   **Successful Breakthrough:** +40 Points.
    *   **Correct Diagnosis (End of Session):** Refills to Max for next patient.

*Design Note: The math is weighted to encourage careful observation rather than spam-clicking. A player can afford ~6 "Looks" without a Breakthrough before running out of energy.*

---

## 3. Narrative Design & Sensitivity

### 3.1 Tone & Style Guide
*   **Professional yet Human:** The player character's internal monologue should be analytical but empathetic. Avoid judgment; focus on observation.
*   **Respectful Representation:** Symptoms should be depicted clinically, not as caricatures.
    *   *Bad:* "He looks crazy."
    *   *Good:* "Patient exhibits rapid eye movement and pressured speech."
*   **Trigger Warnings:** The game will include a content warning at the start and options to toggle off graphic descriptions of self-harm.

### 3.2 End of Session Flow
1.  **The Clock Runs Out:** After Turn 4, the session ends.
2.  **The Notebook:** The player is presented with a summary sheet.
3.  **Final Diagnosis:** Player drags the final "Disorder Token" (derived from the Handbook) onto the Diagnosis slot.
4.  **Grading (Supervisor Review):** The results are presented as a "Supervisor's Note."
    *   **Rank S:** Perfect Diagnosis + All Contradictions Found. ("Excellent work. Your insight is invaluable.")
    *   **Rank A:** Correct Diagnosis. ("Solid assessment.")
    *   **Rank C:** Incorrect Diagnosis but safe referral. ("Review the symptoms for [Disorder] again.")
    *   **Rank F:** Harmful/Negligent Diagnosis. ("We need to discuss this file immediately.")

---

## 4. User Interface (UI) Wireframe Description

### 4.1 The Desk (Main Gameplay Screen)
*   **Left Third (The Patient):**
    *   Displays the 2D character sprite.
    *   This area is interactive during "Focus Mode."
*   **Center Bottom (Dialogue):**
    *   Standard visual novel text box.
    *   Keywords are highlighted and draggable.
*   **Right Third (The Workstation):**
    *   **Clipboard:** A grid area to store active Text and Visual Tokens.
    *   **The Handbook:** A clickable book icon that opens an overlay menu containing disorder definitions.
    *   **Focus Meter:** A vertical bar on the far right, filled with a teal "liquid" that drains.
    *   **Clock:** An analog clock showing the current 15-minute increment.

### 4.2 Focus Mode Visuals
*   **Activation:** When the player holds the Right Mouse Button (or toggles a switch).
*   **Vignette:** The edges of the screen darken significantly.
*   **Desaturation:** The background (office) turns grayscale.
*   **Spotlight:** The patient remains in color and is slightly illuminated.
*   **Cursor:** Changes to a magnifying glass icon.

---

## 5. Technical Architecture (Unity Specifics)

*See separate `Technical_Architecture.md` for class breakdowns.*

---

## 6. Asset Requirements

*See separate `Asset_List.md` for the full checklist.*
