# ElevenLabs SFX Generation Prompts - 16BitFit V3

**Purpose:** Comprehensive ElevenLabs API prompts for batch generating all sound effects
**Generation Method:** ElevenLabs Sound Effects API
**Target:** SFX only (no VO, no music)
**Created:** 2025-11-01

---

## Research-Based Best Practices

### Prompt Engineering Principles (from ElevenLabs Documentation)

1. **Use Descriptive Language** - Avoid onomatopoeia, use detailed descriptions
2. **Include Professional Terminology** - "foley", "impact", "whoosh", "one-shot"
3. **Specify Context** - Source, environment, acoustic properties
4. **Balance Detail** - Descriptive but brief enough for AI understanding
5. **Generate Complex Sequences Separately** - Better control with individual components

### Parameter Guidelines

**Duration Settings:**
- Short impacts (punches, kicks): 0.5-1.5 seconds
- Footsteps: 0.5-1.0 seconds
- Jumps/movements: 1.0-2.0 seconds
- Ambient/mechanical loops: 2.0-10.0 seconds
- Use `null` for auto-duration when unsure

**Prompt Influence:**
- **0.5-0.7:** Predictable, consistent results (recommended for combat, UI)
- **0.3-0.4:** Balanced variation (recommended for movement, ambient)
- **0.1-0.2:** Creative variation (use sparingly)

**Output Format:**
- Recommended: `mp3_44100_96` (balance of quality and file size for mobile)
- Alternative: `mp3_44100_64` (lighter for simple SFX)

### API Configuration

```python
from elevenlabs.client import ElevenLabs

client = ElevenLabs(api_key="YOUR_API_KEY")

result = client.text_to_sound_effects.convert(
    text="Your prompt here",
    duration_seconds=1.5,  # or null for auto
    prompt_influence=0.5,
    # Returns 4 variations per request
)
```

---

## SECTION 1: GENERAL COMBAT SFX
**Source:** audio-specifications.md (SFX-COMBAT-001 through SFX-COMBAT-024)
**Directory:** `/assets/audio/combat/general/`

### SFX-COMBAT-001: Light Punch (Whiff)
```json
{
  "id": "SFX-COMBAT-001",
  "filename": "combat/general/sfx-combat-001_light-punch-whiff.mp3",
  "prompt": "Quick whoosh of fist moving through air, light punch swing, fast martial arts strike sound effect",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "SF2-style light attack whoosh"
}
```

### SFX-COMBAT-002: Medium Punch (Whiff)
```json
{
  "id": "SFX-COMBAT-002",
  "filename": "combat/general/sfx-combat-002_medium-punch-whiff.mp3",
  "prompt": "Stronger whoosh of fist cutting through air, medium force punch swing, martial arts attack sound",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "More force than light punch"
}
```

### SFX-COMBAT-003: Heavy Punch (Whiff)
```json
{
  "id": "SFX-COMBAT-003",
  "filename": "combat/general/sfx-combat-003_heavy-punch-whiff.mp3",
  "prompt": "Powerful whoosh with wind-up, heavy punch swing through air, strong martial arts strike sound effect",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Maximum power whoosh"
}
```

### SFX-COMBAT-004: Light Kick (Whiff)
```json
{
  "id": "SFX-COMBAT-004",
  "filename": "combat/general/sfx-combat-004_light-kick-whiff.mp3",
  "prompt": "Swift kick whoosh, leg cutting through air, quick karate kick sound effect",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Light kick whoosh"
}
```

### SFX-COMBAT-005: Medium Kick (Whiff)
```json
{
  "id": "SFX-COMBAT-005",
  "filename": "combat/general/sfx-combat-005_medium-kick-whiff.mp3",
  "prompt": "Moderate kick whoosh, leg sweeping through air, mid-level martial arts kick sound",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Medium force kick"
}
```

### SFX-COMBAT-006: Heavy Kick (Whiff)
```json
{
  "id": "SFX-COMBAT-006",
  "filename": "combat/general/sfx-combat-006_heavy-kick-whiff.mp3",
  "prompt": "Powerful kick whoosh with spin, heavy roundhouse kick through air, forceful martial arts attack",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Maximum power kick whoosh"
}
```

### SFX-COMBAT-007: Hit Connect (Light)
```json
{
  "id": "SFX-COMBAT-007",
  "filename": "combat/general/sfx-combat-007_hit-connect-light.mp3",
  "prompt": "Light impact sound, quick punch connecting with body, sharp thud of hit landing, Street Fighter style",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Satisfying light hit confirm"
}
```

### SFX-COMBAT-008: Hit Connect (Medium)
```json
{
  "id": "SFX-COMBAT-008",
  "filename": "combat/general/sfx-combat-008_hit-connect-medium.mp3",
  "prompt": "Solid impact sound, meaty punch hitting body, strong thud of martial arts strike connecting",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "SF2-style meaty hit"
}
```

### SFX-COMBAT-009: Hit Connect (Heavy)
```json
{
  "id": "SFX-COMBAT-009",
  "filename": "combat/general/sfx-combat-009_hit-connect-heavy.mp3",
  "prompt": "Devastating impact with deep crunch, powerful punch landing hard, bone-crushing hit sound effect",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Maximum impact, screen shake worthy"
}
```

### SFX-COMBAT-010: Block Sound
```json
{
  "id": "SFX-COMBAT-010",
  "filename": "combat/general/sfx-combat-010_block.mp3",
  "prompt": "Defensive block sound, attack deflected by guard, sharp protective shield impact, martial arts defense",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "SF2 guard sound"
}
```

### SFX-COMBAT-011: Damage Taken (Light)
```json
{
  "id": "SFX-COMBAT-011",
  "filename": "combat/general/sfx-combat-011_damage-light.mp3",
  "prompt": "Light damage reaction, soft impact on body, subtle pain sound, character taking minor hit",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Accompanies light hit grunt VO"
}
```

### SFX-COMBAT-012: Damage Taken (Heavy)
```json
{
  "id": "SFX-COMBAT-012",
  "filename": "combat/general/sfx-combat-012_damage-heavy.mp3",
  "prompt": "Heavy damage impact, significant body hit sound, painful strike landing, character taking major damage",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Accompanies heavy hit grunt VO"
}
```

### SFX-COMBAT-013: Jump
```json
{
  "id": "SFX-COMBAT-013",
  "filename": "combat/general/sfx-combat-013_jump.mp3",
  "prompt": "Upward whoosh of character jumping, lift-off sound effect, martial arts leap into air",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "SF2 jump mechanic"
}
```

### SFX-COMBAT-014: Land
```json
{
  "id": "SFX-COMBAT-014",
  "filename": "combat/general/sfx-combat-014_land.mp3",
  "prompt": "Impact landing thud, feet hitting ground after jump, weight dropping down, solid foley",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Landing after jump"
}
```

### SFX-COMBAT-015: Walk/Step
```json
{
  "id": "SFX-COMBAT-015",
  "filename": "combat/general/sfx-combat-015_footstep.mp3",
  "prompt": "Single footstep on training floor, rhythmic step sound, martial arts dojo footstep foley",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Generic footstep, per step"
}
```

### SFX-COMBAT-016: Combo Hit
```json
{
  "id": "SFX-COMBAT-016",
  "filename": "combat/general/sfx-combat-016_combo-hit.mp3",
  "prompt": "Rapid-fire hit impact, multiple strikes in quick succession, combo counter sound, escalating impacts",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Per hit in combo sequence"
}
```

### SFX-COMBAT-017: Counter Hit
```json
{
  "id": "SFX-COMBAT-017",
  "filename": "combat/general/sfx-combat-017_counter-hit.mp3",
  "prompt": "Special counter impact with sparkle effect, precision timing strike, critical hit sound with shimmer",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Extra satisfying, precision counter"
}
```

### ~~SFX-COMBAT-018: Round Start "FIGHT!"~~ *(EXCLUDED - Use Voice Changer)*
**Note:** This announcer vocalization will be created separately using voice changer software.

### ~~SFX-COMBAT-019: Round End "K.O.!"~~ *(EXCLUDED - Use Voice Changer)*
**Note:** This announcer vocalization will be created separately using voice changer software.

### ~~SFX-COMBAT-020: Round End "Time Up!"~~ *(EXCLUDED - Use Voice Changer)*
**Note:** This announcer vocalization will be created separately using voice changer software.

