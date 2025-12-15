// ============================================================
// ALEX CHEN - Generalized Anxiety Disorder (GAD)
// Tutorial Patient - "See You Next Session"
// ============================================================
// A graduate student presenting with anxiety who exhibits
// classic physical symptoms while verbally minimizing distress.
// ============================================================

// --- CONSTANTS ---
CONST RELAXED = 0
CONST MILD_ANXIETY = 1
CONST MODERATE_ANXIETY = 2
CONST SEVERE_ANXIETY = 3

// --- GLOBAL STATE ---
VAR current_anxiety_level = MODERATE_ANXIETY
VAR rapport = 0
VAR session_turn = 0
VAR breakthrough_achieved = false

// --- DISCOVERY FLAGS ---
VAR found_sleep_contradiction = false
VAR found_physical_symptoms = false
VAR found_catastrophizing = false
VAR found_avoidance = false

// --- SYMPTOM VISIBILITY ---
VAR show_fidgeting = true
VAR show_nail_biting = false
VAR show_rapid_speech = false
VAR show_shallow_breathing = false

-> intro

// ============================================================
=== intro ===
// First meeting with Alex

A young person sits in the chair across from you, fingers drumming restlessly on the armrest. They offer a quick, tense smile.

ALEX: Hi, Dr. <>
{
    - rapport > 0:
        — thanks for fitting me in.
    - else:
        — um, thanks for seeing me.
}

* [Welcome them warmly]
    -> welcome_warm
* [Begin with intake questions]
    -> begin_intake
* [Ask what brings them in]
    -> ask_reason

= welcome_warm
You offer a reassuring smile and gesture to the comfortable chair.

YOU: Welcome, Alex. Please, make yourself comfortable. There's no rush here.

Alex shifts slightly, but some tension leaves their shoulders.

~ rapport++
~ current_anxiety_level = MILD_ANXIETY

ALEX: Thanks. That's... yeah, thanks.

-> begin_session

= begin_intake
YOU: Let's start with some basic information. Can you tell me a bit about yourself?

ALEX: Sure, um, I'm 24, graduate student in biochemistry. Second year of my PhD program.

-> begin_session

= ask_reason
YOU: What brings you in today, Alex?

Alex's fingers stop drumming for a moment, then resume faster.

~ show_nail_biting = true

ALEX: I've just been feeling... a lot lately. My advisor suggested I talk to someone.

-> begin_session

// ============================================================
=== begin_session ===

~ session_turn = 1

You settle into your chair, notepad ready.

-> turn_one

// ============================================================
=== turn_one ===

{ session_turn == 1:
    Alex sits forward slightly, knee bouncing.
}

* [Ask about their daily routine]
    -> daily_routine
* [Explore their academic pressures]
    -> academic_pressure
* [Inquire about sleep patterns]
    -> sleep_inquiry
* {rapport >= 2} [Ask about their physical sensations]
    -> physical_symptoms

// ============================================================
=== daily_routine ===

YOU: Walk me through a typical day for you.

Alex takes a breath — then speaks rapidly, words tumbling out.

~ show_rapid_speech = true

ALEX: I wake up around 6, check my email immediately — I have to, what if my advisor sent something overnight? Then I review my task list, usually add more things to it, get to the lab by 7:30...

They trail off, realizing they've been speaking very fast.

ALEX: Sorry, I'm rambling.

* [Note the rapid speech]
    YOU: I noticed you were speaking quite quickly there. Do you often feel rushed?
    
    ALEX: I... {shallow_breath()} yeah, I guess I always feel like there's not enough time.
    
    ~ show_shallow_breathing = true
    ~ found_physical_symptoms = true
    
    -> advance_turn

* [Ask about the email checking]
    YOU: You mentioned checking email first thing. What happens if you don't?
    
    Alex's hand moves to their mouth, biting at a nail.
    
    ~ show_nail_biting = true
    
    ALEX: I just... I need to know. What if something's wrong? What if there's a deadline I forgot about?
    
    ~ found_catastrophizing = true
    
    -> advance_turn

* [Reassure them]
    YOU: Take your time. There's no rush here.
    
    ~ rapport++
    
    ALEX: Right. Right, sorry.
    
    -> advance_turn

// ============================================================
=== academic_pressure ===

YOU: Tell me about your PhD program. How are things going?

Alex laughs — a sharp, nervous sound.

ALEX: Fine. It's fine. I mean, everyone's stressed, right? That's just grad school.

Their fingers haven't stopped moving the entire time they've been speaking.

~ show_fidgeting = true

* [Probe deeper]
    YOU: "Fine" can mean a lot of things. What does it look like for you specifically?
    
    A long pause. Alex's knee bouncing intensifies.
    
    ALEX: I submitted a paper last month. I've checked my email approximately... // hesitates
    
    ALEX: ...400 times waiting for reviews.
    
    ~ found_catastrophizing = true
    
    ALEX: Every time my phone buzzes, I think it's a rejection. Even when it's just spam.
    
    -> advance_turn

