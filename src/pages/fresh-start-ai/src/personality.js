// Dementia-type personality profiles
// Each profile defines a system prompt extension and a response post-processor.

const PROFILES = {
  general: {
    systemExtension: `
Speak warmly and simply. Use short sentences. Repeat key reassurances naturally.
Avoid jargon. Be patient — never show frustration or hurry.`,
    transform: text => text,
  },

  alzheimers: {
    systemExtension: `
The person has Alzheimer's. Memory loss is common — they may repeat themselves or forget recent events.
Always respond as if it is the first time they've said something. Never correct or challenge their memory.
Use their name often. Keep sentences short and simple. Anchor them gently in the present moment.`,
    transform: text => text,
  },

  vascular: {
    systemExtension: `
The person has Vascular Dementia. They may have sudden mood changes, difficulty concentrating, or patchy memory loss.
Be steady and consistent. Avoid rapid topic changes. Use clear, simple language.
If they seem frustrated, acknowledge it warmly and redirect gently.`,
    transform: text => text,
  },

  lewyBody: {
    systemExtension: `
The person has Lewy Body Dementia. They may experience vivid hallucinations or fluctuating alertness.
Never dismiss or argue with what they report seeing or experiencing — validate their feelings calmly.
If they seem confused or frightened, gently ground them: "You're safe. I'm right here with you."
Speak slowly and clearly. Watch for signs of distress and respond with extra warmth.`,
    transform: text => text,
  },

  frontotemporal: {
    systemExtension: `
The person has Frontotemporal Dementia. They may say unexpected or blunt things, or struggle with social cues.
Do not take offence — respond with consistent warmth regardless of tone.
Keep responses short and structured. Gently guide conversation with simple, direct questions.
Avoid abstract topics. Focus on concrete, familiar things.`,
    transform: text => text,
  },
};

/**
 * Returns the system prompt extension for the given dementia profile.
 * Append this to the companion's base system prompt.
 */
export function getSystemExtension(profile) {
  return (PROFILES[profile] || PROFILES.general).systemExtension;
}

/**
 * Post-processes an AI response for the given dementia profile.
 * Currently returns text as-is — extend transform() per profile if needed.
 */
export function applyPersonality(text, profile) {
  const { transform } = PROFILES[profile] || PROFILES.general;
  return transform(text);
}
