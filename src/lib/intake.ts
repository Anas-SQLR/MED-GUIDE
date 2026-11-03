export type Department = { id: string; emoji: string; name: string; desc: string; symptoms: string[] };

export type HomeCare = { tips: string[]; urgent?: string };

/** Conservative comfort measures for a visit summary; these do not diagnose or treat a cause. */
export function getHomeCare(symptoms: string[]): HomeCare {
  const all = symptoms.join(" ").toLowerCase();
  if (/chest pain|chest pressure|shortness of breath|temporary blindness|blurred vision|loss of vision|blood seen|can't bear weight/.test(all)) {
    return {
      tips: ["Please do not try to manage this symptom with a home remedy."],
      urgent: "Seek urgent medical assessment. If symptoms are severe or sudden, contact local emergency services now.",
    };
  }

  const tips: string[] = [];
  const add = (...items: string[]) => items.forEach((item) => { if (!tips.includes(item)) tips.push(item); });
  if (/fever|high body temperature/.test(all)) add("Rest and drink fluids regularly to avoid dehydration.");
  if (/cough|cold|runny nose|sore throat|headache/.test(all)) add("Rest and drink fluids. A warm drink may soothe a throat; avoid hot drinks for young children.");
  if (/back|neck|joint|body pain|heavy legs|stiffness|swelling|injury|fall/.test(all)) add("For mild aches, use gentle movement as tolerated; a wrapped warm or cool pack may help. Avoid putting ice or heat directly on skin.");
  if (/eye|watering|itching/.test(all)) add("Avoid rubbing the eye and wash your hands. Do not put homemade drops or substances in the eye.");
  if (/rash|itch|skin|scalp/.test(all)) add("Use a cool, clean compress for comfort and avoid scratching or applying unknown products.");
  if (/vomit|loose motions/.test(all)) add("Take small, frequent sips of safe fluids; oral rehydration solution can help replace fluid losses.");
  if (/weakness|fatigue|dizz/.test(all)) add("Rest, drink water if you can, and avoid driving or strenuous activity while dizzy.");
  if (!tips.length) add("Rest, drink fluids if appropriate, and avoid unverified remedies. Discuss this symptom with a clinician.");
  return { tips, urgent: "These are comfort measures only, not a diagnosis or treatment. Seek medical care if symptoms worsen, persist, or feel severe." };
}

export const DEPARTMENTS: Department[] = [
  { id: "eye", emoji: "👁️", name: "Ophthalmology", desc: "For eye care, redness, watering, or vision trouble",
    symptoms: ["Eye inflammation / Redness", "Watering or itching eyes", "Blurred vision", "Temporary blindness"] },
  { id: "gen", emoji: "🩺", name: "General Medicine", desc: "For fever, cold, cough, headache, or general weakness",
    symptoms: ["High body temperature / Fever", "Cough, cold, or headache", "Body pain", "Weakness / Fatigue"] },
  { id: "ortho", emoji: "🦴", name: "Orthopedics", desc: "For joint pain, heavy legs, backache, or bone/muscle issues",
    symptoms: ["Joint or body pain", "Heavy legs", "Back or neck pain", "Swelling or stiffness", "Recent injury / fall"] },
  { id: "cardio", emoji: "❤️", name: "Cardiology", desc: "For heart checkups, chest discomfort, or blood pressure",
    symptoms: ["Chest pain or pressure", "Shortness of breath", "Fast or irregular heartbeat", "Dizziness / Fatigue"] },
  { id: "derm", emoji: "🌿", name: "Dermatology", desc: "For skin rashes, itching, allergies, or hair concerns",
    symptoms: ["Skin rash or redness", "Severe itching", "Skin inflammation / swelling", "Hair or scalp issue"] },
  { id: "ped", emoji: "🧸", name: "Pediatrics", desc: "For infants' and children's health and wellness",
    symptoms: ["High body temperature (Fever)", "Cough or cold", "Vomiting or loose motions", "Excessive crying / Weakness"] },
];

