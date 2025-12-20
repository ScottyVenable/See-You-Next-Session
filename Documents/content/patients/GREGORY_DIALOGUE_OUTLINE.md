# Gregory Vigil - Dialogue & Story Arc Outline

> **Document Type:** Content Design Reference  
> **Created:** December 20, 2025  
> **Authors:** Content Team (Kiki, Scott)  
> **Status:** Active Development  
> **Related:** [Gregory Character Sheet](./gregory.md)

---

## 1. Character Summary

**Gregory Vigil** is the tutorial patient, designed to teach players all core mechanics while providing an emotionally engaging story. His Generalized Anxiety Disorder (GAD) manifests through:

- **Hedging/qualifying** every statement
- **Seeking validation** from the therapist
- **Over-explaining** to "get things right"
- **Minimizing** his own experiences
- **Hypervigilance** about being judged

### Name Meaning
- **Gregory:** "Watchful, alert"
- **Vigil:** "Watchful, awake"
- Together: Reflects his constant state of hypervigilance

---

## 2. Session Overview

Gregory's session spans 4 turns, representing a 1-hour therapy appointment.

| Turn | Time | Theme | Player Learns |
|------|------|-------|---------------|
| 1 | 0:00-0:15 | First Impressions | Basic dialogue, keywords, observation |
| 2 | 0:15-0:30 | Building Trust | Rapport, Focus Mode, symptoms |
| 3 | 0:30-0:45 | Going Deeper | Contradictions, synthesis, breakthroughs |
| 4 | 0:45-1:00 | Resolution | Diagnosis, session conclusion |

---

## 3. Turn-by-Turn Story Arc

### Turn 1: First Impressions (gregory_1.session)

**Opening Scene:**
Gregory enters with careful, measured steps. Despite his meticulous appearance (all black clothing, perfectly pressed), his anxiety shows through physical tells - shaking hands, dark circles under eyes, bitten nails.

**Key Story Beats:**
1. **Entrance** - First impression establishes visual contradictions
2. **Apology Loop** - Gregory apologizes for potentially wasting your time
3. **Why He's Here** - Vague references to "accumulating difficulties"
4. **Sleep Introduction** - First major topic, heavily hedged
5. **Validation Seeking** - "Is that an appropriate reason to come to therapy?"

**Dialogue Goals:**
- Introduce Gregory's speech patterns (hedging, qualifying)
- Present first keywords naturally
- Allow player to observe visual symptoms
- Low-stakes introduction to mechanics

**Keywords Introduced:**
- `gregory.duration.months_delay` - "Months, actually"
- `gregory.minimizing.nothing_serious` - "nothing serious"
- `gregory.emotion.difficulties` - "difficulties"
- `gregory.pattern.accumulating` - "accumulating"
- `gregory.coping.hoping_away` - "hoping they go away"
- `gregory.sleep.claims_sleep` - "I do sleep" (contradiction)
- `gregory.sleep.cant_shut_off` - "mind doesn't shut off"
- `gregory.minimizing.not_trouble` - "not trouble exactly"

**Visual Symptoms Observable:**
- Bags under eyes (always visible)
- Trembling hands (entrance)
- Fidgeting fingers (ongoing)
- Darting eyes (scanning the room)
- Bitten nails (close observation)

**Rapport Gates:**
- 0-29: Gregory is guarded, gives minimal information
- 30-49: Admits to months of delay, some hedged honesty
- 50+: Shares vulnerability about feeling like he's overreacting

**Turn 1 Ending:**
Gregory has established his baseline - put-together appearance, anxious behaviors, sleep concerns mentioned but minimized. Player should have collected 3-5 keywords and observed 2-3 symptoms.

---

### Turn 2: Building Trust (gregory_2.session)

**Opening Scene:**
Time passes. Gregory has settled slightly but remains alert. His leg bounces unconsciously.

**Key Story Beats:**
1. **Work Life** - Gregory's job and daily stressors
2. **Social Anxiety Hints** - Worries about coworkers' perceptions
3. **Perfectionism Emerges** - The need to get everything "right"
4. **First Contradiction Setup** - "I'm sleeping fine" vs. visible exhaustion
5. **Control Facade** - Gregory tries to present as having things together

**Dialogue Goals:**
- Deepen understanding of Gregory's anxiety sources
- Present first clear contradiction opportunity
- Introduce work/social dimensions
- Allow higher-rapport players to unlock vulnerable content

**Keywords Introduced:**
- `gregory.work.performance_worry` - Concerns about work quality
- `gregory.social.coworker_judgment` - Fear of being judged
- `gregory.perfectionism.checking` - Repetitive checking behaviors
- `gregory.sleep.claims_fine` - "Fine, really" (contradiction)
- `gregory.physical.exhaustion` - Physical tiredness
- `gregory.behavior.avoidance` - Avoiding certain situations

**Visual Symptoms Observable:**
- Leg bouncing (more noticeable)
- Lip chewing (when stressed)
- Increased eye scanning
- Hands clasped tightly

