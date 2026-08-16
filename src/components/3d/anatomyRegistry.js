/**
 * Anatomy 3D Model Registry
 * 
 * Add new organs by simply adding an entry here.
 * The viewer and chat detection logic will pick them up automatically.
 */
export const ANATOMY_MODELS = {
  heart: { path: "/models/heart.glb", label: "Human Heart", icon: "❤️", subject: "biology" },
  brain: { path: "/models/brain.glb", label: "Human Brain", icon: "🧠", subject: "biology" },
  earth: { path: "/models/earth.glb", label: "Earth Globe", icon: "🌍", subject: "geography" },
};

/**
 * Keywords that should trigger a "Coming Soon" placeholder.
 * When a model is added for any of these, move the entry to ANATOMY_MODELS above.
 */
export const COMING_SOON_KEYWORDS = [
  { keyword: "lungs", label: "Human Lungs", icon: "🫁" },
  { keyword: "kidney", label: "Human Kidney", icon: "🫘" },
  { keyword: "skeleton", label: "Human Skeleton", icon: "🦴" },
  { keyword: "eye", label: "Human Eye", icon: "👁️" },
  { keyword: "liver", label: "Human Liver", icon: "🫀" },
  { keyword: "stomach", label: "Human Stomach", icon: "🔬" },
];

/**
 * Detect anatomy keywords in message text using whole-word matching.
 * Returns { key, model } if a registered model is found,
 * { key, comingSoon } if a coming-soon keyword is found,
 * or null if nothing matches.
 */
export function detectAnatomyKeyword(text) {
  if (!text || typeof text !== "string") return null;

  // Check registered models first (higher priority)
  for (const [key, model] of Object.entries(ANATOMY_MODELS)) {
    const regex = new RegExp(`\\b${key}\\b`, "i");
    if (regex.test(text)) {
      return { key, model, comingSoon: false };
    }
  }

  // Check coming-soon keywords
  for (const entry of COMING_SOON_KEYWORDS) {
    const regex = new RegExp(`\\b${entry.keyword}\\b`, "i");
    if (regex.test(text)) {
      return { key: entry.keyword, comingSoon: true, label: entry.label, icon: entry.icon };
    }
  }

  return null;
}
