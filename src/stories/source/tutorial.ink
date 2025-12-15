// Tutorial Patient - Generalized Anxiety Disorder
// This is a sample Ink story demonstrating the narrative structure
// Compile this with Inky to generate the JSON file

// ============================================
// VARIABLES
// ============================================
VAR trust = 0
VAR discovered_nail_biting = false
VAR discovered_eye_bags = false
VAR discovered_fidgeting = false
VAR discovered_worry = false
VAR discovered_sleep_issues = false
VAR session_phase = 1

// ============================================
// START
// ============================================
=== start ===
# mood:neutral
# animation:enter

The patient enters your office, glancing around nervously before taking a seat.

* [Welcome them warmly]
    ~ trust += 1
    "Hello, please make yourself comfortable. I'm glad you're here today."
    
    She offers a tight smile and perches on the edge of the chair.
    
    "Thank you, Doctor. I... I've never done this before."
    -> opening_question
    
* [Remain professional]
    "Good afternoon. Please, have a seat."
    
    She nods quickly and sits down, hands clasped tightly in her lap.
    
    "Thank you."
    -> opening_question

=== opening_question ===
# phase:1

"So, what brings you in today?"

* [Let her explain at her own pace]
    ~ trust += 1
    You wait patiently, giving her space to collect her thoughts.
    -> explain_anxiety
    
* [Prompt her gently]
    "Take your time. There's no rush."
    -> explain_anxiety

=== explain_anxiety ===
# mood:anxious

She takes a shaky breath.

"I just... I can't stop <b>worrying</b>. About everything." # token:worry
~ discovered_worry = true

"Work, my family, my health... even little things like whether I locked the door."

* ["How long has this been going on?"]
    -> duration
    
* ["What kind of things do you worry about most?"]
    -> worry_details

=== duration ===
"Honestly? I think... always? But it's gotten so much worse lately."

She looks down at her hands.

"The past few months have been... really hard."

* [Ask about recent changes]
    "Has anything changed recently?"
    -> recent_changes
    
* [Ask about sleep]
    "How has this affected your sleep?"
    -> sleep_discussion

=== worry_details ===
"Everything, really. I wake up and immediately start thinking about all the things that could go wrong."

# animation:fidget

She shifts in her seat, fingers twisting together.

"What if I mess up at work? What if something happens to my parents? What if I get sick?"

* [Validate her feelings]
    ~ trust += 1
    "That sounds exhausting. Carrying all that worry must be incredibly draining."
    
    She looks up, surprised.
    
    "You... you understand?"
    -> sleep_discussion
    
* [Ask about physical symptoms]
    "When you feel this worried, do you notice any physical sensations?"
    -> physical_symptoms

=== recent_changes ===
"Well... I got promoted at work three months ago."

She laughs nervously.

"I should be happy, right? But now there's so much more responsibility. What if I can't handle it?"

# token:perfectionism

* [Explore the promotion]
    "Tell me more about this new role."
    -> work_stress
    
* [Ask about sleep]
    "How has this affected your rest?"
    -> sleep_discussion

=== work_stress ===
"I'm managing a team now. Six people depending on me."

# mood:stressed
# animation:hands_clasp

"I stay late every night going over everything twice, three times. I can't afford to make mistakes."

Her hands grip each other tightly.

* [Notice her hands]
    You observe her white-knuckled grip.
    -> physical_symptoms
    
* [Ask about perfectionism]
    "It sounds like you put a lot of pressure on yourself."
    -> perfectionism_discussion

=== perfectionism_discussion ===
~ trust += 1

"I... I guess I do."

She pauses, considering.

"My parents always said 'if you're going to do something, do it right.' I've never been able to just... let things be good enough."

# token:perfectionism

* [Connect to anxiety]
    "That drive for perfection—could it be connected to your worrying?"
    
    She blinks.
    
    "I never thought about it that way..."
    -> sleep_discussion
    
* [Ask about childhood]
    "Were your parents very demanding?"
    -> family_pressure

=== family_pressure ===
"Not... harsh, exactly. But there were expectations."

# mood:sad

"I was always the responsible one. The one who had to have it together."

She looks away.

"I still am."

-> sleep_discussion

=== sleep_discussion ===
# phase:2
~ session_phase = 2

"Let's talk about your sleep. How has that been?"

# mood:tired

Her face falls.

"<b>Terrible</b>. I lie awake for hours. My mind just won't stop." # token:insomnia
~ discovered_sleep_issues = true

* ["What keeps you awake?"]
    -> sleep_details
    
* ["How many hours are you getting?"]
    -> sleep_amount

=== sleep_details ===
"Everything I have to do tomorrow. Everything I might have forgotten today."