* [Ask about their advisor]
    YOU: How's your relationship with your advisor?
    
    ALEX: Dr. Morrison is great, actually. Very supportive. She's the one who suggested I come here.
    
    A pause.
    
    ALEX: She said she noticed I seemed "wound pretty tight lately." Her words.
    
    -> advance_turn

* [Validate their experience]
    YOU: Graduate school is genuinely demanding. It's okay to acknowledge that.
    
    ~ rapport++
    
    Alex's shoulders drop slightly.
    
    ALEX: Yeah. Yeah, it is. Sometimes I feel like I'm not supposed to admit that.
    
    -> advance_turn

// ============================================================
=== sleep_inquiry ===

YOU: How have you been sleeping?

Alex's response comes quickly — too quickly.

ALEX: Fine. Seven, eight hours usually.

But you notice their eyes have dark circles beneath them, and they shift uncomfortably as they speak.

* [Note the contradiction] #contradiction
    YOU: I notice you mentioned sleeping well, but you look quite tired. Can you tell me more?
    
    Alex freezes, caught. Their hand moves to rub their eyes.
    
    ALEX: I... okay. I lay down for eight hours. Actually sleeping is... different.
    
    ~ found_sleep_contradiction = true
    ~ rapport++
    
    -> sleep_details

* [Accept at face value]
    YOU: Good, adequate sleep is important.
    
    ALEX: Yeah. Yeah, it is.
    
    Alex looks away, clearly not telling the whole story.
    
    -> advance_turn

* [Ask follow-up gently]
    YOU: And how do you feel when you wake up?
    
    ALEX: Tired. Always tired.
    
    A pause. Alex seems to realize what they've admitted.
    
    ~ found_sleep_contradiction = true
    
    -> sleep_details

= sleep_details

ALEX: I wake up a lot. Three, four times a night usually. My brain just... won't stop.

~ show_shallow_breathing = true

ALEX: I lie there thinking about everything I didn't finish, everything that could go wrong tomorrow, whether I'll ever actually finish my dissertation...

~ found_catastrophizing = true

* [Explore the racing thoughts]
    -> racing_thoughts

* [Ask about physical sensations at night]
    -> night_symptoms

// ============================================================
=== racing_thoughts ===

YOU: These racing thoughts at night — can you describe what goes through your mind?

Alex's breathing becomes visibly shallower.

~ show_shallow_breathing = true

ALEX: It's like... a list that never ends. Did I lock the lab? Did I save that file? What if my data is wrong? What if I get scooped? What if I waste five years of my life?

They stop abruptly, embarrassed.

ALEX: Sorry. That escalated.

* [Point out the escalation pattern]
    YOU: I noticed how quickly your thoughts jumped from a small concern to catastrophic outcomes. Is that typical?
    
    ALEX: I... yeah. Yeah, I do that a lot.
    
    ~ found_catastrophizing = true
    ~ rapport++
    
    -> advance_turn

* [Validate the experience]
    YOU: Those thoughts sound exhausting to carry.
    
    ~ rapport++
    
    ALEX: Yeah. They are. // voice catching
    
    -> advance_turn

// ============================================================
=== night_symptoms ===

YOU: When you wake up at night, what does your body feel like?

Alex considers this, surprised by the question.

ALEX: My heart's usually pounding. Sometimes my chest feels tight. I thought maybe I should see a cardiologist, but my physical came back fine.

~ found_physical_symptoms = true
~ show_shallow_breathing = true

* [Connect physical and emotional]
    YOU: Those physical symptoms — racing heart, chest tightness — can be your body's response to anxiety. Have you noticed them during the day too?
    
    ALEX: Actually... yes. Before meetings. When I'm waiting for email replies. When my advisor wants to talk. // realization dawning
    
    -> advance_turn

* [Ask about medical history]
    YOU: Have you experienced these symptoms before this past year?
    
    ALEX: Not really. Or maybe I just didn't notice? Things really ramped up when I started my PhD.
    
    -> advance_turn

// ============================================================
=== physical_symptoms ===

YOU: I've noticed some physical tension while we've been talking. Can you tell me what you're experiencing in your body right now?

Alex looks down at their hands, which they realize are gripping the armrest.

ALEX: Oh. I didn't even... 

They force their hands to relax, then immediately start drumming their fingers again.

~ show_fidgeting = true
~ found_physical_symptoms = true

ALEX: I guess I'm always kind of... keyed up? My shoulders live somewhere around my ears.

* [Explore this further]
    YOU: How long have you felt this constant tension?
    
    ALEX: Months? Maybe longer. It's hard to remember when it started. It's just... how I am now.
    
    -> advance_turn

* [Teach grounding technique]
    YOU: Would you like to try a brief exercise? Just focusing on relaxing your shoulders for a moment.
    
    ~ rapport++
    
    ALEX: Sure, okay. // skeptical but willing
    
    You guide them through a brief progressive relaxation. Alex's shoulders visibly drop.
    
    Alex looks surprised.
    
    ALEX: Oh. That's... different.
    
    -> advance_turn

// ============================================================
=== advance_turn ===

~ session_turn++

{
    - session_turn >= 4 && found_sleep_contradiction && found_physical_symptoms:
        -> approaching_breakthrough
    - session_turn >= 3:
        -> mid_session
    - else:
        -> turn_one
}