export type FollowUp = { prompt: string; groups: { label: string; chips: string[] }[]; placeholder: string };

const DURATION = ["Since today", "1 - 2 days", "3 - 5 days", "More than a week"];
const PAIN = ["Body pain", "Joint or body pain", "Heavy legs", "Back or neck pain"];
const EYE = ["Eye inflammation / Redness", "Blurred vision", "Temporary blindness", "Watering or itching eyes"];
const FEVER = ["High body temperature / Fever", "High body temperature (Fever)"];

export function getFollowUp(symptom: string): FollowUp {
  if (PAIN.includes(symptom))
    return {
      prompt: "I see you're dealing with body pain. Could you tap the areas where the pain occurs, or describe how it feels?",
      groups: [
        { label: "Where", chips: ["Leg", "Knee", "Ankle", "Back", "Neck", "Shoulder", "Whole Body"] },
        { label: "Pain type", chips: ["Sharp pain", "Heavy feeling", "Aching / Throbbing", "Stiffness"] },
      ],
      placeholder: "Add any extra details about your pain...",
    };
  if (FEVER.includes(symptom))
    return {
      prompt: "Fevers can be really exhausting. How long have you had this high temperature, and have you checked it with a thermometer?",
      groups: [{ label: "Duration & grade", chips: [...DURATION, "Mild fever", "High grade fever"] }],
      placeholder: "Type exact days or temperature (e.g., 101°F) if known...",
    };
  if (EYE.includes(symptom))
    return {
      prompt: "Eye issues definitely need careful attention. Which eye is affected, and what exact signs are you noticing?",
      groups: [{ label: "Eye & signs", chips: ["Left Eye", "Right Eye", "Both Eyes", "Redness", "Watering / Discharge", "Temporary blindness", "Blurry vision", "Burning / Itching"] }],
      placeholder: "Tell us more about your eye symptoms...",
    };
  if (symptom === "Weakness / Fatigue")
    return {
      prompt: "Could you let me know if the weakness is in a specific part of your body or all over?",
      groups: [{ label: "Where", chips: ["Whole body weakness", "In legs / arms", "Feeling dizzy / lightheaded"] }],
      placeholder: "Add more details...",
    };
  const extra: Record<string, string[]> = {
    "Cough, cold, or headache": ["Dry cough", "Cough with phlegm", "Runny nose", "Sore throat", "Headache"],
    "Cough or cold": ["Dry cough", "Wet cough", "Runny nose", "Breathing noisy"],
    "Chest pain or pressure": ["Left side", "Centre of chest", "Spreads to arm / jaw", "On exertion", "At rest"],
    "Shortness of breath": ["On walking", "At rest", "While lying down"],
    "Fast or irregular heartbeat": ["Occasional", "Frequent", "With dizziness"],
    "Dizziness / Fatigue": ["On standing", "All day", "With sweating"],
    "Skin rash or redness": ["Face", "Arms", "Legs", "Torso", "Spreading"],
    "Severe itching": ["Worse at night", "After food", "All over"],
    "Skin inflammation / swelling": ["Painful", "Warm to touch", "Fluid-filled"],
    "Hair or scalp issue": ["Hair fall", "Dandruff", "Itchy scalp", "Patches"],
    "Swelling or stiffness": ["Morning stiffness", "Knee", "Ankle", "Fingers"],
    "Recent injury / fall": ["Today", "This week", "Can't bear weight", "Visible swelling"],
    "Vomiting or loose motions": ["1 - 2 times", "Many times", "Not drinking well", "Blood seen"],
    "Excessive crying / Weakness": ["Not feeding well", "Sleeping more", "Irritable"],
  };
  return {
    prompt: `Could you share a few quick details about your **${symptom}**?`,
    groups: [
      ...(extra[symptom] ? [{ label: "Details", chips: extra[symptom] }] : []),
      { label: "How long", chips: DURATION },
    ],
    placeholder: "Describe it in your own words...",
  };
}