### SFX-COMBAT-021: Energy Meter Deplete
```json
{
  "id": "SFX-COMBAT-021",
  "filename": "combat/general/sfx-combat-021_energy-deplete.mp3",
  "prompt": "Power-down sound, energy draining effect, mechanical energy loss, descending electronic tone",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Energy meter warning"
}
```

### SFX-COMBAT-022: Energy Meter Recharge
```json
{
  "id": "SFX-COMBAT-022",
  "filename": "combat/general/sfx-combat-022_energy-recharge.mp3",
  "prompt": "Power-up sound, energy recharging effect, positive restoration tone, ascending electronic charge",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Energy restoration feedback"
}
```

### SFX-COMBAT-023: Low Energy Warning
```json
{
  "id": "SFX-COMBAT-023",
  "filename": "combat/general/sfx-combat-023_low-energy-warning.mp3",
  "prompt": "Pulsing alert tone, urgent warning beep, critical energy alarm, repeating danger signal",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Loops every 2 seconds when energy <10%"
}
```

### SFX-COMBAT-024: Insufficient Energy
```json
{
  "id": "SFX-COMBAT-024",
  "filename": "combat/general/sfx-combat-024_insufficient-energy.mp3",
  "prompt": "Error buzz, denied action sound, negative feedback beep, insufficient resource alert",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Action denied feedback"
}
```

---

## SECTION 2: CHARACTER-SPECIFIC SFX - SEAN
**Source:** character-audio-assets.md (SFX-CHAR-SEAN-001 through 004)
**Directory:** `/assets/audio/combat-characters/sean/sfx/`

### SFX-CHAR-SEAN-001: Footstep Sound
```json
{
  "id": "SFX-CHAR-SEAN-001",
  "filename": "combat-characters/sean/sfx/sfx-char-sean-001_footstep.mp3",
  "prompt": "Athletic sneaker step on training floor, clean crisp footstep with slight squeak, gym floor foley",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Sean's athletic sneaker step"
}
```

### SFX-CHAR-SEAN-002: Jump Whoosh
```json
{
  "id": "SFX-CHAR-SEAN-002",
  "filename": "combat-characters/sean/sfx/sfx-char-sean-002_jump-whoosh.mp3",
  "prompt": "Clean upward whoosh during jump, athletic leap through air, balanced fighter ascending",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Sean's jump sound"
}
```

### SFX-CHAR-SEAN-003: Land Thud
```json
{
  "id": "SFX-CHAR-SEAN-003",
  "filename": "combat-characters/sean/sfx/sfx-char-sean-003_land-thud.mp3",
  "prompt": "Solid athletic landing, controlled impact on ground, balanced fighter landing foley",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Sean landing after jump"
}
```

### SFX-CHAR-SEAN-004: Fireball Projectile
```json
{
  "id": "SFX-CHAR-SEAN-004",
  "filename": "combat-characters/sean/sfx/sfx-char-sean-004_fireball-projectile.mp3",
  "prompt": "Energy projectile sound, Street Fighter style hadouken, 8-bit energy wave traveling across screen",
  "duration_seconds": 0.8,
  "prompt_influence": 0.7,
  "notes": "Fitness Fireball special move"
}
```

---

## SECTION 3: CHARACTER-SPECIFIC SFX - MARY
**Source:** character-audio-assets.md (SFX-CHAR-MARY-001 through 005)
**Directory:** `/assets/audio/combat-characters/mary/sfx/`

### SFX-CHAR-MARY-001: Footstep Sound
```json
{
  "id": "SFX-CHAR-MARY-001",
  "filename": "combat-characters/mary/sfx/sfx-char-mary-001_footstep.mp3",
  "prompt": "Light quick sneaker step with bounce, rapid bouncy footstep, energetic light step foley",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Mary's light, bouncy step"
}
```

### SFX-CHAR-MARY-002: Jump Whoosh
```json
{
  "id": "SFX-CHAR-MARY-002",
  "filename": "combat-characters/mary/sfx/sfx-char-mary-002_jump-whoosh.mp3",
  "prompt": "High-pitched air whoosh during quick jump, light upward leap sound, energetic bounce",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Mary's quick jump"
}
```

### SFX-CHAR-MARY-003: Land Thud
```json
{
  "id": "SFX-CHAR-MARY-003",
  "filename": "combat-characters/mary/sfx/sfx-char-mary-003_land-thud.mp3",
  "prompt": "Light landing impact, quick controlled landing, lighter footstep on ground foley",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Mary landing after jump"
}
```

### SFX-CHAR-MARY-004: Dash Rush Sound
```json
{
  "id": "SFX-CHAR-MARY-004",
  "filename": "combat-characters/mary/sfx/sfx-char-mary-004_dash-rush.mp3",
  "prompt": "Rapid whooshing with multiple impact points, multi-hit dash attack, fast movement with striking sounds",
  "duration_seconds": 1.0,
  "prompt_influence": 0.7,
  "notes": "Cardio Rush special move"
}
```

### SFX-CHAR-MARY-005: Glove Impact (Unique)
```json
{
  "id": "SFX-CHAR-MARY-005",
  "filename": "combat-characters/mary/sfx/sfx-char-mary-005_glove-impact.mp3",
  "prompt": "Boxing glove impact sound, padded punch landing, quick recovery thud, lighter than bare fist",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Mary's unique glove punch sound"
}
```

---

## SECTION 4: CHARACTER-SPECIFIC SFX - MARCUS
**Source:** character-audio-assets.md (SFX-CHAR-MARCUS-001 through 005)
**Directory:** `/assets/audio/combat-characters/marcus/sfx/`

### SFX-CHAR-MARCUS-001: Footstep Sound
```json
{
  "id": "SFX-CHAR-MARCUS-001",
  "filename": "combat-characters/marcus/sfx/sfx-char-marcus-001_footstep.mp3",
  "prompt": "Heavy powerful footstep, solid deliberate step with weight, heavyweight fighter walking foley",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Marcus's heavy step"
}
```

### SFX-CHAR-MARCUS-002: Jump Whoosh
```json
{
  "id": "SFX-CHAR-MARCUS-002",
  "filename": "combat-characters/marcus/sfx/sfx-char-marcus-002_jump-whoosh.mp3",
  "prompt": "Short controlled jump whoosh, heavyweight staying grounded, minimal air time leap",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Marcus's rare jump"
}
```

### SFX-CHAR-MARCUS-003: Land Thud
```json
{
  "id": "SFX-CHAR-MARCUS-003",
  "filename": "combat-characters/marcus/sfx/sfx-char-marcus-003_land-thud.mp3",
  "prompt": "Heavy landing impact, ground shakes, solid heavyweight boxer landing with force",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Marcus landing after jump"
}
```

### SFX-CHAR-MARCUS-004: Uppercut Wind-Up
```json
{
  "id": "SFX-CHAR-MARCUS-004",
  "filename": "combat-characters/marcus/sfx/sfx-char-marcus-004_uppercut-windup.mp3",
  "prompt": "Charging energy for powerful uppercut, building power with deep rumble, energy gathering sound",
  "duration_seconds": 0.6,
  "prompt_influence": 0.7,
  "notes": "Champion Uppercut charge"
}
```

### SFX-CHAR-MARCUS-005: Glove Impact (Unique)
```json
{
  "id": "SFX-CHAR-MARCUS-005",
  "filename": "combat-characters/marcus/sfx/sfx-char-marcus-005_glove-impact.mp3",
  "prompt": "Heavy boxing glove impact, devastating punch landing, deep meaty thud of golden gloves striking",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Marcus's powerful glove punch"
}
```

---

## SECTION 5: CHARACTER-SPECIFIC SFX - ARIA
**Source:** character-audio-assets.md (SFX-CHAR-ARIA-001 through 005)
**Directory:** `/assets/audio/combat-characters/aria/sfx/`

### SFX-CHAR-ARIA-001: Footstep Sound
```json
{
  "id": "SFX-CHAR-ARIA-001",
  "filename": "combat-characters/aria/sfx/sfx-char-aria-001_footstep.mp3",
  "prompt": "Gliding dance-like footstep, smooth flowing step, cat-like graceful movement foley",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Aria's graceful step"
}
```

### SFX-CHAR-ARIA-002: Jump Whoosh
```json
{
  "id": "SFX-CHAR-ARIA-002",
  "filename": "combat-characters/aria/sfx/sfx-char-aria-002_jump-whoosh.mp3",
  "prompt": "Graceful high leap whoosh, extended air time jump, flowing arc through air, dancer's leap",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Aria's graceful jump"
}
```