# animation:rub_eyes

She rubs her eyes wearily.

"Sometimes I finally fall asleep at 2 or 3 AM, and then my alarm goes off at 6."

{ not discovered_eye_bags:
    ~ discovered_eye_bags = true
    # symptom:eye_bags
    You notice the dark circles under her eyes. # token:fatigue
}

* [Ask about daily functioning]
    "How do you get through the day on so little sleep?"
    -> daily_functioning
    
* [Ask about concentration]
    "Has this affected your ability to concentrate?"
    -> concentration

=== sleep_amount ===
"Maybe three or four hours? On a good night."

She shakes her head.

"I don't remember the last time I felt truly rested."

{ not discovered_eye_bags:
    ~ discovered_eye_bags = true
    # symptom:eye_bags
    The exhaustion is evident in her face—dark circles and tired eyes. # token:fatigue
}

-> daily_functioning

=== daily_functioning ===
"Coffee. Lots of coffee."

# animation:nervous_laugh

She gives a hollow laugh.

"I'm running on fumes, honestly. But I can't afford to slow down."

* [Express concern]
    ~ trust += 1
    "That's not sustainable. Your body needs rest."
    
    "I know. I know. But there's always something that needs to be done."
    -> concentration
    
* [Ask about weekends]
    "What about weekends? Can you catch up then?"
    
    "I try, but I end up worrying about Monday."
    -> concentration

=== concentration ===
# phase:3
~ session_phase = 3

"<b>Concentrating</b> is so hard now." # token:concentration_issues

# animation:look_around

She glances around the room, then back to you.

"I read the same email five times. I forget what I was doing mid-task."

{ not discovered_fidgeting:
    ~ discovered_fidgeting = true
    # symptom:fidgeting
    You notice how she can't seem to sit still, constantly shifting position.
}

* [Connect the symptoms]
    "Sleep deprivation and constant worry can significantly impact concentration."
    -> connect_symptoms
    
* [Ask about coping]
    "How do you cope when you feel this overwhelmed?"
    -> coping_mechanisms

=== physical_symptoms ===
# phase:2

"Yes, actually. My shoulders are always tense. I get headaches."

# animation:shoulders_tense
# symptom:muscle_tension

She rolls her shoulders unconsciously.

"And my stomach... I've had <b>digestive issues</b> for months." # token:physical_symptoms

* [Ask about other symptoms]
    "Any other physical symptoms? Rapid heartbeat? Shortness of breath?"
    
    "Sometimes, yes. Especially when I'm really stressed."
    -> sleep_discussion
    
* [Explain the connection]
    "Anxiety often manifests physically. Your body is responding to chronic stress."
    
    ~ trust += 1
    "So it's not just in my head?"
    
    "Not at all. These are very real, very common symptoms."
    -> sleep_discussion

=== coping_mechanisms ===
"I don't know if I really do cope. I just... keep going."

She picks at her fingernails absently.

{ not discovered_nail_biting:
    ~ discovered_nail_biting = true
    # symptom:nail_biting
    # token:nail_biting
    You notice her nails are bitten down to the quick.
}

"I make lists. Lots of lists. Checking things off helps a little."

* [Validate the strategy]
    "Lists can be a helpful way to manage anxiety. Do they reduce your worry?"
    
    "For a moment. Then I think of ten more things to add."
    -> connect_symptoms
    
* [Ask about self-care]
    "What about taking time for yourself? Exercise, hobbies?"
    
    She looks almost guilty.
    
    "I feel like I can't. There's too much to do."
    -> connect_symptoms

=== connect_symptoms ===
# phase:4
~ session_phase = 4

Based on what you've shared—the persistent worry, the sleep problems, the difficulty concentrating, the physical tension...

# mood:hopeful

She looks at you expectantly.

"What does it all mean?"

* [Provide reassurance]
    ~ trust += 2
    "These symptoms often go together. The good news is, they're very treatable."
    -> diagnosis_ready
    
* [Summarize findings]
    "Let me summarize what I've observed..."
    -> diagnosis_ready

=== diagnosis_ready ===
# breakthrough
# animation:relief

She lets out a long breath.

"So I'm not... going crazy?"

"Not at all. What you're experiencing has a name, and there are effective ways to address it."

{ trust >= 4:
    Her eyes well up with tears of relief.
    
    "Thank you. I was so afraid to come here, but... thank you."
}

-> end_session

=== end_session ===
# phase:end
# mood:relieved

"We've covered a lot today. How are you feeling?"

She considers for a moment.

{ trust >= 3:
    "Better, actually. It helps to talk about it."
} 
- else:
    "A little overwhelmed, but... okay."
}

"<b>See you next session</b>." # token:session_end

-> END