**Contradiction Opportunity:**
| Statement | Visual | Synthesis Result |
|-----------|--------|------------------|
| "I sleep fine, really" | bags_under_eyes | Admits to insomnia struggles |

**Rapport Gates:**
- Low (0-39): Defensive responses, redirects personal questions
- Medium (40-59): Shares work concerns, still hedges
- High (60+): Admits to checking behaviors, validates concerns

**Turn 2 Ending:**
Player has opportunity for first breakthrough if they catch the sleep contradiction. Gregory is either still guarded or beginning to open up based on player's approach.

---

### Turn 3: Going Deeper (gregory_3.session)

**Opening Scene:**
The session's midpoint. Gregory's guard is lowering if rapport is good. His physical symptoms are more pronounced as he discusses difficult topics.

**Key Story Beats:**
1. **Childhood Mentions** (high rapport only) - Brief glimpses of origins
2. **The Watching Feeling** - Core anxiety about being observed
3. **Major Breakthrough Opportunity** - Connecting statements to symptoms
4. **Emotional Vulnerability** - If rapport is high, genuine moments
5. **Fear Admission** - "I'm afraid of being seen as broken"

**Dialogue Goals:**
- Provide multiple breakthrough opportunities
- Unlock the most emotionally resonant content
- Connect surface symptoms to core fears
- Reward empathetic play with deeper story

**Keywords Introduced:**
- `gregory.core.fear_of_judgment` - Central fear revealed
- `gregory.history.always_anxious` - Lifelong pattern
- `gregory.insight.tired_of_pretending` - Moment of honesty
- `gregory.emotion.overwhelmed` - Admits to feeling overwhelmed
- `gregory.behavior.performance` - Performing "okay" for others

**Visual Symptoms Observable:**
- All previous symptoms more pronounced
- Possible tear-welling (high rapport, emotional moments)
- Relaxed posture (if breakthrough achieved)
- Continued tension (if no breakthrough)

**Contradiction Opportunities:**
| Statement | Visual | Synthesis Result |
|-----------|--------|------------------|
| "I take care of myself" | bitten_nails | Reveals nervous habits |
| "I'm calm, this doesn't bother me" | trembling_hands | Acknowledges hidden anxiety |
| "I don't worry about what others think" | darting_eyes | Opens up about social fears |

**Rapport Gates:**
- Low: Surface-level continuation, limited breakthrough access
- Medium: One breakthrough possible, some vulnerability
- High: Multiple breakthroughs, childhood glimpse, genuine emotion

**Breakthrough Dialogue Example (High Rapport):**

```
@if rapport >= 70 AND synthesis("sleeping fine", "bags_under_eyes")
    PATIENT (vulnerable)
    "You're right. I haven't... I haven't slept well in months."
    
    @pause 1
    
    PATIENT
    "I lie awake replaying everything I said during the day. 
    Did I say it right? Did people notice something was off?"
    
    PATIENT (quiet)
    "I'm so tired of pretending I have it together."
    
    @restore_focus 40
    @unlock_dialogue deeper_sleep_discussion
@endif
```

**Turn 3 Ending:**
Critical turn for diagnosis preparation. Players who've achieved breakthroughs have clearer picture of GAD. Those who haven't may still diagnose but with less certainty.

---

### Turn 4: Resolution (gregory_4.session)

**Opening Scene:**
The session nears its end. Gregory looks expectant - anxious about what you'll say but also perhaps relieved to have talked.

**Key Story Beats:**
1. **Session Reflection** - Brief recap of what was discussed
2. **The Question** - "So... what do you think is going on with me?"
3. **Diagnosis Moment** - Player submits their diagnosis
4. **Gregory's Reaction** - Varies based on accuracy and rapport
5. **Looking Forward** - Discussion of next steps, hope/concern

**Dialogue Goals:**
- Provide satisfying conclusion regardless of player performance
- Reward accurate diagnosis with meaningful reaction
- Give feedback through Gregory's response
- Set up potential future sessions (post-MVP)

**Diagnosis Responses:**

**Correct Diagnosis (GAD) + High Rapport:**
```
PATIENT (relieved)
"Generalized Anxiety Disorder..."

@pause 1

PATIENT
"I... I've wondered. If there was a name for it."

PATIENT (vulnerable)
"Is it strange that I feel relieved? Like maybe I'm not 
just... broken or weak?"

PATIENT (grateful)
"Thank you. For listening. For not making me feel like 
I was wasting your time."
```

**Correct Diagnosis (GAD) + Low Rapport:**
```
PATIENT (guarded)
"Generalized Anxiety Disorder. I see."

@pause 1

PATIENT
"I suppose that makes sense. Given what I told you."

PATIENT (distant)
"So what happens now? Is there... is there something 
I'm supposed to do?"
```