### SFX-CHAR-ARIA-003: Land Thud
```json
{
  "id": "SFX-CHAR-ARIA-003",
  "filename": "combat-characters/aria/sfx/sfx-char-aria-003_land-thud.mp3",
  "prompt": "Soft controlled landing, graceful dancer landing barely making sound, light foley impact",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Aria landing after jump"
}
```

### SFX-CHAR-ARIA-004: Spin Attack Whoosh
```json
{
  "id": "SFX-CHAR-ARIA-004",
  "filename": "combat-characters/aria/sfx/sfx-char-aria-004_spin-attack.mp3",
  "prompt": "Multi-hit spinning attack sound, rhythmic whooshes with dance-like cadence, flowing rotation impacts",
  "duration_seconds": 0.9,
  "prompt_influence": 0.7,
  "notes": "Rhythm Strike special move"
}
```

### SFX-CHAR-ARIA-005: Hair Whoosh (Unique)
```json
{
  "id": "SFX-CHAR-ARIA-005",
  "filename": "combat-characters/aria/sfx/sfx-char-aria-005_hair-whoosh.mp3",
  "prompt": "Ponytail swishing during spin, flowing hair swoosh sound, signature graceful movement detail",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Aria's signature hair detail"
}
```

---

## SECTION 6: CHARACTER-SPECIFIC SFX - KENJI
**Source:** character-audio-assets.md (SFX-CHAR-KENJI-001 through 005)
**Directory:** `/assets/audio/combat-characters/kenji/sfx/`

### SFX-CHAR-KENJI-001: Footstep Sound
```json
{
  "id": "SFX-CHAR-KENJI-001",
  "filename": "combat-characters/kenji/sfx/sfx-char-kenji-001_footstep.mp3",
  "prompt": "Measured disciplined footstep, traditional martial arts step, controlled karate movement foley",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Kenji's traditional step"
}
```

### SFX-CHAR-KENJI-002: Jump Whoosh
```json
{
  "id": "SFX-CHAR-KENJI-002",
  "filename": "combat-characters/kenji/sfx/sfx-char-kenji-002_jump-whoosh.mp3",
  "prompt": "Controlled perfect form leap, traditional martial arts jump with precise technique, disciplined air movement",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Kenji's controlled jump"
}
```

### SFX-CHAR-KENJI-003: Land Thud
```json
{
  "id": "SFX-CHAR-KENJI-003",
  "filename": "combat-characters/kenji/sfx/sfx-char-kenji-003_land-thud.mp3",
  "prompt": "Balanced solid landing, perfect martial arts form impact, controlled karate landing foley",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Kenji landing after jump"
}
```

### SFX-CHAR-KENJI-004: Dragon Fist Uppercut
```json
{
  "id": "SFX-CHAR-KENJI-004",
  "filename": "combat-characters/kenji/sfx/sfx-char-kenji-004_dragon-fist.mp3",
  "prompt": "Rising dragon uppercut energy sound, Street Fighter Shoryuken style, invincible rising attack with energy trail",
  "duration_seconds": 0.7,
  "prompt_influence": 0.7,
  "notes": "Rising Dragon Fist special move"
}
```

### SFX-CHAR-KENJI-005: Gi Fabric Whoosh (Unique)
```json
{
  "id": "SFX-CHAR-KENJI-005",
  "filename": "combat-characters/kenji/sfx/sfx-char-kenji-005_gi-whoosh.mp3",
  "prompt": "Traditional karate gi fabric flapping during attack, martial arts uniform rustling, cloth whoosh sound",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Kenji's gi fabric sound"
}
```

---

## SECTION 7: CHARACTER-SPECIFIC SFX - ZARA
**Source:** character-audio-assets.md (SFX-CHAR-ZARA-001 through 005)
**Directory:** `/assets/audio/combat-characters/zara/sfx/`

### SFX-CHAR-ZARA-001: Footstep Sound
```json
{
  "id": "SFX-CHAR-ZARA-001",
  "filename": "combat-characters/zara/sfx/sfx-char-zara-001_footstep.mp3",
  "prompt": "Powerful confident footstep, strong aggressive step with authority, MMA fighter walking foley",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Zara's powerful step"
}
```

### SFX-CHAR-ZARA-002: Jump Whoosh
```json
{
  "id": "SFX-CHAR-ZARA-002",
  "filename": "combat-characters/zara/sfx/sfx-char-zara-002_jump-whoosh.mp3",
  "prompt": "Explosive leap whoosh, powerful upward burst showing strength, aggressive jump sound",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Zara's explosive jump"
}
```

### SFX-CHAR-ZARA-003: Land Thud
```json
{
  "id": "SFX-CHAR-ZARA-003",
  "filename": "combat-characters/zara/sfx/sfx-char-zara-003_land-thud.mp3",
  "prompt": "Heavy solid landing impact, strong impact ready to explode, powerful fighter landing foley",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Zara landing after jump"
}
```

### SFX-CHAR-ZARA-004: Charging Tackle Rush
```json
{
  "id": "SFX-CHAR-ZARA-004",
  "filename": "combat-characters/zara/sfx/sfx-char-zara-004_tackle-rush.mp3",
  "prompt": "Shoulder tackle charging attack, rumbling charge with unstoppable momentum, powerful rush sound",
  "duration_seconds": 1.0,
  "prompt_influence": 0.7,
  "notes": "Power Surge special move"
}
```

### SFX-CHAR-ZARA-005: Muscle Flex (Unique)
```json
{
  "id": "SFX-CHAR-ZARA-005",
  "filename": "combat-characters/zara/sfx/sfx-char-zara-005_muscle-flex.mp3",
  "prompt": "Powerful muscle flex sound, intimidating champion flex, strong presence effect",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Zara's victory flex"
}
```

---

## SECTION 8: BOSS SFX - TRAINING DUMMY
**Source:** character-audio-assets.md (SFX-BOSS-DUMMY-001 through 007)
**Directory:** `/assets/audio/bosses/training-dummy/sfx/`

### SFX-BOSS-DUMMY-001: Mechanical Creak (Idle)
```json
{
  "id": "SFX-BOSS-DUMMY-001",
  "filename": "bosses/training-dummy/sfx/sfx-boss-dummy-001_creak.mp3",
  "prompt": "Wooden joints creaking, rhythmic mechanical creaking sound, slightly squeaky hinges, training dummy idle",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Training Dummy idle animation"
}
```

### SFX-BOSS-DUMMY-002: Wood Clatter (Hit Taken)
```json
{
  "id": "SFX-BOSS-DUMMY-002",
  "filename": "bosses/training-dummy/sfx/sfx-boss-dummy-002_wood-clatter.mp3",
  "prompt": "Hollow wooden impact, wood blocks colliding sound, distinct training dummy hit, different from flesh impact",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Training Dummy takes damage"
}
```

### SFX-BOSS-DUMMY-003: Spring Boing (Stunned)
```json
{
  "id": "SFX-BOSS-DUMMY-003",
  "filename": "bosses/training-dummy/sfx/sfx-boss-dummy-003_spring-boing.mp3",
  "prompt": "Metal springs bouncing, comedic spring sound, mechanical malfunction, bouncy coil effect",
  "duration_seconds": 0.6,
  "prompt_influence": 0.7,
  "notes": "Training Dummy stunned state"
}
```

### SFX-BOSS-DUMMY-004: Dummy Spin (Attack)
```json
{
  "id": "SFX-BOSS-DUMMY-004",
  "filename": "bosses/training-dummy/sfx/sfx-boss-dummy-004_spin.mp3",
  "prompt": "Rotating wooden limbs, whooshing wood with rhythmic clunks, spinning training dummy attack sound",
  "duration_seconds": 0.8,
  "prompt_influence": 0.7,
  "notes": "Practice Mode Spin attack"
}
```

### SFX-BOSS-DUMMY-005: Bolt Rattle (Rage Mode)
```json
{
  "id": "SFX-BOSS-DUMMY-005",
  "filename": "bosses/training-dummy/sfx/sfx-boss-dummy-005_bolt-rattle.mp3",
  "prompt": "Loose bolts rattling, metallic rattling and mechanical stress, unstable construction sound",
  "duration_seconds": 1.0,
  "prompt_influence": 0.7,
  "notes": "Training Dummy rage mode (loops)"
}
```

