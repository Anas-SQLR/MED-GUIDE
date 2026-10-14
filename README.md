# Med guide 

Build a clean, mobile-responsive web application called "MED GUIDE" — a conversational, human-like Smart Clinic Intake Chatbot and Prescription Sheet Generator



### 1. APP EXPERIENCE & HUMAN-LIKE CHAT UI

Create a modern chat interface (similar to WhatsApp or a friendly virtual nurse chat) paired with a downloadable A4 Clinic Prescription Sheet.

- **Human Touch:** Before showing each message, display a brief "Med Guide is typing..." animation (around 500ms) so the conversation feels natural and alive.

- **No Strict Data Types:** Never enforce strict data types on any input. Allow flexible text entry everywhere (e.g., "34 / M", "around 3 days", "101 F", "since yesterday morning") and let users either click quick-select option buttons OR type their own custom response at every step.



### 2. CONVERSATIONAL SCRIPT & STEP-BY-STEP FLOW

The bot must speak in warm, polite, reassuring sentences and present clickable option buttons/chips alongside text inputs:



**Step 1: Warm Greeting & Patient Details**

- **Bot says:** "Hello! Welcome to Med Guide Clinic. 👋 I’m your virtual clinic assistant, and I’ll help prepare your health summary for Dr. Sheeba Khan so you don't have to wait long."

- **Bot says:** "To get started, could you please share your **Full Name**, **Age / Sex**, and **Contact Number**?"

- **User Input:** Show a clean inline chat card or conversational input fields for Name, Age/Sex, and Contact (all flexible text, nothing strictly forced), with a "Continue" button.



**Step 2: Empathetic Department Selection**

- **Bot says:** "Thank you, [Patient Name]! It's nice to meet you. Could you tell me which health department you’d like to visit today? Just tap the option that best matches what you're feeling:"

- **Selectable Option Cards (Single Select):**

  - 👁️ **Ophthalmology** — *"For eye care, redness, watering, or vision trouble"*

  - 🩺 **General Medicine** — *"For fever, cold, cough, headache, or general weakness"*

  - 🦴 **Orthopedics** — *"For joint pain, heavy legs, backache, or bone/muscle issues"*

  - ❤️ **Cardiology** — *"For heart checkups, chest discomfort, or blood pressure"*

  - 🌿 **Dermatology** — *"For skin rashes, itching, allergies, or hair concerns"*

  - 🧸 **Pediatrics** — *"For infants' and children's health and wellness"*



**Step 3: Department-Specific Symptoms (Multi-Select Buttons)**

- **Bot says:** "Got it — I've selected **[Selected Department]** for you. I’m sorry you aren't feeling your best today. Which of these symptoms are you currently experiencing? *(You can select more than one)*"

- Display ONLY the symptom buttons belonging to the chosen department, plus a "Confirm Selected Symptoms" button and an "+ Other symptom" option:

  - **If General Medicine:** `[High body temperature / Fever]`, `[Cough, cold, or headache]`, `[Body pain]`, `[Weakness / Fatigue]`, `[Other]`

  - **If Ophthalmology:** `[Eye inflammation / Redness]`, `[Watering or itching eyes]`, `[Blurred vision]`, `[Temporary blindness]`, `[Other]`

  - **If Orthopedics:** `[Joint or body pain]`, `[Heavy legs]`, `[Back or neck pain]`, `[Swelling or stiffness]`, `[Recent injury / fall]`, `[Other]`

  - **If Cardiology:** `[Chest pain or pressure]`, `[Shortness of breath]`, `[Fast or irregular heartbeat]`, `[Dizziness / Fatigue]`, `[Other]`

  - **If Dermatology:** `[Skin rash or redness]`, `[Severe itching]`, `[Skin inflammation / swelling]`, `[Hair or scalp issue]`, `[Other]`

  - **If Pediatrics:** `[High body temperature (Fever)]`, `[Cough or cold]`, `[Vomiting or loose motions]`, `[Excessive crying / Weakness]`, `[Other]`



**Step 4: Conversational Follow-Up Questions (Conditional Loop)**

For each symptom the patient selected in Step 3, the bot must ask a caring follow-up question one by one, offering **clickable quick-select chips** AND a **free-text box** so the patient can either tap options or type freely:



- **If "Body pain" / "Joint or body pain" / "Heavy legs" / "Back or neck pain" is selected:**

  - **Bot says:** "I see you're dealing with body pain. Could you tap the areas where the pain occurs, or describe how it feels?"

  - **Clickable Multi-Select Chips:** `[Leg]`, `[Knee]`, `[Ankle]`, `[Back]`, `[Neck]`, `[Shoulder]`, `[Whole Body]`

  - **Clickable Pain-Type Chips:** `[Sharp pain]`, `[Heavy feeling]`, `[Aching / Throbbing]`, `[Stiffness]`

  - **Plus Free-Text Input:** "Add any extra details about your pain..."



