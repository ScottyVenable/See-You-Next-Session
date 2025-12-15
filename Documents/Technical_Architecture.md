# Technical Architecture & Data Structure

**Project:** See You Next Session  
**Engine:** Unity (2022.3 LTS recommended)  
**Language:** C#

---

## 1. Core Data Structures (ScriptableObjects)

To allow for easy content creation without hard-coding, we will use `ScriptableObject` heavily.

### 1.1 PatientProfile
This object holds all the static data for a specific level/patient.
```csharp
[CreateAssetMenu(fileName = "NewPatient", menuName = "SYNS/Patient Profile")]
public class PatientProfile : ScriptableObject
{
    public string patientName;
    public Sprite baseSprite;
    public DifficultyLevel difficulty; // Enum: Easy, Medium, Hard
    public Disorder correctDiagnosis;
    
    [Header("Session Content")]
    public List<DialoguePhase> phases; // Represents the 4 turns
    public List<Symptom> hiddenSymptoms; // Symptoms discoverable in Focus Mode
}
```

### 1.2 Symptom (The "Visual Token" Data)
```csharp
[CreateAssetMenu(fileName = "NewSymptom", menuName = "SYNS/Symptom")]
public class Symptom : ScriptableObject
{
    public string symptomName; // e.g., "Dilated Pupils"
    public string description;
    public Sprite icon; // The visual token icon
    public int focusCost = 15;
    public Sprite overlayLayer; // The specific sprite layer to enable on the character (optional)
}
```

### 1.3 DialogueNode (The "Text Token" Data)
We need a custom class to handle the text parsing.
```csharp
[System.Serializable]
public class DialogueNode
{
    [TextArea(3, 10)]
    public string dialogueText; // "I haven't slept in days."
    
    public List<string> keywords; // "haven't slept"
    public Symptom contradictionTarget; // If this text contradicts a symptom, link it here.
}
```

---

## 2. Systems Architecture

### 2.1 The Notebook System (GameManager)
This system manages the state of the current session.

*   **Class:** `SessionManager`
*   **Responsibilities:**
    *   Tracks current `Turn` (1-4).
    *   Manages `CurrentFocus` (int).
    *   Holds the `ActiveTokens` list (what is currently on the clipboard).
    *   **Synthesis Logic:**
        ```csharp
        public void AttemptSynthesis(Token textToken, Token visualToken)
        {
            if (textToken.contradictionTarget == visualToken.symptomReference)
            {
                TriggerBreakthrough();
            }
            else
            {
                TriggerPenalty();
            }
        }
        ```

### 2.2 The Focus System
*   **Class:** `FocusController`
*   **Responsibilities:**
    *   Handles the UI fill amount for the Focus Bar.
    *   Toggles the Post-Processing Volume (Vignette/Desaturation) for "Focus Mode".
    *   Raycasts against the Patient sprite to detect `SymptomHotspots`.

### 2.3 Drag-and-Drop Handler
*   **Class:** `DraggableToken` (inherits from `MonoBehaviour`, implements `IBeginDragHandler`, `IDragHandler`, `IEndDragHandler`)
*   **Responsibilities:**
    *   Moves the UI element.
    *   Detects if dropped on the "Handbook" or another "Token".

---

## 3. Folder Structure
```
Assets/
├── _Game/
│   ├── Scripts/
│   │   ├── Core/ (GameManager, SessionManager)
│   │   ├── Data/ (ScriptableObject definitions)
│   │   ├── UI/ (Draggable, Tooltips)
│   │   └── Patient/ (Visual controllers)
│   ├── ScriptableObjects/
│   │   ├── Patients/
│   │   ├── Symptoms/
│   │   └── Disorders/
│   ├── Sprites/
│   │   ├── Characters/
│   │   └── UI/
│   └── Prefabs/
```