### SFX-BOSS-DUMMY-006: Sawdust Puff (Defeat)
```json
{
  "id": "SFX-BOSS-DUMMY-006",
  "filename": "bosses/training-dummy/sfx/sfx-boss-dummy-006_sawdust-puff.mp3",
  "prompt": "Puff of sawdust and wood settling, soft air puff with wooden pieces falling, collapse sound",
  "duration_seconds": 0.8,
  "prompt_influence": 0.7,
  "notes": "Training Dummy collapses"
}
```

### SFX-BOSS-DUMMY-007: Power Down Hum (Defeat End)
```json
{
  "id": "SFX-BOSS-DUMMY-007",
  "filename": "bosses/training-dummy/sfx/sfx-boss-dummy-007_power-down.mp3",
  "prompt": "Mechanical power-down sound, descending electrical hum, machine shutting off, slow wind-down",
  "duration_seconds": 1.2,
  "prompt_influence": 0.7,
  "notes": "Training Dummy final defeat"
}
```

---

## SECTION 9: BOSS SFX - PROCRASTINATION PHANTOM
**Source:** character-audio-assets.md (SFX-BOSS-PHANTOM-001 through 006)
**Directory:** `/assets/audio/bosses/procrastination-phantom/sfx/`

### SFX-BOSS-PHANTOM-001: Ghostly Whoosh (Movement)
```json
{
  "id": "SFX-BOSS-PHANTOM-001",
  "filename": "bosses/procrastination-phantom/sfx/sfx-boss-phantom-001_whoosh.mp3",
  "prompt": "Spectral swoosh, ethereal wind sound, supernatural movement, ghostly presence whoosh",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Phantom movement"
}
```

### ~~SFX-BOSS-PHANTOM-002: Reluctant Sigh (Idle)~~ *(EXCLUDED - Use Voice Changer)*
**Note:** This vocalization will be created separately using voice changer software.

### ~~SFX-BOSS-PHANTOM-003: Lazy Moan (Hit Taken)~~ *(EXCLUDED - Use Voice Changer)*
**Note:** This vocalization will be created separately using voice changer software.

### SFX-BOSS-PHANTOM-004: Spectral Projectile
```json
{
  "id": "SFX-BOSS-PHANTOM-004",
  "filename": "bosses/procrastination-phantom/sfx/sfx-boss-phantom-004_projectile.mp3",
  "prompt": "Ghostly energy ball traveling, ethereal whoosh with echo, supernatural projectile sound",
  "duration_seconds": 1.0,
  "prompt_influence": 0.7,
  "notes": "Phantom special attack"
}
```

### SFX-BOSS-PHANTOM-005: Frustrated Flail (Rage Mode)
```json
{
  "id": "SFX-BOSS-PHANTOM-005",
  "filename": "bosses/procrastination-phantom/sfx/sfx-boss-phantom-005_flail.mp3",
  "prompt": "Annoyed ghostly energy, frustrated supernatural sounds with chaotic movement, irritated spirit",
  "duration_seconds": 0.8,
  "prompt_influence": 0.7,
  "notes": "Phantom rage mode"
}
```

### SFX-BOSS-PHANTOM-006: Giving Up (Defeat)
```json
{
  "id": "SFX-BOSS-PHANTOM-006",
  "filename": "bosses/procrastination-phantom/sfx/sfx-boss-phantom-006_defeat.mp3",
  "prompt": "Complete surrender, ghostly sigh fading to nothing, spectral disappearance, giving up entirely",
  "duration_seconds": 1.5,
  "prompt_influence": 0.7,
  "notes": "Phantom defeated"
}
```

---

## SECTION 10: BOSS SFX - SLOTH DEMON
**Source:** character-audio-assets.md (SFX-BOSS-SLOTH-001 through 007)
**Directory:** `/assets/audio/bosses/sloth-demon/sfx/`

### SFX-BOSS-SLOTH-001: Deep Breathing (Idle)
```json
{
  "id": "SFX-BOSS-SLOTH-001",
  "filename": "bosses/sloth-demon/sfx/sfx-boss-sloth-001_breathing.mp3",
  "prompt": "Slow heavy breathing, deep drowsy breaths from massive lungs, tired creature inhale and exhale",
  "duration_seconds": 2.0,
  "prompt_influence": 0.7,
  "notes": "Sloth Demon idle (slow cycle)"
}
```

### ~~SFX-BOSS-SLOTH-002: Heavy Grunt (Hit Taken)~~ *(EXCLUDED - Use Voice Changer)*
**Note:** This vocalization will be created separately using voice changer software.

### SFX-BOSS-SLOTH-003: Massive Thud (Movement)
```json
{
  "id": "SFX-BOSS-SLOTH-003",
  "filename": "bosses/sloth-demon/sfx/sfx-boss-sloth-003_thud.mp3",
  "prompt": "Heavy footstep or knuckle impact, ground-shaking weight, massive creature movement foley",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Sloth walks/moves"
}
```

### ~~SFX-BOSS-SLOTH-004: Yawn (Stunned)~~ *(EXCLUDED - Use Voice Changer)*
**Note:** This vocalization will be created separately using voice changer software.

### SFX-BOSS-SLOTH-005: Ground Pound (Attack)
```json
{
  "id": "SFX-BOSS-SLOTH-005",
  "filename": "bosses/sloth-demon/sfx/sfx-boss-sloth-005_ground-pound.mp3",
  "prompt": "Massive impact, entire body weight falling, shockwave ground pound, earthquake-like thud",
  "duration_seconds": 0.8,
  "prompt_influence": 0.7,
  "notes": "Sloth ground pound attack"
}
```

### SFX-BOSS-SLOTH-006: Chest Beat (Rage Mode)
```json
{
  "id": "SFX-BOSS-SLOTH-006",
  "filename": "bosses/sloth-demon/sfx/sfx-boss-sloth-006_chest-beat.mp3",
  "prompt": "Gorilla-like chest beating, deep thumps on chest, slow but powerful percussion",
  "duration_seconds": 1.0,
  "prompt_influence": 0.7,
  "notes": "Sloth rage mode"
}
```

### SFX-BOSS-SLOTH-007: Sleep Snore (Defeat)
```json
{
  "id": "SFX-BOSS-SLOTH-007",
  "filename": "bosses/sloth-demon/sfx/sfx-boss-sloth-007_snore.mp3",
  "prompt": "Deep rumbling snore, creature immediately falling asleep, heavy breathing with snoring sound",
  "duration_seconds": 2.0,
  "prompt_influence": 0.7,
  "notes": "Sloth defeated, falls asleep"
}
```

---

## SECTION 11: BOSS SFX - GYM BULLY
**Source:** character-audio-assets.md (SFX-BOSS-BULLY-001 through 007)
**Directory:** `/assets/audio/bosses/gym-bully/sfx/`

### SFX-BOSS-BULLY-001: Knuckle Crack (Idle)
```json
{
  "id": "SFX-BOSS-BULLY-001",
  "filename": "bosses/gym-bully/sfx/sfx-boss-bully-001_knuckle-crack.mp3",
  "prompt": "Cocky knuckle cracking, multiple finger cracks, intimidating hand sound, aggressive preparation",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Gym Bully idle animation"
}
```

### ~~SFX-BOSS-BULLY-002: Cocky Laugh (Taunt)~~ *(EXCLUDED - Use Voice Changer)*
**Note:** This vocalization will be created separately using voice changer software.

### ~~SFX-BOSS-BULLY-003: Angry Grunt (Hit Taken)~~ *(EXCLUDED - Use Voice Changer)*
**Note:** This vocalization will be created separately using voice changer software.

### SFX-BOSS-BULLY-004: Muscle Flex (Attack)
```json
{
  "id": "SFX-BOSS-BULLY-004",
  "filename": "bosses/gym-bully/sfx/sfx-boss-bully-004_flex.mp3",
  "prompt": "Flexing muscle before explosive punch, muscle tense sound then explosive release, power buildup",
  "duration_seconds": 0.6,
  "prompt_influence": 0.7,
  "notes": "Gym Bully flex taunt attack"
}
```

### SFX-BOSS-BULLY-005: Veins Bulging (Rage Mode)
```json
{
  "id": "SFX-BOSS-BULLY-005",
  "filename": "bosses/gym-bully/sfx/sfx-boss-bully-005_veins-bulge.mp3",
  "prompt": "Extreme anger, veins popping sound, intense straining with fury building, explosive rage",
  "duration_seconds": 1.0,
  "prompt_influence": 0.7,
  "notes": "Gym Bully rage mode"
}
```

