import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Download, Printer, RotateCcw, Send, Stethoscope } from "lucide-react";
import { DEPARTMENTS, getFollowUp, type Department } from "@/lib/intake";
import { ClinicSheet, type SheetData } from "@/components/ClinicSheet";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MED GUIDE — Smart Clinic Intake with Dr. Sheeba Khan" },
      { name: "description", content: "Chat with Med Guide to prepare your clinic intake and prescription sheet before seeing Dr. Sheeba Khan." },
      { property: "og:title", content: "MED GUIDE — Smart Clinic Intake" },
      { property: "og:description", content: "A friendly virtual nurse chat that prepares your A4 clinic sheet." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

type Msg = { id: number; from: "bot" | "user"; text: string };
type Step = "details" | "dept" | "symptoms" | "follow" | "brief" | "done";

let mid = 0;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function rich(t: string): ReactNode {
  return t.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((p, i) =>
    p.startsWith("**") ? <b key={i}>{p.slice(2, -2)}</b> : p.startsWith("*") ? <i key={i}>{p.slice(1, -1)}</i> : p,
  );
}

function Index() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [step, setStep] = useState<Step | null>(null);
  const [details, setDetails] = useState({ name: "", ageSex: "", contact: "" });
  const [dept, setDept] = useState<Department | null>(null);
  const [picked, setPicked] = useState<string[]>([]);
  const [otherText, setOtherText] = useState("");
  const [showOther, setShowOther] = useState(false);
  const [fIdx, setFIdx] = useState(0);
  const [answers, setAnswers] = useState<{ name: string; detail: string }[]>([]);
  const [chips, setChips] = useState<string[]>([]);
  const [free, setFree] = useState("");
  const [brief, setBrief] = useState("");
  const [sheetKey, setSheetKey] = useState(0);
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  const say = async (...texts: string[]) => {
    for (const t of texts) {
      setTyping(true);
      await sleep(550);
      setTyping(false);
      setMsgs((m) => [...m, { id: ++mid, from: "bot", text: t }]);
    }
  };
  const user = (text: string) => setMsgs((m) => [...m, { id: ++mid, from: "user", text }]);

  const start = async () => {
    setMsgs([]); setStep(null); setDetails({ name: "", ageSex: "", contact: "" }); setDept(null);
    setPicked([]); setOtherText(""); setShowOther(false); setFIdx(0); setAnswers([]); setChips([]); setFree(""); setBrief("");
    setSheetKey((k) => k + 1);
    await say(
      "Hello! Welcome to Med Guide Clinic. 👋 I’m your virtual clinic assistant, and I’ll help prepare your health summary for Dr. Sheeba Khan so you don't have to wait long.",
      "To get started, could you please share your **Full Name**, **Age / Sex**, and **Contact Number**?",
    );
    setStep("details");
  };

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    start();
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [msgs, typing, step]);

  const firstName = details.name.trim() || "there";

  const submitDetails = async () => {
    setStep(null);
    user([details.name, details.ageSex, details.contact].filter(Boolean).join(" · ") || "(skipped)");
    await say(`Thank you, ${firstName}! It's nice to meet you. Could you tell me which health department you’d like to visit today? Just tap the option that best matches what you're feeling:`);
    setStep("dept");
  };

  const chooseDept = async (d: Department) => {
    setStep(null); setDept(d); user(`${d.emoji} ${d.name}`);
    await say(`Got it — I've selected **${d.name}** for you. I’m sorry you aren't feeling your best today. Which of these symptoms are you currently experiencing? *(You can select more than one)*`);
    setStep("symptoms");
  };

  const askFollow = async (list: string[], i: number) => {
    setChips([]); setFree(""); setFIdx(i);
    await say(getFollowUp(list[i]).prompt);
    setStep("follow");
  };

  const allSymptoms = [...picked, ...(otherText.trim() ? [otherText.trim()] : [])];

  const confirmSymptoms = async () => {
    if (!allSymptoms.length) return;
    setStep(null); user(allSymptoms.join(", "));
    await askFollow(allSymptoms, 0);
  };

  const submitFollow = async () => {
    setStep(null);
    const detail = [...chips, free.trim()].filter(Boolean).join(", ");
    user(detail || "No extra details");
    const next = [...answers, { name: allSymptoms[fIdx], detail }];
    setAnswers(next);
    if (fIdx + 1 < allSymptoms.length) await askFollow(allSymptoms, fIdx + 1);
    else {
      await say("Thank you for sharing all of that with me. Before I prepare your clinic sheet for Dr. Sheeba Khan, would you like to briefly describe in your own words how this started or anything else the doctor should know?");
      setStep("brief");
    }
  };

  const submitBrief = async (text: string) => {
    setStep(null); setBrief(text); user(text.trim() || "Skipped");
    await say(`All done, ${firstName}! 🎉 I have prepared your official clinic intake sheet below. You can still click anywhere on the sheet to edit or add notes, or download it directly as a PNG image for Dr. Sheeba Khan. Wishing you a speedy recovery!`);
    setStep("done");
  };

  const download = async () => {
    const el = document.getElementById("clinic-sheet");
    if (!el) return;
    setBusy(true);
    (document.activeElement as HTMLElement | null)?.blur();
    el.classList.add("exporting");
    try {
      const { default: html2canvas } = await import("html2canvas-pro");
      const canvas = await html2canvas(el, { scale: 2, backgroundColor: "#ffffff", useCORS: true });
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = "Med_Guide_Dr_Sheeba_Khan.png";
      document.body.appendChild(a); a.click(); a.remove();
    } finally {
      el.classList.remove("exporting"); setBusy(false);
    }
  };

  const sheet: SheetData = { ...details, department: dept?.name ?? "", symptoms: answers, brief: brief.trim() };
  const fu = step === "follow" ? getFollowUp(allSymptoms[fIdx]) : null;
  const toggle = (arr: string[], v: string) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  return (
    <div className="min-h-screen bg-chat-wall">
      <header className="sticky top-0 z-10 bg-primary text-primary-foreground shadow-md print:hidden">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-primary-foreground/15"><Stethoscope className="h-5 w-5" /></div>
          <div className="flex-1">
            <h1 className="font-serif text-xl leading-tight tracking-wide">MED GUIDE</h1>
            <p className="text-xs opacity-80">{typing ? "typing…" : "Virtual clinic assistant · Dr. Sheeba Khan"}</p>
          </div>
          <button onClick={start} className="flex items-center gap-1 rounded-full bg-primary-foreground/15 px-3 py-1.5 text-xs font-medium"><RotateCcw className="h-3.5 w-3.5" />New</button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-3 px-3 py-4 print:hidden">
        {msgs.map((m) => (
          <div key={m.id} className={`msg-in flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed shadow-sm ${m.from === "user" ? "rounded-br-sm bg-bubble-user text-bubble-user-foreground" : "rounded-bl-sm bg-bubble-bot text-foreground"}`}>
              {rich(m.text)}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex gap-1 rounded-2xl rounded-bl-sm bg-bubble-bot px-4 py-3 shadow-sm">
              {[0, 1, 2].map((i) => <span key={i} className="typing-dot h-2 w-2 rounded-full bg-primary" style={{ animationDelay: `${i * 0.15}s` }} />)}
            </div>
            Med Guide is typing...
          </div>
        )}

        {step === "details" && (
          <Card>
            {([["name", "Full Name", "e.g. Ayesha Qureshi"], ["ageSex", "Age / Sex", "e.g. 34 / F"], ["contact", "Contact Number", "e.g. 98xxxxxx10"]] as const).map(([k, l, p]) => (
              <label key={k} className="block">
                <span className="text-xs font-semibold text-muted-foreground">{l}</span>
                <input value={details[k]} onChange={(e) => setDetails({ ...details, [k]: e.target.value })} placeholder={p} className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2.5 outline-none focus:border-primary" />
              </label>
            ))}
            <Primary onClick={submitDetails}>Continue</Primary>
          </Card>
        )}

        {step === "dept" && (
          <div className="msg-in grid gap-2 sm:grid-cols-2">
            {DEPARTMENTS.map((d) => (
              <button key={d.id} onClick={() => chooseDept(d)} className="flex gap-3 rounded-2xl border border-border bg-card p-3 text-left shadow-sm transition hover:border-primary active:scale-[.98]">
                <span className="text-2xl">{d.emoji}</span>
                <span><b className="block text-sm">{d.name}</b><i className="text-xs text-muted-foreground">{d.desc}</i></span>
              </button>
            ))}
            <FreeLine placeholder="Or type a department / concern..." onSend={(v) => chooseDept({ id: "x", emoji: "📝", name: v, desc: "", symptoms: [] })} />
          </div>
        )}

        {step === "symptoms" && dept && (
          <Card>
            <div className="flex flex-wrap gap-2">
              {dept.symptoms.map((s) => (
                <button key={s} data-on={picked.includes(s)} onClick={() => setPicked(toggle(picked, s))} className="chip">{s}</button>
              ))}
              <button data-on={showOther} onClick={() => setShowOther(!showOther)} className="chip">+ Other symptom</button>
            </div>
            {(showOther || !dept.symptoms.length) && (
              <input value={otherText} onChange={(e) => setOtherText(e.target.value)} placeholder="Describe your symptom..." className="w-full rounded-xl border border-input bg-background px-3 py-2.5 outline-none focus:border-primary" />
            )}
            <Primary onClick={confirmSymptoms} disabled={!allSymptoms.length}>Confirm Selected Symptoms</Primary>
          </Card>
        )}

        {fu && (
          <Card>
            <p className="text-xs font-semibold text-primary">Symptom {fIdx + 1} of {allSymptoms.length}: {allSymptoms[fIdx]}</p>
            {fu.groups.map((g) => (
              <div key={g.label}>
                <p className="mb-1.5 text-xs font-semibold text-muted-foreground">{g.label}</p>
                <div className="flex flex-wrap gap-2">
                  {g.chips.map((c) => <button key={c} data-on={chips.includes(c)} onClick={() => setChips(toggle(chips, c))} className="chip">{c}</button>)}
                </div>
              </div>
            ))}
            <textarea value={free} onChange={(e) => setFree(e.target.value)} placeholder={fu.placeholder} rows={2} className="w-full rounded-xl border border-input bg-background px-3 py-2.5 outline-none focus:border-primary" />
            <Primary onClick={submitFollow}>Continue</Primary>
          </Card>
        )}

        {step === "brief" && (
          <Card>
            <textarea value={brief} onChange={(e) => setBrief(e.target.value)} placeholder="e.g. It started after I got caught in the rain two days ago..." rows={3} className="w-full rounded-xl border border-input bg-background px-3 py-2.5 outline-none focus:border-primary" />
            <div className="flex gap-2">
              <button onClick={() => submitBrief("")} className="flex-1 rounded-xl border border-border bg-card py-2.5 text-sm font-semibold">Skip & Generate Sheet</button>
              <Primary onClick={() => submitBrief(brief)} className="flex-1">Submit & Generate Sheet</Primary>
            </div>
          </Card>
        )}
        <div ref={endRef} />
      </main>

      {step === "done" && (
        <section className="mx-auto max-w-4xl px-3 pb-16">
          <div className="sticky top-16 z-10 mb-4 flex flex-wrap justify-center gap-2 print:hidden">
            <ActionBtn onClick={download} disabled={busy}><Download className="h-4 w-4" />{busy ? "Preparing…" : "Download PNG"}</ActionBtn>
            <ActionBtn onClick={() => window.print()} variant="soft"><Printer className="h-4 w-4" />Print Sheet</ActionBtn>
            <ActionBtn onClick={start} variant="soft"><RotateCcw className="h-4 w-4" />Start New Patient Chat</ActionBtn>
          </div>
          <ClinicSheet key={sheetKey} data={sheet} />
        </section>
      )}
    </div>
  );
}

function Card({ children }: { children: ReactNode }) {
  return <div className="msg-in ml-auto max-w-[92%] space-y-3 rounded-2xl border border-border bg-card p-4 shadow-sm sm:max-w-md">{children}</div>;
}

function Primary({ className = "", ...p }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...p} className={`w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition active:scale-[.98] disabled:opacity-40 ${className}`} />;
}

function ActionBtn({ variant = "solid", className = "", ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "solid" | "soft" }) {
  return <button {...p} className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-md disabled:opacity-60 ${variant === "solid" ? "bg-accent text-accent-foreground" : "bg-card text-foreground"} ${className}`} />;
}

function FreeLine({ placeholder, onSend }: { placeholder: string; onSend: (v: string) => void }) {
  const [v, setV] = useState("");
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (v.trim()) onSend(v.trim()); }} className="flex gap-2 sm:col-span-2">
      <input value={v} onChange={(e) => setV(e.target.value)} placeholder={placeholder} className="flex-1 rounded-full border border-input bg-card px-4 py-2.5 outline-none focus:border-primary" />
      <button className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground"><Send className="h-4 w-4" /></button>
    </form>
  );
}
