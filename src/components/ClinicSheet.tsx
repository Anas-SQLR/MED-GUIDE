export type SheetData = {
  name: string; ageSex: string; contact: string; department: string;
  symptoms: { name: string; detail: string }[]; brief: string;
  homeCare: { tips: string[]; urgent?: string };
};

function Ed({ value = "", placeholder, className = "" }: { value?: string | undefined; placeholder: string; className?: string }) {
  return (
    <div contentEditable suppressContentEditableWarning data-placeholder={placeholder} className={`ed ${className}`}>
      {value}
    </div>
  );
}

function Lined({ rows, placeholder }: { rows: number; placeholder: string }) {
  return (
    <div className="relative mt-3" style={{ minHeight: rows * 32 }}>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-8 border-b border-sheet-line" />
        ))}
      </div>
      <Ed placeholder={placeholder} className="relative text-sm leading-8" />
    </div>
  );
}

function Field({ label, value, placeholder }: { label: string; value?: string; placeholder: string }) {
  return (
    <div className="flex items-baseline gap-2 border-b border-sheet-line pb-1">
      <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wider opacity-70">{label}</span>
      <Ed value={value} placeholder={placeholder} className="flex-1 text-sm font-medium" />
    </div>
  );
}

export function ClinicSheet({ data }: { data: SheetData }) {
  const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  return (
    <div id="clinic-sheet" className="mx-auto w-full max-w-[794px] rounded-sm border border-border p-6 shadow-xl sm:p-10" style={{ minHeight: "min(1123px, 141vw)" }}>
      <header className="flex flex-wrap items-end justify-between gap-3 border-b-4 border-double border-sheet-ink pb-4">
        <div>
          <h2 className="font-serif text-3xl tracking-wide sm:text-4xl">MED GUIDE CLINIC</h2>
          <p className="mt-1 text-lg font-bold tracking-wide">Dr. SHEEBA KHAN</p>
          <p className="text-sm opacity-80">Contact: 8225977362</p>
        </div>
        <div className="flex items-baseline gap-2 text-sm">
          <span className="font-semibold">Date:</span>
          <Ed value={today} placeholder="__/__/____" className="min-w-[7rem] border-b border-sheet-line" />
        </div>
      </header>

      <section className="mt-5 grid gap-3 rounded-md border border-sheet-line p-4 sm:grid-cols-2">
        <Field label="Name" value={data.name} placeholder="Patient name" />
        <Field label="Age / Sex" value={data.ageSex} placeholder="—" />
        <Field label="Contact" value={data.contact} placeholder="—" />
        <Field label="Department" value={data.department} placeholder="—" />
      </section>

      <section className="mt-5 rounded-md border border-sheet-line p-4">
        <h3 className="mb-2 text-xs font-bold uppercase tracking-widest">Reported Symptoms & Patient Brief</h3>
        <div contentEditable suppressContentEditableWarning className="ed text-sm leading-relaxed">
          <ul className="list-disc space-y-1 pl-5">
            {data.symptoms.map((s) => (
              <li key={s.name}><b>{s.name}</b>{s.detail ? ` — ${s.detail}` : ""}</li>
            ))}
          </ul>
          {data.brief && <p className="mt-2"><b>Patient's note:</b> {data.brief}</p>}
        </div>
      </section>

      <section className="mt-5 rounded-md border border-sheet-line p-4">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-widest">For Doctor's Use Only — Clinical Observations (O/E)</h3>
        <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          {[["BP", "mmHg"], ["Pulse", "bpm"], ["Temp", "°F"], ["Weight", "kg"]].map(([l, u]) => (
            <div key={l} className="flex items-baseline gap-1">
              <span className="font-semibold">{l}:</span>
              <Ed placeholder="____" className="min-w-[3rem] flex-1 border-b border-sheet-line text-center" />
              <span className="opacity-70">{u}</span>
            </div>
          ))}
        </div>
        <Lined rows={4} placeholder="Type clinical observations..." />
      </section>

      <section className="mt-5">
        <div className="font-serif text-6xl leading-none">℞</div>
        <Lined rows={9} placeholder="Medicines, dosage, tests..." />
      </section>

      <footer className="mt-10 flex justify-end">
        <div className="w-64 border-t border-sheet-ink pt-2 text-center text-sm font-semibold">Dr. SHEEBA KHAN — Signature / Stamp</div>
      </footer>

      <section className="mt-6 rounded-md border border-sheet-line p-4">
        <h3 className="mb-2 text-xs font-bold uppercase tracking-widest">Home Care for Comfort</h3>
        <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed">
          {data.homeCare.tips.map((tip) => <li key={tip}>{tip}</li>)}
        </ul>
        {data.homeCare.urgent && <p className="mt-3 text-sm font-medium leading-relaxed">{data.homeCare.urgent}</p>}
        <p className="mt-2 text-xs leading-relaxed opacity-70">General comfort guidance only. It is not a diagnosis or a substitute for advice from a healthcare professional. For children, pregnancy, allergies, or existing conditions, check with a clinician before trying remedies.</p>
      </section>
    </div>
  );
}