### SFX-BOSS-BULLY-006: Ego Shatter (Stunned)
```json
{
  "id": "SFX-BOSS-BULLY-006",
  "filename": "bosses/gym-bully/sfx/sfx-boss-bully-006_ego-shatter.mp3",
  "prompt": "Confusion and disbelief, sunglasses falling askew, ego breaking sound effect, stunned reaction",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Gym Bully stunned state"
}
```

### SFX-BOSS-BULLY-007: Collapse (Defeat)
```json
{
  "id": "SFX-BOSS-BULLY-007",
  "filename": "bosses/gym-bully/sfx/sfx-boss-bully-007_collapse.mp3",
  "prompt": "Falls to knees heavily, can't believe defeat, heavy fall with ego destroyed sound",
  "duration_seconds": 1.2,
  "prompt_influence": 0.7,
  "notes": "Gym Bully defeated"
}
```

---

## SECTION 12: BOSS SFX - STRESS TITAN
**Source:** character-audio-assets.md (SFX-BOSS-TITAN-001 through 007)
**Directory:** `/assets/audio/bosses/stress-titan/sfx/`

### SFX-BOSS-TITAN-001: Energy Crackle (Idle)
```json
{
  "id": "SFX-BOSS-TITAN-001",
  "filename": "bosses/stress-titan/sfx/sfx-boss-titan-001_crackle.mp3",
  "prompt": "Unstable electrical crackling, sparking energy barely contained, electrical discharge sound",
  "duration_seconds": 0.6,
  "prompt_influence": 0.7,
  "notes": "Stress Titan idle animation"
}
```

### SFX-BOSS-TITAN-002: Crack Widen (Hit Taken)
```json
{
  "id": "SFX-BOSS-TITAN-002",
  "filename": "bosses/stress-titan/sfx/sfx-boss-titan-002_crack-widen.mp3",
  "prompt": "Porcelain cracks spreading with sparks, glass cracking with electrical discharge, fracture expanding",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Stress Titan takes damage"
}
```

### SFX-BOSS-TITAN-003: Mechanical Jerk (Movement)
```json
{
  "id": "SFX-BOSS-TITAN-003",
  "filename": "bosses/stress-titan/sfx/sfx-boss-titan-003_mechanical-jerk.mp3",
  "prompt": "Jerky robotic movement, mechanical servos sparking, unstable robot motion foley",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Stress Titan walks/approaches"
}
```

### SFX-BOSS-TITAN-004: Energy Discharge (Attack)
```json
{
  "id": "SFX-BOSS-TITAN-004",
  "filename": "bosses/stress-titan/sfx/sfx-boss-titan-004_discharge.mp3",
  "prompt": "Explosive energy release punch, building electrical charge then explosive discharge, power surge attack",
  "duration_seconds": 0.7,
  "prompt_influence": 0.7,
  "notes": "Stress Titan energy attacks"
}
```

### SFX-BOSS-TITAN-005: System Overload (Rage Mode)
```json
{
  "id": "SFX-BOSS-TITAN-005",
  "filename": "bosses/stress-titan/sfx/sfx-boss-titan-005_overload.mp3",
  "prompt": "All systems overloading with smoking, multiple alarms, crackling intensifies, cracks glowing, critical meltdown",
  "duration_seconds": 1.2,
  "prompt_influence": 0.7,
  "notes": "Stress Titan rage mode"
}
```

### SFX-BOSS-TITAN-006: Glitch Flicker (Stunned)
```json
{
  "id": "SFX-BOSS-TITAN-006",
  "filename": "bosses/stress-titan/sfx/sfx-boss-titan-006_glitch.mp3",
  "prompt": "Systems failing and flickering, electrical glitching, power fluctuation, malfunctioning robot",
  "duration_seconds": 0.8,
  "prompt_influence": 0.7,
  "notes": "Stress Titan stunned state"
}
```

### SFX-BOSS-TITAN-007: Catastrophic Failure (Defeat)
```json
{
  "id": "SFX-BOSS-TITAN-007",
  "filename": "bosses/stress-titan/sfx/sfx-boss-titan-007_catastrophic-failure.mp3",
  "prompt": "Complete system collapse explosion, cracks exploding outward, massive energy discharge, robot falling apart",
  "duration_seconds": 2.0,
  "prompt_influence": 0.7,
  "notes": "Stress Titan defeated"
}
```

---

## SECTION 13: BOSS SFX - ULTIMATE SLUMP
**Source:** character-audio-assets.md (SFX-BOSS-SLUMP-001 through 007)
**Directory:** `/assets/audio/bosses/ultimate-slump/sfx/`

### ~~SFX-BOSS-SLUMP-001: Shallow Breathing (Idle)~~ *(EXCLUDED - Use Voice Changer)*
**Note:** This vocalization will be created separately using voice changer software.

### ~~SFX-BOSS-SLUMP-002: Weak Groan (Hit Taken)~~ *(EXCLUDED - Use Voice Changer)*
**Note:** This vocalization will be created separately using voice changer software.

### SFX-BOSS-SLUMP-003: Heavy Trudge (Movement)
```json
{
  "id": "SFX-BOSS-SLUMP-003",
  "filename": "bosses/ultimate-slump/sfx/sfx-boss-slump-003_trudge.mp3",
  "prompt": "Slow labored footsteps, dragging feet with effort visible, exhausted walking foley",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Ultimate Slump walks/approaches"
}
```

### SFX-BOSS-SLUMP-004: Desperate Haymaker (Attack)
```json
{
  "id": "SFX-BOSS-SLUMP-004",
  "filename": "bosses/ultimate-slump/sfx/sfx-boss-slump-004_haymaker.mp3",
  "prompt": "Wild poor form attack with effort, whoosh with exhausted grunt, desperate flailing punch",
  "duration_seconds": 0.8,
  "prompt_influence": 0.7,
  "notes": "Ultimate Slump desperate attacks"
}
```

### ~~SFX-BOSS-SLUMP-005: Gasping (Stunned)~~ *(EXCLUDED - Use Voice Changer)*
**Note:** This vocalization will be created separately using voice changer software.

### ~~SFX-BOSS-SLUMP-006: Red-Faced Rage (Rage Mode)~~ *(EXCLUDED - Use Voice Changer)*
**Note:** This vocalization will be created separately using voice changer software.

### SFX-BOSS-SLUMP-007: Complete Collapse (Defeat)
```json
{
  "id": "SFX-BOSS-SLUMP-007",
  "filename": "bosses/ultimate-slump/sfx/sfx-boss-slump-007_collapse.mp3",
  "prompt": "Falls flat completely spent, heavy exhausted fall, gives up entirely with final thud",
  "duration_seconds": 1.5,
  "prompt_influence": 0.7,
  "notes": "Ultimate Slump defeated"
}
```

---

## SECTION 14: UI SOUND EFFECTS
**Source:** audio-specifications.md (SFX-UI-001 through SFX-UI-016)
**Directory:** `/assets/audio/ui/`

### SFX-UI-001: Button Press (Primary)
```json
{
  "id": "SFX-UI-001",
  "filename": "ui/sfx-ui-001_button-press-primary.mp3",
  "prompt": "Standard 8-bit button press sound, satisfying click with Game Boy tactile feedback, retro UI confirm",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Primary CTA buttons"
}
```

### SFX-UI-002: Button Press (Secondary)
```json
{
  "id": "SFX-UI-002",
  "filename": "ui/sfx-ui-002_button-press-secondary.mp3",
  "prompt": "Lighter 8-bit button press, softer click less emphasized, subtle retro UI confirm",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Secondary buttons, tertiary links"
}
```

### SFX-UI-003: Card Select (Ascending Chime)
```json
{
  "id": "SFX-UI-003",
  "filename": "ui/sfx-ui-003_card-select.mp3",
  "prompt": "Upward 8-bit chime for positive selection, cheerful Pokemon-style menu select, ascending retro tone",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Card/archetype selection"
}
```

### SFX-UI-004: Card Deselect (Descending Blip)
```json
{
  "id": "SFX-UI-004",
  "filename": "ui/sfx-ui-004_card-deselect.mp3",
  "prompt": "Downward 8-bit blip for deselection, neutral not negative tone, descending retro sound",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Deselecting previous card"
}
```