**Incorrect Diagnosis + High Rapport:**
```
PATIENT (confused)
"Oh. I... I'm not sure that quite fits."

@pause 1

PATIENT (apologetic)
"I'm sorry if I wasn't clear about things. Maybe I 
didn't explain well enough."

PATIENT (anxious)
"Should we... should we talk more? I feel like maybe 
I gave you the wrong impression."
```

**Incorrect Diagnosis + Low Rapport:**
```
PATIENT (withdrawn)
"I don't think that's quite right."

@pause 1

PATIENT
"Maybe this wasn't a good idea after all."

PATIENT (closing off)
"I appreciate your time."
```

**Turn 4 Ending:**
Session concludes. Player receives grade based on:
- Diagnosis accuracy
- Breakthroughs achieved
- Rapport level
- Symptoms identified

---

## 4. Key Themes Throughout

### Theme: The Mask of Competence
Gregory presents as put-together but is crumbling underneath. Each turn should reinforce this contrast.

### Theme: The Weight of Watching
His constant feeling of being observed and judged drives his anxiety. Dialogue should reference eyes, watching, being seen.

### Theme: Permission to Not Be Okay
Gregory needs validation that it's acceptable to struggle. Empathetic dialogue choices should acknowledge this.

### Theme: The Courage to Seek Help
Coming to therapy was hard for Gregory. This vulnerability should be acknowledged.

---

## 5. Writing Guidelines

### Gregory's Voice

**Speech Patterns:**
- Hedges constantly ("Well, maybe...", "I'm not sure if...", "Perhaps...")
- Seeks validation ("Does that make sense?", "Is that normal?", "Right?")
- Over-qualifies ("Not that it's a big deal, but...", "Compared to others...")
- Self-deprecates ("I know this sounds stupid, but...")

**Vocabulary:**
- Formal, slightly stiff
- Avoids definitive statements
- Uses "perhaps" and "possibly" frequently
- Rarely says "I feel" - prefers "I think" or "It seems like"

**Example Good Gregory Dialogue:**
> "I've been having some trouble with... well, not trouble exactly. Concerns, perhaps? They're not major concerns. Lots of people deal with worse, I'm sure. But they've been... accumulating, if that makes sense?"

**Example Bad Gregory Dialogue (Don't Write Like This):**
> "I have anxiety and I can't sleep. It's been going on for months and I'm really stressed out about work."

### Narrator Voice

Clinical but not cold. Observational. Draws attention to visual details without diagnosing.

**Example:**
> *Gregory's hands rest on his knees, fingers tapping an irregular rhythm. Despite his composed expression, his leg bounces in a steady, unconscious tempo.*

---

## 6. Keyword Integration

Keywords should emerge naturally from dialogue, not feel forced.

**Good Integration:**
> "I've been meaning to come for a while now. [Months, actually]<keyword:gregory.duration.months_delay>. But I kept thinking maybe I was overreacting."

**Poor Integration (Avoid):**
> "I have had [anxiety]<keyword:emotion.anxious> for [months]<keyword:duration.months> which causes [sleep problems]<keyword:sleep.problems>."

### Keyword Density
- Turn 1: 8-12 keywords (introduction)
- Turn 2: 10-15 keywords (building)
- Turn 3: 15-20 keywords (depth)
- Turn 4: 5-8 keywords (conclusion)

---

## 7. Emotional Beats

### Moments That Should Feel Earned

1. **First Admission** - When Gregory stops hedging and admits something directly
2. **The Breakthrough** - When synthesis reveals deeper truth
3. **Childhood Glimpse** - Brief mention of how this started
4. **Relief Moment** - When correct diagnosis validates his struggles
5. **Hope Note** - End on possibility, not despair

### Moments to Avoid

- Sudden personality shifts
- Melodramatic revelations
- Cure narratives (one session doesn't fix anxiety)
- Villainizing anyone (parents, employers)
- Romanticizing mental illness

---

## 8. File Naming and Organization

```
src/patients/gregory/
├── dialogue/
│   ├── gregory_1.session    # Turn 1 - Introduction
│   ├── gregory_2.session    # Turn 2 - Building Trust  
│   ├── gregory_3.session    # Turn 3 - Going Deeper
│   └── gregory_4.session    # Turn 4 - Resolution
├── patient_config.json
└── gregory.keys
```

---

## 9. Revision Checklist

Before considering a turn complete:

- [ ] Dialogue feels natural for Gregory's character
- [ ] Keywords are integrated smoothly
- [ ] Rapport gates create meaningful differences
- [ ] At least one visual symptom is prominently mentioned
- [ ] Hedging/qualifying language is consistent
- [ ] No stigmatizing language
- [ ] Emotional beats feel earned
- [ ] Proper SDNS syntax throughout
- [ ] All keywords defined in gregory.keys

---

## Related Documents

- [Gregory Character Sheet](./gregory.md)
- [SDNS Reference](../../src/sdns/SDNS_REFERENCE.md)
- [Gregory MVP Checklist](../planning/GREGORY_MVP_CHECKLIST.md)
- [Game Design Document](../design/GAME_DESIGN_DOCUMENT.md)
