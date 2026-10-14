export type Department = { id: string; emoji: string; name: string; desc: string; symptoms: string[] };

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