### SFX-UI-005: Input Focus
```json
{
  "id": "SFX-UI-005",
  "filename": "ui/sfx-ui-005_input-focus.mp3",
  "prompt": "Subtle selection beep, quiet attention-grabbing tone, retro text input focus sound",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Text input fields receive focus"
}
```

### SFX-UI-006: Validation Error
```json
{
  "id": "SFX-UI-006",
  "filename": "ui/sfx-ui-006_validation-error.mp3",
  "prompt": "8-bit wrong buzzer, Street Fighter 2 style error tone, clear negative feedback not harsh",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Form validation errors"
}
```

### SFX-UI-007: Validation Success (Short)
```json
{
  "id": "SFX-UI-007",
  "filename": "ui/sfx-ui-007_validation-success.mp3",
  "prompt": "Quick success chime single note, rewarding positive tone, retro confirmation sound",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Quick success confirmations"
}
```

### SFX-UI-008: Success Fanfare
```json
{
  "id": "SFX-UI-008",
  "filename": "ui/sfx-ui-008_success-fanfare.mp3",
  "prompt": "8-bit melody celebrating major success, Pokemon achievement style fanfare, triumphant retro jingle",
  "duration_seconds": 0.8,
  "prompt_influence": 0.7,
  "notes": "Profile creation success"
}
```

### SFX-UI-009: Screen Transition Forward
```json
{
  "id": "SFX-UI-009",
  "filename": "ui/sfx-ui-009_transition-forward.mp3",
  "prompt": "Ascending 8-bit tone, page turn sound showing progress, forward navigation retro effect",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Forward navigation in flows"
}
```

### SFX-UI-010: Screen Transition Back
```json
{
  "id": "SFX-UI-010",
  "filename": "ui/sfx-ui-010_transition-back.mp3",
  "prompt": "Descending 8-bit tone, gentle return sound, back button navigation retro effect",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Back button navigation"
}
```

### SFX-UI-011: Loading Loop
```json
{
  "id": "SFX-UI-011",
  "filename": "ui/sfx-ui-011_loading-loop.mp3",
  "prompt": "Subtle 8-bit loading pulse, calm patient non-intrusive loop, retro processing sound",
  "duration_seconds": 2.0,
  "prompt_influence": 0.7,
  "notes": "Loading states (loops)"
}
```

### SFX-UI-012: Toast Appear
```json
{
  "id": "SFX-UI-012",
  "filename": "ui/sfx-ui-012_toast-appear.mp3",
  "prompt": "Quick notification pop sound, attention-grabbing but not alarming, retro toast slide in",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Toast notifications"
}
```

### SFX-UI-013: Tab Switch
```json
{
  "id": "SFX-UI-013",
  "filename": "ui/sfx-ui-013_tab-switch.mp3",
  "prompt": "Soft menu switch sound, clean organized tone, retro tab navigation click",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Bottom tab bar navigation"
}
```

### SFX-UI-014: Cartridge Load Animation
```json
{
  "id": "SFX-UI-014",
  "filename": "ui/sfx-ui-014_cartridge-load.mp3",
  "prompt": "Game Boy cartridge insertion sound, mechanical click with satisfying snap, nostalgic hardware simulation",
  "duration_seconds": 1.2,
  "prompt_influence": 0.7,
  "notes": "Battle mode entry transition"
}
```

### SFX-UI-015: Progress Ring Complete
```json
{
  "id": "SFX-UI-015",
  "filename": "ui/sfx-ui-015_progress-ring-complete.mp3",
  "prompt": "Celebration chime for ring completion, achievement unlocked style, rewarding retro fanfare",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Daily/weekly progress complete"
}
```

### SFX-UI-016: Streak Milestone
```json
{
  "id": "SFX-UI-016",
  "filename": "ui/sfx-ui-016_streak-milestone.mp3",
  "prompt": "Escalating chime sequence, increasingly celebratory tones, milestone achievement retro jingle",
  "duration_seconds": 0.7,
  "prompt_influence": 0.7,
  "notes": "Streak milestones (3, 7, 14, 30 days)"
}
```

---

## SECTION 15: PROGRESSION/EVOLUTION SFX
**Source:** audio-specifications.md (SFX-PROG-001 through SFX-PROG-010)
**Directory:** `/assets/audio/progression/`

### SFX-PROG-001: Avatar Evolution Start
```json
{
  "id": "SFX-PROG-001",
  "filename": "progression/sfx-prog-001_evolution-start.mp3",
  "prompt": "Magical transformation initiation, Pokemon evolution start sound, mystical building power",
  "duration_seconds": 2.0,
  "prompt_influence": 0.7,
  "notes": "Evolution ceremony begins"
}
```

### SFX-PROG-002: Avatar Evolution Complete
```json
{
  "id": "SFX-PROG-002",
  "filename": "progression/sfx-prog-002_evolution-complete.mp3",
  "prompt": "Triumphant transformation finale, Pokemon evolution complete sound, satisfying resolution jingle",
  "duration_seconds": 3.0,
  "prompt_influence": 0.7,
  "notes": "Evolution animation completes"
}
```

### SFX-PROG-003: Stat Increase
```json
{
  "id": "SFX-PROG-003",
  "filename": "progression/sfx-prog-003_stat-increase.mp3",
  "prompt": "Level-up style ascending tone, RPG stat boost sound, clear improvement chime",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Combat stats increase"
}
```

### SFX-PROG-004: Experience Gain
```json
{
  "id": "SFX-PROG-004",
  "filename": "progression/sfx-prog-004_experience-gain.mp3",
  "prompt": "Subtle points accumulation, rewarding progressive tone, experience points added",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Fitness activity contribution"
}
```

### SFX-PROG-005: Threshold Reached
```json
{
  "id": "SFX-PROG-005",
  "filename": "progression/sfx-prog-005_threshold-reached.mp3",
  "prompt": "Escalating alert milestone approaching, excitement building tone, threshold warning",
  "duration_seconds": 0.8,
  "prompt_influence": 0.7,
  "notes": "90% evolution progress"
}
```

### SFX-PROG-006: Workout Logged
```json
{
  "id": "SFX-PROG-006",
  "filename": "progression/sfx-prog-006_workout-logged.mp3",
  "prompt": "Confirmation beep with satisfaction, task complete positive tone, workout entry confirmed",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Manual workout entry"
}
```

### SFX-PROG-007: Daily Goal Complete
```json
{
  "id": "SFX-PROG-007",
  "filename": "progression/sfx-prog-007_daily-goal-complete.mp3",
  "prompt": "Achievement fanfare medium level, celebratory well done jingle, daily milestone reached",
  "duration_seconds": 1.0,
  "prompt_influence": 0.7,
  "notes": "Daily step goal reached"
}
```

### SFX-PROG-008: Weekly Goal Complete
```json
{
  "id": "SFX-PROG-008",
  "filename": "progression/sfx-prog-008_weekly-goal-complete.mp3",
  "prompt": "Achievement fanfare major level, epic celebration jingle, big milestone reached",
  "duration_seconds": 1.5,
  "prompt_influence": 0.7,
  "notes": "Weekly goals completed"
}
```

### SFX-PROG-009: Avatar Reaction Positive
```json
{
  "id": "SFX-PROG-009",
  "filename": "progression/sfx-prog-009_avatar-reaction-positive.mp3",
  "prompt": "Happy chirp, cute encouraging character acknowledgment, positive reaction sound",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Home avatar positive animation"
}
```

### SFX-PROG-010: Avatar Reaction Negative
```json
{
  "id": "SFX-PROG-010",
  "filename": "progression/sfx-prog-010_avatar-reaction-negative.mp3",
  "prompt": "Concerned sigh, gentle disappointment not harsh, motivational nudge sound",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Home avatar negative animation"
}
```

---

## SECTION 16: ACHIEVEMENT/REWARDS SFX
**Source:** audio-specifications.md (SFX-ACHIEVE-001 through SFX-ACHIEVE-007)
**Directory:** `/assets/audio/achievements/`

### SFX-ACHIEVE-001: Achievement Unlock
```json
{
  "id": "SFX-ACHIEVE-001",
  "filename": "achievements/sfx-achieve-001_unlock.mp3",
  "prompt": "Triumphant achievement fanfare, Xbox PlayStation style 8-bit unlock, celebration jingle",
  "duration_seconds": 1.2,
  "prompt_influence": 0.7,
  "notes": "Any achievement unlocked"
}
```