- **If "High body temperature / Fever" is selected:**

  - **Bot says:** "Fevers can be really exhausting. How long have you had this high temperature, and have you checked it with a thermometer?"

  - **Clickable Chips:** `[Since today]`, `[1 - 2 days]`, `[3 - 5 days]`, `[More than a week]`, `[Mild fever]`, `[High grade fever]`

  - **Plus Free-Text Input:** "Type exact days or temperature (e.g., 101°F) if known..."



- **If any "Eye" symptom (Inflammation, Redness, Blurred vision, Temporary blindness) is selected:**

  - **Bot says:** "Eye issues definitely need careful attention. Which eye is affected, and what exact signs are you noticing?"

  - **Clickable Chips:** `[Left Eye]`, `[Right Eye]`, `[Both Eyes]`, `[Redness]`, `[Watering / Discharge]`, `[Temporary blindness]`, `[Blurry vision]`, `[Burning / Itching]`

  - **Plus Free-Text Input:** "Tell us more about your eye symptoms..."



- **If "Weakness / Fatigue" is selected:**

  - **Bot says:** "Could you let me know if the weakness is in a specific part of your body or all over?"

  - **Clickable Chips:** `[Whole body weakness]`, `[In legs / arms]`, `[Feeling dizzy / lightheaded]`

  - **Plus Free-Text Input:** "Add more details..."



- **If any other symptom is selected (Cough/Cold, Chest pain, Skin rash, Pediatrics symptoms, etc.):**

  - **Bot says:** "Could you share a few quick details about your **[Symptom Name]**?"

  - Show helpful relevant quick-chips (e.g., duration or location) + a flexible free-text input.



**Step 5: Open-Ended Brief Description**

- **Bot says:** "Thank you for sharing all of that with me. Before I prepare your clinic sheet for Dr. Sheeba Khan, would you like to briefly describe in your own words how this started or anything else the doctor should know?"

- **User Input:** A friendly text box + a "Skip & Generate Sheet" or "Submit & Generate Sheet" button.



**Step 6: Warm Closing & Sheet Reveal**

- **Bot says:** "All done, [Patient Name]! 🎉 I have prepared your official clinic intake sheet below. You can still click anywhere on the sheet to edit or add notes, or download it directly as a PNG image for Dr. Sheeba Khan. Wishing you a speedy recovery!"

### 3. THE CLINIC SHEET (EDITABLE A4 DOCTOR'S PAD + PNG EXPORT)

Display an authentic, clean A4 medical prescription pad (`#clinic-sheet`) that automatically fills in all the collected chat answers AND allows the doctor or patient to click directly on any line or section to edit/type freely on screen: 

Example : 

- **Clinic Header:**

  - Clinic Title: **MED GUIDE CLINIC**

  - Doctor Name: **Dr. SHEEBA KHAN**

  - Contact: **8225977810**

  - Date field (auto-filled with today's date, editable)

- **Patient Information Box:**

  - Editable fields pre-filled with: Name, Age/Sex, Contact, and Selected Department.

- **Reported Symptoms & Patient Brief Box:**

  - Pre-filled with a clean, structured bullet list of all selected symptoms, their follow-up answers (e.g., pain organs, fever duration, eye signs), and the patient's brief description.

- **For Doctor's Use Only — Clinical Observations (O/E):**

  - Editable inline fields for Vitals: `BP: ____ mmHg`, `Pulse: ____ bpm`, `Temp: ____ °F`, `Weight: ____ kg`.

  - Generous lined/open editable space for Dr. Sheeba Khan to write or type clinical observations.

- **Rx (Prescription / Recommended Treatment):**

  - Classic large medical **Rx** symbol.

  - Generous blank/lined space (also clickable/editable) for writing medicines, dosages, and tests.

- **Footer:**

  - Signature & Stamp line at the bottom right: **"Dr. SHEEBA KHAN — Signature / Stamp"**.



### 4. EXPORT & ACTION BUTTONS

- **Download as PNG Button:** Use `html2canvas` (`scale: 2`, white background) to export `#clinic-sheet` as a crisp, high-resolution PNG file named `Med_Guide_Dr_Sheeba_Khan.png`. Ensure placeholder hints are hidden during image capture so empty lines for the doctor look like clean printable lines.

- **Print Sheet Button:** Clean `@media print` styling so only 

the A4 sheet prints.

- **Start New Patient Chat Button:** Resets the chat and clears the sheet.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://smart-intake-aid.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/666a3cdc-6f18-447f-8447-923fa9a807cb).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