// ============================================================
=== mid_session ===

Alex shifts in their chair, some of the initial defensiveness fading.

ALEX: Can I ask you something? Is this... am I normal? Everyone seems to handle things better than me.

* [Normalize their experience]
    YOU: What you're describing — the racing thoughts, the physical symptoms, the sleep problems — these are things many people experience, especially under pressure.
    
    ~ rapport++
    
    ALEX: So I'm not... broken?
    
    -> mid_session_continue

* [Reframe the question]
    YOU: I'm curious about that comparison. How do you know how other people are handling things on the inside?
    
    Alex pauses, considering.
    
    ALEX: I... don't, I guess. Everyone just looks so together.
    
    -> mid_session_continue

= mid_session_continue

* [Return to exploration]
    -> turn_one

* {found_sleep_contradiction && found_physical_symptoms} [Connect the patterns you've observed]
    -> approaching_breakthrough

// ============================================================
=== approaching_breakthrough ===

You've gathered enough information. The pattern is clear — Alex is experiencing significant anxiety but has normalized it to the point they don't recognize its severity.

* [Present your observations]
    -> breakthrough_moment

* [Ask one more clarifying question]
    YOU: Alex, if you could change one thing about how you're feeling right now, what would it be?
    
    ALEX: I'd want to be able to stop. Just... stop thinking, stop worrying, stop waiting for something terrible to happen. // without hesitation
    
    Their eyes widen slightly at their own honesty.
    
    -> breakthrough_moment

// ============================================================
=== breakthrough_moment ===

YOU: Alex, I want to share what I've observed. You came in saying things were "fine" and you sleep "seven or eight hours."

Alex tenses.

YOU: But you've also described waking multiple times a night with a racing heart, constant physical tension you don't even notice anymore, and thoughts that spiral from small concerns to worst-case scenarios in seconds.

~ show_shallow_breathing = true

ALEX: When you say it like that...

* [Continue gently]
    YOU: This isn't about something being wrong with you. It's about recognizing that you've been carrying an enormous weight and pretending it's nothing.
    
    -> breakthrough_response

* [Wait for them to respond]
    -> breakthrough_response

= breakthrough_response

A long silence. Alex's eyes grow bright with unshed tears.

ALEX: I thought if I just worked harder, pushed through... everyone says grad school is hard. I didn't want to be weak. // voice small

~ breakthrough_achieved = true

* [Validate and reframe]
    YOU: Coming here isn't weakness. Recognizing when something isn't working and seeking help — that takes courage.
    
    ~ rapport++
    
    ALEX: My mom always said anxiety was just an excuse people use. // wiping eyes
    
    -> family_revelation

* [Sit with the emotion]
    You let the silence hold, giving Alex space to feel what they're feeling.
    
    After a moment, Alex speaks.
    
    ALEX: I'm so tired of being scared all the time.
    
    -> closing_conversation

// ============================================================
=== family_revelation ===

YOU: It sounds like there might be some family history with how anxiety is viewed?

ALEX: My mom's a surgeon. "Mind over matter" type. She doesn't really believe in... this.

They gesture vaguely at your office.

ALEX: She thinks I'm being dramatic. That I should just focus and it'll go away.

* [Explore this dynamic]
    YOU: How does it feel to be here, then, given her views?
    
    ALEX: Honestly? Terrifying. But also... I couldn't keep going the way I was.
    
    -> closing_conversation

* [Acknowledge the conflict]
    YOU: That sounds like an additional layer of stress — not just experiencing these symptoms, but feeling like you shouldn't be struggling with them.
    
    Alex nods.
    
    ALEX: Yeah. Yeah, exactly.
    
    -> closing_conversation

// ============================================================
=== closing_conversation ===

The session time is drawing to a close. Alex looks tired but somehow lighter.

ALEX: So what happens now? Am I... do I have something?

* [Discuss next steps clinically]
    YOU: What you're describing aligns with Generalized Anxiety Disorder. It's very treatable — we have good options, both therapeutic and medical if you're interested.
    
    Relief washes over Alex's face.
    
    ALEX: So there's a name for it. It's not just me being bad at life.
    
    -> session_end

* [Focus on the therapeutic relationship]
    YOU: For now, what happens is we keep talking. You've taken a big step today.
    
    Alex manages a small smile.
    
    ALEX: Yeah. Yeah, I guess I have.
    
    -> session_end

// ============================================================
=== session_end ===

Alex stands, gathering their things. Their fingers are still now — or at least, stiller than before.

ALEX: Same time next week?

YOU: I'll see you then, Alex.

At the door, they pause.

ALEX: Dr.? Thanks for... noticing. The stuff I was trying to hide.

~ show_fidgeting = false

* [Warm response]
    YOU: That's what we're here for.
    
    Alex nods, a genuine smile breaking through, and leaves.
    
    -> END

* [Professional but kind]
    YOU: See you next session.
    
    Alex nods, something shifting in their expression — hope, maybe — and closes the door behind them.
    
    -> END

// ============================================================
=== function shallow_breath() ===
~ show_shallow_breathing = true
~ return