### SFX-ACHIEVE-002: First Battle Victory
```json
{
  "id": "SFX-ACHIEVE-002",
  "filename": "achievements/sfx-achieve-002_first-victory.mp3",
  "prompt": "Special extended victory theme, tutorial complete major milestone, triumphant jingle",
  "duration_seconds": 5.0,
  "prompt_influence": 0.7,
  "notes": "First boss defeat"
}
```

### SFX-ACHIEVE-003: Perfect Victory
```json
{
  "id": "SFX-ACHIEVE-003",
  "filename": "achievements/sfx-achieve-003_perfect-victory.mp3",
  "prompt": "Extra special victory theme, flawless performance ultimate satisfaction, perfect round jingle",
  "duration_seconds": 3.0,
  "prompt_influence": 0.7,
  "notes": "No damage taken victory"
}
```

### SFX-ACHIEVE-004: Streak Extended
```json
{
  "id": "SFX-ACHIEVE-004",
  "filename": "achievements/sfx-achieve-004_streak-extended.mp3",
  "prompt": "Building momentum sound, escalating excitement tone, streak continuation positive",
  "duration_seconds": 0.6,
  "prompt_influence": 0.7,
  "notes": "Daily activity streak continues"
}
```

### SFX-ACHIEVE-005: Streak Broken
```json
{
  "id": "SFX-ACHIEVE-005",
  "filename": "achievements/sfx-achieve-005_streak-broken.mp3",
  "prompt": "Disappointed loss sound not punishing, gentle letdown motivational tone, streak end",
  "duration_seconds": 0.8,
  "prompt_influence": 0.7,
  "notes": "Streak breaks"
}
```

### SFX-ACHIEVE-006: Character Unlock
```json
{
  "id": "SFX-ACHIEVE-006",
  "filename": "achievements/sfx-achieve-006_character-unlock.mp3",
  "prompt": "New character fanfare, Street Fighter 2 character select style, exciting new content jingle",
  "duration_seconds": 2.0,
  "prompt_influence": 0.7,
  "notes": "Combat character unlocked (post-MVP)"
}
```

### SFX-ACHIEVE-007: Boss Unlocked
```json
{
  "id": "SFX-ACHIEVE-007",
  "filename": "achievements/sfx-achieve-007_boss-unlocked.mp3",
  "prompt": "Ominous unlock sound, challenging content ahead dramatic tone, boss available fanfare",
  "duration_seconds": 2.5,
  "prompt_influence": 0.7,
  "notes": "Boss unlocked (post-MVP)"
}
```

---

## SECTION 17: HEALTH/FITNESS DATA SFX
**Source:** audio-specifications.md (SFX-HEALTH-001 through SFX-HEALTH-005)
**Directory:** `/assets/audio/health/`

### SFX-HEALTH-001: HealthKit Sync Start
```json
{
  "id": "SFX-HEALTH-001",
  "filename": "health/sfx-health-001_sync-start.mp3",
  "prompt": "Data transfer initiation, technical organized sound, sync beginning tone",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Health data sync begins"
}
```

### SFX-HEALTH-002: HealthKit Sync Complete
```json
{
  "id": "SFX-HEALTH-002",
  "filename": "health/sfx-health-002_sync-complete.mp3",
  "prompt": "Successful data transfer, smooth confirmation tone, sync complete sound",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Health data sync success"
}
```

### SFX-HEALTH-003: HealthKit Sync Error
```json
{
  "id": "SFX-HEALTH-003",
  "filename": "health/sfx-health-003_sync-error.mp3",
  "prompt": "Error alert needs attention, clear problem indicator, sync failure tone",
  "duration_seconds": 0.6,
  "prompt_influence": 0.7,
  "notes": "Health data sync fails"
}
```

### SFX-HEALTH-004: Step Goal Progress (25%)
```json
{
  "id": "SFX-HEALTH-004",
  "filename": "health/sfx-health-004_step-goal-progress.mp3",
  "prompt": "Subtle milestone chime, encouraging progress tone, quarter milestone reached",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "25%, 50%, 75% of daily steps"
}
```

### SFX-HEALTH-005: Real-Time Step Update
```json
{
  "id": "SFX-HEALTH-005",
  "filename": "health/sfx-health-005_step-update.mp3",
  "prompt": "Quiet tick sound, almost subliminal feedback, subtle step count update",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Real-time step count updates"
}
```

---

## SECTION 18: SYSTEM/SETTINGS SFX
**Source:** audio-specifications.md (SFX-SYS-001 through SFX-SYS-007)
**Directory:** `/assets/audio/system/`

### SFX-SYS-001: Settings Toggle On
```json
{
  "id": "SFX-SYS-001",
  "filename": "system/sfx-sys-001_toggle-on.mp3",
  "prompt": "Switch activation sound, positive enabled tone, toggle on click",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Settings toggle ON"
}
```

### SFX-SYS-002: Settings Toggle Off
```json
{
  "id": "SFX-SYS-002",
  "filename": "system/sfx-sys-002_toggle-off.mp3",
  "prompt": "Switch deactivation sound, neutral disabled tone, toggle off click",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Settings toggle OFF"
}
```

### SFX-SYS-003: Volume Adjustment
```json
{
  "id": "SFX-SYS-003",
  "filename": "system/sfx-sys-003_volume-adjust.mp3",
  "prompt": "Test tone for volume slider, simple reference beep, volume level indicator",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Volume slider adjustment"
}
```

### SFX-SYS-004: Logout Confirm
```json
{
  "id": "SFX-SYS-004",
  "filename": "system/sfx-sys-004_logout.mp3",
  "prompt": "Confirmation sound, final decisive tone, logout action confirmed",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "User logout confirmed"
}
```

### SFX-SYS-005: Account Deleted
```json
{
  "id": "SFX-SYS-005",
  "filename": "system/sfx-sys-005_account-deleted.mp3",
  "prompt": "Deletion confirmation, final permanent tone, destructive action complete",
  "duration_seconds": 0.8,
  "prompt_influence": 0.7,
  "notes": "Account deletion confirmed"
}
```

### SFX-SYS-006: Permission Granted
```json
{
  "id": "SFX-SYS-006",
  "filename": "system/sfx-sys-006_permission-granted.mp3",
  "prompt": "Access granted sound, welcoming positive tone, permission accepted",
  "duration_seconds": 0.6,
  "prompt_influence": 0.7,
  "notes": "HealthKit/notification permissions granted"
}
```

### SFX-SYS-007: Permission Denied
```json
{
  "id": "SFX-SYS-007",
  "filename": "system/sfx-sys-007_permission-denied.mp3",
  "prompt": "Access denied sound, blocked needs attention tone, permission rejected",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "User denies permissions"
}
```

---

## SECTION 19: AMBIENT/ENVIRONMENTAL SFX
**Source:** audio-specifications.md (SFX-AMB-001 through SFX-AMB-005)
**Directory:** `/assets/audio/ambient/`

### SFX-AMB-001: Menu Hover
```json
{
  "id": "SFX-AMB-001",
  "filename": "ambient/sfx-amb-001_menu-hover.mp3",
  "prompt": "Subtle selection hover, Pokemon menu cursor movement, quiet focus sound",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Hover over interactive elements"
}
```

### SFX-AMB-002: Idle Avatar Blink
```json
{
  "id": "SFX-AMB-002",
  "filename": "ambient/sfx-amb-002_avatar-blink.mp3",
  "prompt": "Soft character animation sound, cute lifelike blink, gentle eye close",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Home avatar idle blink"
}
```

### SFX-AMB-003: Weather Effect (Rain)
```json
{
  "id": "SFX-AMB-003",
  "filename": "ambient/sfx-amb-003_rain.mp3",
  "prompt": "8-bit rain atmosphere, calming background ambiance, retro weather loop",
  "duration_seconds": 5.0,
  "prompt_influence": 0.7,
  "notes": "Weather theme (optional, loops)"
}
```

### SFX-AMB-004: Quest Cartridge Pulse
```json
{
  "id": "SFX-AMB-004",
  "filename": "ambient/sfx-amb-004_cartridge-pulse.mp3",
  "prompt": "Glowing pulse sound, attention-grabbing available action, quest available indicator",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Quest button pulse (repeats every 3s)"
}
```

### SFX-AMB-005: Tutorial Hint
```json
{
  "id": "SFX-AMB-005",
  "filename": "ambient/sfx-amb-005_tutorial-hint.mp3",
  "prompt": "Helper notification sound, friendly reminder Pokemon Pokedex style, tutorial prompt tone",
  "duration_seconds": 0.5,
  "prompt_influence": 0.7,
  "notes": "Tutorial prompts appear"
}
```

---

## Summary Statistics

**Total SFX Assets for API Batch Generation:** 133 unique sound effects
**Excluded Voice/Grunt Assets:** 11 (will use voice changer separately)

**Breakdown by Category (API Batch Generation):**
- General Combat SFX: 21 assets (24 minus 3 announcer calls)
- Character-Specific SFX: 30 assets (6 characters × 4-5 each)
- Boss SFX: 34 assets (42 minus 8 boss vocalizations)
- UI SFX: 16 assets
- Progression/Evolution SFX: 10 assets
- Achievement/Rewards SFX: 7 assets
- Health/Fitness Data SFX: 5 assets
- System/Settings SFX: 7 assets
- Ambient/Environmental SFX: 5 assets

**Excluded Assets (Voice Changer):**
- Combat Announcer: SFX-COMBAT-018, 019, 020 (3 assets)
- Procrastination Phantom: SFX-BOSS-PHANTOM-002, 003 (2 assets)
- Sloth Demon: SFX-BOSS-SLOTH-002, 004 (2 assets)
- Gym Bully: SFX-BOSS-BULLY-002, 003 (2 assets)
- Ultimate Slump: SFX-BOSS-SLUMP-001, 002, 005, 006 (4 assets)

**MVP Priority (Sean, Mary, Training Dummy) - API Batch:**
- General Combat SFX: 21 assets (excluded 3 announcer calls)
- Sean Character SFX: 4 assets
- Mary Character SFX: 5 assets
- Training Dummy Boss SFX: 7 assets
- UI SFX: 16 assets (all)
- Progression SFX: 10 assets (all)
**MVP Total:** 63 assets (for API batch generation)

**Deferred to Phase 2+ - API Batch:**
- Marcus, Aria, Kenji, Zara Character SFX: 20 assets
- Remaining 5 bosses SFX: 27 assets (35 minus 8 excluded vocalizations)
- Achievement/Health/System/Ambient: 24 assets

---

## Python Batch Generation Script

```python
import os
import json
import time
from elevenlabs.client import ElevenLabs
from dotenv import load_dotenv

load_dotenv()

class SFXBatchGenerator:
    """ElevenLabs SFX batch generator for 16BitFit V3"""

    def __init__(self, api_key: str = None):
        self.client = ElevenLabs(api_key=api_key or os.getenv("ELEVENLABS_API_KEY"))
        self.generation_log = []
        self.output_format = "mp3_44100_96"  # Balance of quality and file size

    def generate_sfx(self, sfx_data: dict, base_output_dir: str = "./assets/audio") -> bool:
        """Generate single SFX from JSON definition"""
        try:
            sfx_id = sfx_data['id']
            filename = sfx_data['filename']
            prompt = sfx_data['prompt']
            duration = sfx_data.get('duration_seconds')
            prompt_influence = sfx_data.get('prompt_influence', 0.7)

            output_path = os.path.join(base_output_dir, filename)
            os.makedirs(os.path.dirname(output_path), exist_ok=True)

            print(f"\n[{sfx_id}] Generating...")
            print(f"  Prompt: {prompt[:60]}...")
            print(f"  Duration: {duration}s | Influence: {prompt_influence}")

            result = self.client.text_to_sound_effects.convert(
                text=prompt,
                duration_seconds=duration,
                prompt_influence=prompt_influence,
            )

            with open(output_path, "wb") as f:
                for chunk in result:
                    f.write(chunk)

            log_entry = {**sfx_data, "success": True, "output_path": output_path}
            self.generation_log.append(log_entry)

            print(f"  ✓ Saved to {output_path}")
            return True

        except Exception as e:
            print(f"  ✗ Error: {e}")
            log_entry = {**sfx_data, "success": False, "error": str(e)}
            self.generation_log.append(log_entry)
            return False

    def batch_generate(
        self,
        sfx_list: list,
        base_output_dir: str = "./assets/audio",
        delay: float = 1.5
    ):
        """Batch generate multiple SFX with rate limiting"""
        total = len(sfx_list)
        successful = 0

        print(f"\n{'='*60}")
        print(f"Starting batch generation: {total} SFX")
        print(f"{'='*60}")

        for i, sfx_data in enumerate(sfx_list):
            print(f"\n[{i+1}/{total}] " + "="*50)

            if self.generate_sfx(sfx_data, base_output_dir):
                successful += 1

            # Rate limiting
            if i < total - 1:
                time.sleep(delay)

        # Save log
        self.save_log(base_output_dir)

        print(f"\n{'='*60}")
        print(f"Batch complete: {successful}/{total} successful")
        print(f"{'='*60}")

    def save_log(self, output_dir: str):
        """Save generation log as JSON"""
        log_path = os.path.join(output_dir, "sfx_generation_log.json")
        with open(log_path, "w") as f:
            json.dump(self.generation_log, f, indent=2)
        print(f"\n✓ Log saved to {log_path}")


# ===== LOAD SFX DEFINITIONS FROM JSON =====

def load_sfx_from_json(json_path: str) -> list:
    """Load SFX definitions from JSON file"""
    with open(json_path, "r") as f:
        return json.load(f)


# ===== MAIN EXECUTION =====

if __name__ == "__main__":
    # Initialize generator
    generator = SFXBatchGenerator()

    # Option 1: Load from JSON file
    # sfx_list = load_sfx_from_json("sfx_definitions.json")

    # Option 2: Define inline (MVP example)
    mvp_sfx = [
        # General Combat (sample - load all 24 from JSON)
        {
            "id": "SFX-COMBAT-001",
            "filename": "combat/general/sfx-combat-001_light-punch-whiff.mp3",
            "prompt": "Quick whoosh of fist moving through air, light punch swing, fast martial arts strike sound effect",
            "duration_seconds": 0.5,
            "prompt_influence": 0.7
        },
        # Add remaining SFX...
    ]

    # Generate all SFX
    generator.batch_generate(
        sfx_list=mvp_sfx,
        base_output_dir="./assets/audio",
        delay=1.5  # 1.5 seconds between requests
    )
```

---

## Excluded Voice/Grunt Assets Reference

**The following 11 assets have been EXCLUDED from ElevenLabs SFX API batch generation:**

These assets will be created separately using voice changer software for announcer sounds and boss character vocalizations.

### Combat Announcer Calls (3 assets)
- **SFX-COMBAT-018:** Round Start "FIGHT!" (0.6s)
- **SFX-COMBAT-019:** Round End "K.O.!" (0.7s)
- **SFX-COMBAT-020:** Round End "Time Up!" (0.8s)

### Boss Character Vocalizations (8 assets)

**Procrastination Phantom (2 assets):**
- **SFX-BOSS-PHANTOM-002:** Reluctant Sigh (Idle) (0.8s)
- **SFX-BOSS-PHANTOM-003:** Lazy Moan (Hit Taken) (0.5s)

**Sloth Demon (2 assets):**
- **SFX-BOSS-SLOTH-002:** Heavy Grunt (Hit Taken) (0.5s)
- **SFX-BOSS-SLOTH-004:** Yawn (Stunned) (1.2s)

**Gym Bully (2 assets):**
- **SFX-BOSS-BULLY-002:** Cocky Laugh (Taunt) (0.8s)
- **SFX-BOSS-BULLY-003:** Angry Grunt (Hit Taken) (0.5s)

**Ultimate Slump (4 assets):**
- **SFX-BOSS-SLUMP-001:** Shallow Breathing (Idle) (1.5s)
- **SFX-BOSS-SLUMP-002:** Weak Groan (Hit Taken) (0.5s)
- **SFX-BOSS-SLUMP-005:** Gasping (Stunned) (1.2s)
- **SFX-BOSS-SLUMP-006:** Red-Faced Rage (Rage Mode) (1.0s)

---

**Document Version:** 1.0
**Created:** 2025-11-01
**Based On:**
- character-audio-assets.md
- audio-specifications.md
- ElevenLabs API research and best practices

**Next Steps:**
1. Get ElevenLabs API key
2. Set up Python environment with elevenlabs SDK
3. Run MVP batch generation (66 assets)
4. Audition generated SFX, select best variations (API returns 4 per request)
5. Integrate into React Native app
6. Test on iOS/Android devices
7. Phase 2: Generate remaining character/boss SFX
