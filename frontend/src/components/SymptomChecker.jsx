import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Plus, Trash2, ShieldCheck, Lightbulb, Activity, AlertTriangle, AlertCircle, CheckCircle, Siren, ExternalLink } from "lucide-react";
import { getStoredToken } from "../utils/authStorage";
import { API_BASE_URL } from "../utils/api";
import { AnalysisSupportActions } from "./Dashboard/AnalysisSupportActions";

const STEPS = [
  { id: 1, label: "Context" },
  { id: 2, label: "Symptoms" },
  { id: 3, label: "History" },
  { id: 4, label: "Review" },
];

const SYMPTOM_CATEGORIES = {
  "General": [
    "Fever", "Chills", "Fatigue", "Weakness", "Night Sweats", "Weight Loss",
    "Weight Gain", "Loss of Appetite", "Excessive Thirst", "Excessive Hunger",
    "Dehydration", "Swollen Lymph Nodes", "Malaise", "Fainting", "Dizziness",
  ],
  "Head & Neuro": [
    "Headache", "Migraine", "Confusion", "Memory Loss", "Brain Fog",
    "Difficulty Concentrating", "Seizures", "Tremors", "Numbness", "Tingling",
    "Loss of Balance", "Coordination Problems", "Slurred Speech", "Blurred Vision",
    "Double Vision", "Light Sensitivity", "Noise Sensitivity", "Ringing in Ears",
    "Ear Pain", "Hearing Loss",
  ],
  "Respiratory": [
    "Dry Cough", "Wet Cough", "Persistent Cough", "Shortness of Breath",
    "Wheezing", "Chest Tightness", "Rapid Breathing", "Painful Breathing",
    "Coughing Up Blood", "Runny Nose", "Stuffy Nose", "Congestion",
    "Post-Nasal Drip", "Loss of Smell", "Sneezing", "Sore Throat",
    "Hoarse Voice", "Difficulty Swallowing",
  ],
  "Cardiovascular": [
    "Chest Pain", "Heart Palpitations", "Irregular Heartbeat", "Rapid Heart Rate",
    "Slow Heart Rate", "High Blood Pressure", "Low Blood Pressure",
    "Swollen Ankles", "Swollen Legs", "Cold Hands and Feet", "Leg Cramps",
    "Varicose Veins", "Bluish Lips or Fingertips",
  ],
  "Gastrointestinal": [
    "Nausea", "Vomiting", "Diarrhea", "Constipation", "Bloating", "Gas",
    "Abdominal Pain", "Stomach Cramps", "Heartburn", "Acid Reflux", "Indigestion",
    "Blood in Stool", "Dark Stool", "Pale Stool", "Rectal Pain", "Loss of Bowel Control",
    "Excessive Burping", "Difficulty Swallowing Food", "Jaundice",
  ],
  "Musculoskeletal": [
    "Back Pain", "Lower Back Pain", "Upper Back Pain", "Neck Pain",
    "Shoulder Pain", "Knee Pain", "Hip Pain", "Ankle Pain", "Foot Pain",
    "Joint Pain", "Joint Swelling", "Joint Stiffness", "Muscle Pain",
    "Muscle Weakness", "Muscle Cramps", "Muscle Spasms", "Bone Pain",
    "Limited Range of Motion",
  ],
  "Skin": [
    "Rash", "Hives", "Itching", "Dry Skin", "Excessive Sweating",
    "Bruising Easily", "Slow Healing Wounds", "Skin Discoloration",
    "Redness", "Swelling", "Peeling Skin", "Hair Loss", "Brittle Nails",
    "Yellowing Skin", "Pale Skin",
  ],
  "Eyes": [
    "Red Eyes", "Watery Eyes", "Dry Eyes", "Eye Pain", "Eye Discharge",
    "Sensitivity to Light", "Blurred Vision", "Sudden Vision Loss",
    "Floaters", "Swollen Eyelids",
  ],
  "Mental Health": [
    "Anxiety", "Panic Attacks", "Depression", "Mood Swings", "Irritability",
    "Insomnia", "Excessive Sleeping", "Nightmares", "Low Motivation",
    "Feeling Hopeless", "Difficulty Making Decisions", "Social Withdrawal",
  ],
  "Urinary & Reproductive": [
    "Frequent Urination", "Painful Urination", "Blood in Urine", "Dark Urine",
    "Difficulty Urinating", "Incontinence", "Pelvic Pain",
    "Irregular Periods", "Heavy Periods", "Painful Periods", "Vaginal Discharge",
    "Erectile Dysfunction", "Testicular Pain", "Breast Pain",
  ],
  "Mouth & Dental": [
    "Toothache", "Gum Pain", "Gum Bleeding", "Mouth Sores", "Dry Mouth",
    "Excessive Saliva", "Bad Breath", "Swollen Tongue", "Loss of Taste",
  ],
};

const ALL_SYMPTOMS = Object.values(SYMPTOM_CATEGORIES).flat();

const SIDEBAR_CONTENT = {
  1: {
    badge: "Step 01 of 04",
    title: "General Context",
    body: "Help our AI understand your baseline health profile before assessing symptoms.",
    tip: "The more context you provide, the more accurate your AI-generated health insights will be.",
  },
  2: {
    badge: "Step 02 of 04",
    title: "Detailed Assessment",
    body: "Specific details about each symptom help the AI identify potential patterns more accurately.",
    tip: "You can add multiple symptoms and describe each one individually.",
  },
  3: {
    badge: "Step 03 of 04",
    title: "Medical History",
    body: "Your medical history helps the AI contextualize symptoms against known hereditary or chronic conditions.",
    tip: "Only include clinical information. Avoid names or dates of birth.",
  },
  4: {
    badge: "Step 04 of 04",
    title: "Review & Submit",
    body: "Verify all information before sending it to our AI analysis engine.",
    tip: "You can go back and edit any section before submitting.",
  },
};

const RATING_CONFIG = {
  Low: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    badge: "bg-emerald-100 text-emerald-700",
    icon: CheckCircle,
    label: "Low Risk",
    headlineLabel: "Routine",
  },
  Moderate: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    badge: "bg-amber-100 text-amber-700",
    icon: AlertCircle,
    label: "Moderate Risk",
    headlineLabel: "Monitor Closely",
  },
  High: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
    badge: "bg-orange-100 text-orange-700",
    icon: AlertTriangle,
    label: "High Risk",
    headlineLabel: "Urgent",
  },
  Emergency: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    badge: "bg-red-100 text-red-700",
    icon: Siren,
    label: "Emergency",
    headlineLabel: "Emergency",
  },
};

const fieldCls = "w-full px-4 py-3 bg-surface-container rounded-2xl text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm border border-surface-container-high";
const labelCls = "block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5 ml-1";

function StepBar({ current }) {
  return (
    <div className="flex items-center mb-8">
      {STEPS.map((step, i) => {
        const done = step.id < current;
        const active = step.id === current;
        return (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                  ${done ? "bg-tertiary/15 text-tertiary" : active ? "bg-primary text-white" : "bg-surface-container text-on-surface-variant border border-surface-container-high"}`}
              >
                {done ? <Check className="w-3.5 h-3.5" /> : step.id}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider hidden sm:block transition-colors duration-300
                ${done ? "text-tertiary" : active ? "text-primary" : "text-on-surface-variant opacity-50"}`}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-grow h-px mx-3 transition-all duration-500 ${done ? "bg-tertiary/30" : "bg-surface-container-high"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Sidebar({ step }) {
  const c = SIDEBAR_CONTENT[step];
  return (
    <motion.div
      key={step}
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full md:w-64 flex-shrink-0 flex flex-col gap-4 pt-2"
    >
      <div>
        <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-primary/10 text-primary mb-3">
          {c.badge}
        </span>
        <h2 className="text-2xl font-headline font-extrabold text-primary leading-tight mb-2">
          {c.title}
        </h2>
        <p className="text-sm text-on-surface-variant leading-relaxed">{c.body}</p>
      </div>
      <div className="bg-surface-container rounded-2xl p-4 border border-surface-container-high flex gap-3">
        <ShieldCheck className="w-4 h-4 text-tertiary shrink-0 mt-0.5" />
        <div>
          <p className="text-[11px] font-bold text-primary uppercase tracking-wider mb-1">Privacy note</p>
          <p className="text-[11px] text-on-surface-variant leading-relaxed">
            Do not include names or sensitive personal identifiers. Your input will be processed by AI for analysis.
          </p>
        </div>
      </div>
      <div className="bg-surface-container rounded-2xl p-4 border border-surface-container-high flex gap-3">
        <Lightbulb className="w-4 h-4 text-tertiary shrink-0 mt-0.5" />
        <div>
          <p className="text-[11px] font-bold text-primary uppercase tracking-wider mb-1">Tip</p>
          <p className="text-[11px] text-on-surface-variant leading-relaxed">{c.tip}</p>
        </div>
      </div>
    </motion.div>
  );
}

function StepContext({ data, onChange }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Age Range</label>
          <select className={fieldCls} value={data.ageRange} onChange={(e) => onChange("ageRange", e.target.value)}>
            <option value="">Select age range</option>
            {["Under 18", "18-24", "25-34", "35-44", "45-54", "55-64", "65+"].map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Biological Sex</label>
          <select className={fieldCls} value={data.sex} onChange={(e) => onChange("sex", e.target.value)}>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other / Prefer not to say</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Height (optional)</label>
          <input className={fieldCls} placeholder="e.g. 5'9&quot; or 175 cm" value={data.height} onChange={(e) => onChange("height", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Weight (optional)</label>
          <input className={fieldCls} placeholder="e.g. 160 lbs or 72 kg" value={data.weight} onChange={(e) => onChange("weight", e.target.value)} />
        </div>
      </div>
      <div>
        <label className={labelCls}>Current Medications (optional)</label>
        <textarea className={fieldCls} placeholder="List any medications you are currently taking…" rows={3} value={data.medications} onChange={(e) => onChange("medications", e.target.value)} />
      </div>
      <div>
        <label className={labelCls}>Known Allergies (optional)</label>
        <input className={fieldCls} placeholder="e.g. Penicillin, Pollen, Shellfish…" value={data.allergies} onChange={(e) => onChange("allergies", e.target.value)} />
      </div>
    </div>
  );
}

function SymptomCard({ symptom, onChange, onRemove }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="bg-surface-container rounded-2xl p-5 border border-surface-container-high border-l-2 border-l-tertiary"
    >
      <div className="flex justify-between items-start mb-4">
        <h4 className="font-bold text-primary flex items-center gap-2 text-sm">
          <Activity className="w-4 h-4" />
          {symptom.name}
        </h4>
        <button
          type="button"
          onClick={onRemove}
          className="text-on-surface-variant hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className={labelCls}>Duration</label>
          <input
            className={fieldCls}
            placeholder="e.g. 2 days"
            value={symptom.duration}
            onChange={(e) => onChange("duration", e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>Severity — {symptom.severity}/10</label>
          <div className="flex items-center gap-3 px-1 mt-2">
            <input
              type="range"
              min="1"
              max="10"
              value={symptom.severity}
              onChange={(e) => onChange("severity", Number(e.target.value))}
              className="flex-1 h-1.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <span className="text-xs font-bold text-primary min-w-[2rem] text-right">
              {symptom.severity}
            </span>
          </div>
        </div>
      </div>
      <div>
        <label className={labelCls}>Additional Notes</label>
        <textarea
          className={fieldCls}
          placeholder="Describe the symptom in more detail…"
          rows={2}
          value={symptom.notes}
          onChange={(e) => onChange("notes", e.target.value)}
        />
      </div>
    </motion.div>
  );
}

function StepSymptoms({ symptoms, onAdd, onUpdate, onRemove }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const categories = Object.keys(SYMPTOM_CATEGORIES);

  const poolForDropdown = activeCategory
    ? SYMPTOM_CATEGORIES[activeCategory]
    : ALL_SYMPTOMS;

  const filtered = poolForDropdown.filter(
    (s) =>
      s.toLowerCase().includes(query.toLowerCase()) &&
      !symptoms.find((sym) => sym.name.toLowerCase() === s.toLowerCase())
  );

  const addSymptom = (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd({ id: Date.now(), name: trimmed, duration: "", severity: 5, notes: "" });
    setQuery("");
    setShowSuggestions(false);
  };

  const categorySymptoms = activeCategory
    ? SYMPTOM_CATEGORIES[activeCategory].filter(
        (s) => !symptoms.find((sym) => sym.name.toLowerCase() === s.toLowerCase())
      )
    : [];

  return (
    <div className="space-y-5">
      <div>
        <label className={labelCls}>Browse by Category</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border
                ${activeCategory === cat
                  ? "bg-primary text-white border-primary"
                  : "bg-surface-container text-on-surface-variant border-surface-container-high hover:border-primary/40 hover:text-primary"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeCategory && !query && categorySymptoms.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <label className={labelCls}>{activeCategory}: tap to add</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {categorySymptoms.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addSymptom(s)}
                  className="px-3 py-1.5 rounded-full text-xs font-bold bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  + {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <label className={labelCls}>
          {activeCategory ? `Search within ${activeCategory}` : "Search All Symptoms"}
        </label>
        <div className="relative">
          <input
            className={`${fieldCls} pr-12`}
            placeholder={
              activeCategory
                ? `Filter ${activeCategory} symptoms…`
                : "Type any symptom (e.g. Cough, Fatigue)…"
            }
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) {
                e.preventDefault();
                addSymptom(query);
              }
            }}
          />
          <button
            type="button"
            onClick={() => addSymptom(query)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-primary-container transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>

          <AnimatePresence>
            {showSuggestions && query && filtered.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="absolute z-10 left-0 right-0 top-full mt-1 bg-surface-container-lowest rounded-2xl shadow-xl border border-surface-container-high overflow-hidden"
              >
                <div className="px-4 py-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-surface-container-high">
                  Suggestions
                </div>
                {filtered.slice(0, 6).map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-surface-container transition-colors text-on-surface"
                    onMouseDown={() => addSymptom(s)}
                  >
                    {s}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <p className="text-[11px] text-on-surface-variant mt-1.5 ml-1">
          Press Enter or click + to add a custom symptom not in the list.
        </p>
      </div>

      {symptoms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center">
            <Activity className="w-6 h-6 text-on-surface-variant opacity-40" />
          </div>
          <p className="text-sm text-on-surface-variant">No symptoms added yet. Browse a category or search above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {symptoms.map((sym) => (
              <SymptomCard
                key={sym.id}
                symptom={sym}
                onChange={(field, val) => onUpdate(sym.id, field, val)}
                onRemove={() => onRemove(sym.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function StepMedicalHistory({ data, onChange, onFileChange }) {
  const fileRef = useRef(null);

  return (
    <div className="space-y-5">
      <div>
        <label className={labelCls}>Family Medical History</label>
        <textarea
          className={fieldCls}
          placeholder="Describe relevant history (e.g. asthma, heart conditions, diabetes)…"
          rows={3}
          value={data.familyHistory}
          onChange={(e) => onChange("familyHistory", e.target.value)}
        />
        <p className="text-[11px] text-on-surface-variant mt-1.5 ml-1 italic">
          Only include clinical information. Avoid names or dates of birth.
        </p>
      </div>
      <div>
        <label className={labelCls}>Past Diagnoses (optional)</label>
        <textarea
          className={fieldCls}
          placeholder="e.g. Hypertension, Type 2 diabetes…"
          rows={2}
          value={data.pastDiagnoses}
          onChange={(e) => onChange("pastDiagnoses", e.target.value)}
        />
      </div>
      <div>
        <label className={labelCls}>Recent Lab Results or Tests (optional)</label>
        <textarea
          className={fieldCls}
          placeholder="Summarize any recent bloodwork, imaging, or other test results…"
          rows={2}
          value={data.labResults}
          onChange={(e) => onChange("labResults", e.target.value)}
        />
      </div>
      <div>
        <label className={labelCls}>Upload Image — Physical Conditions (optional)</label>
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-surface-container-high rounded-2xl p-8 flex flex-col items-center gap-3 bg-surface-container/30 hover:bg-surface-container cursor-pointer transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Plus className="w-5 h-5 text-primary" />
          </div>
          {data.uploadedFile ? (
            <p className="text-sm font-bold text-primary">✓ {data.uploadedFile.name}</p>
          ) : (
            <div className="text-center">
              <p className="text-sm font-bold text-primary">Click to upload or drag and drop</p>
              <p className="text-xs text-on-surface-variant mt-1">JPEG, PNG or PDF · up to 10MB</p>
            </div>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,application/pdf"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && onFileChange(e.target.files[0])}
        />
      </div>
    </div>
  );
}

function StepReview({ context, symptoms, history, onEdit }) {
  const Section = ({ title, stepIndex, children }) => (
    <div className="bg-surface-container rounded-2xl p-5 border border-surface-container-high space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{title}</h3>
        <button
          type="button"
          onClick={() => onEdit(stepIndex)}
          className="text-xs text-primary font-bold hover:underline"
        >
          Edit
        </button>
      </div>
      {children}
    </div>
  );

  const Row = ({ label, value }) =>
    value ? (
      <div className="flex justify-between text-sm gap-4">
        <span className="text-on-surface-variant shrink-0">{label}</span>
        <span className="text-on-surface text-right">{value}</span>
      </div>
    ) : null;

  return (
    <div className="space-y-4">
      <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-2xl">
        <p className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2">
          <Check className="w-3.5 h-3.5" /> Review your submission
        </p>
        <p className="text-xs text-primary/80 mt-1 leading-relaxed">
          Please review all details below before submitting to the AI analysis engine.
        </p>
      </div>

      <Section title="Context" stepIndex={1}>
        <Row label="Age Range" value={context.ageRange} />
        <Row label="Sex" value={context.sex} />
        <Row label="Height" value={context.height} />
        <Row label="Weight" value={context.weight} />
        <Row label="Medications" value={context.medications} />
        <Row label="Allergies" value={context.allergies} />
        {!context.ageRange && !context.sex && (
          <p className="text-xs text-on-surface-variant italic">No context provided.</p>
        )}
      </Section>

      <Section title={`Symptoms (${symptoms.length})`} stepIndex={2}>
        {symptoms.length === 0 ? (
          <p className="text-xs text-on-surface-variant italic">No symptoms added.</p>
        ) : (
          symptoms.map((s) => (
            <div key={s.id} className="text-sm border-b border-surface-container-high pb-2.5 last:border-0 last:pb-0">
              <div className="font-bold text-primary">{s.name}</div>
              <div className="text-on-surface-variant text-xs mt-0.5">
                Duration: {s.duration || "—"} · Severity: {s.severity}/10
                {s.notes && ` · "${s.notes}"`}
              </div>
            </div>
          ))
        )}
      </Section>

      <Section title="Medical History" stepIndex={3}>
        <Row label="Family History" value={history.familyHistory} />
        <Row label="Past Diagnoses" value={history.pastDiagnoses} />
        <Row label="Lab Results" value={history.labResults} />
        <Row label="Uploaded File" value={history.uploadedFile?.name} />
        {!history.familyHistory && !history.pastDiagnoses && !history.labResults && (
          <p className="text-xs text-on-surface-variant italic">No history provided.</p>
        )}
      </Section>
    </div>
  );
}

function RatingBadge({ rating }) {
  const config = RATING_CONFIG[rating] || RATING_CONFIG.Low;
  const Icon = config.icon;
  return (
    <div className={`w-full rounded-2xl p-5 border ${config.bg} ${config.border} flex items-center gap-4`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.badge}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-0.5">
          Urgency Level
        </p>
        <p className={`text-lg font-extrabold ${config.text}`}>{config.label}</p>
      </div>
    </div>
  );
}

const getUrgentCareMapUrl = (rating) =>
  rating === "Emergency"
    ? "https://www.google.com/maps/search/emergency+room+near+me"
    : "https://www.google.com/maps/search/urgent+care+near+me";

function SuccessScreen({ onReset, result }) {
  const rating = result?.rating;
  const analysis = result?.analysis;
  const urgencyScore = result?.urgencyScore;
  const headline = result?.headline;
  const warningSymptoms = result?.warningSymptoms || [];
  const needsUrgentCare = result?.needsUrgentCare;
  const config = RATING_CONFIG[rating] || RATING_CONFIG.Low;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center text-center py-8 px-6 gap-5"
    >
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
        <Check className="w-8 h-8 text-primary" />
      </div>
      <div>
        <h2 className="text-2xl font-headline font-extrabold text-primary mb-2">
          Assessment Complete
        </h2>
        <p className="text-sm text-on-surface-variant leading-relaxed max-w-sm">
          Here's what our AI found based on your symptoms. This is not a medical diagnosis.
        </p>
      </div>

      {rating && (
        <div className={`w-full rounded-2xl border p-5 text-left ${config.bg} ${config.border}`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${config.badge}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  {config.headlineLabel} {typeof urgencyScore === "number" ? `• Urgency Score ${urgencyScore}/10` : ""}
                </p>
                <p className={`mt-1 text-lg font-extrabold ${config.text}`}>
                  {headline || config.label}
                </p>
                <p className="mt-1 text-sm text-on-surface-variant">
                  {config.label}
                </p>
              </div>
            </div>

            {needsUrgentCare && (
              <a
                href={getUrgentCareMapUrl(rating)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-container"
              >
                Find Care Nearby
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      )}

      {rating && <RatingBadge rating={rating} />}

      {analysis && (
        <div className="w-full text-left bg-surface-container rounded-2xl p-6 border border-surface-container-high">
          <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5" /> AI Analysis
          </p>
          <p className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap">
            {analysis}
          </p>
        </div>
      )}

      {warningSymptoms.length > 0 && (
        <div className="w-full rounded-2xl border border-surface-container-high bg-surface-container-lowest p-6 text-left">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            Flagged Symptoms
          </p>
          <div className="flex flex-wrap gap-2">
            {warningSymptoms.map((symptom) => (
              <span
                key={symptom}
                className={`rounded-full px-3 py-1.5 text-xs font-bold ${config.badge}`}
              >
                {symptom}
              </span>
            ))}
          </div>
        </div>
      )}

      {rating && <AnalysisSupportActions rating={rating} />}

      <span className="inline-block bg-tertiary/10 text-tertiary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
        ✓ Secure Protocol Active
      </span>
      <button
        onClick={onReset}
        className="mt-2 py-3 px-8 bg-primary text-white rounded-2xl font-bold text-sm hover:bg-primary-container transition-colors"
      >
        Start New Assessment
      </button>
    </motion.div>
  );
}

export const SymptomChecker = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [context, setContext] = useState({
    ageRange: "", sex: "", height: "", weight: "", medications: "", allergies: "",
  });

  const [symptoms, setSymptoms] = useState([]);

  const [history, setHistory] = useState({
    familyHistory: "", pastDiagnoses: "", labResults: "", uploadedFile: null,
  });

  const updateContext = (field, value) => setContext((c) => ({ ...c, [field]: value }));
  const updateHistory = (field, value) => setHistory((h) => ({ ...h, [field]: value }));

  const addSymptom = (sym) => setSymptoms((prev) => [...prev, sym]);
  const updateSymptom = (id, field, value) =>
    setSymptoms((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  const removeSymptom = (id) => setSymptoms((prev) => prev.filter((s) => s.id !== id));

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = getStoredToken();
      const res = await fetch(`${API_BASE_URL}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ context, symptoms, history }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      setSubmitted(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setSubmitted(false);
    setResult(null);
    setError(null);
    setContext({ ageRange: "", sex: "", height: "", weight: "", medications: "", allergies: "" });
    setSymptoms([]);
    setHistory({ familyHistory: "", pastDiagnoses: "", labResults: "", uploadedFile: null });
  };

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 bg-surface">
      <div className="max-w-5xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row gap-8"
        >
          {!submitted && <Sidebar step={step} />}

          <div className="flex-1 bg-surface-container-lowest p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-surface-container-high">
            {submitted ? (
              <SuccessScreen onReset={handleReset} result={result} />
            ) : (
              <form>
                <StepBar current={step} />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.25 }}
                  >
                    {step === 1 && <StepContext data={context} onChange={updateContext} />}
                    {step === 2 && (
                      <StepSymptoms
                        symptoms={symptoms}
                        onAdd={addSymptom}
                        onUpdate={updateSymptom}
                        onRemove={removeSymptom}
                      />
                    )}
                    {step === 3 && (
                      <StepMedicalHistory
                        data={history}
                        onChange={updateHistory}
                        onFileChange={(f) => updateHistory("uploadedFile", f)}
                      />
                    )}
                    {step === 4 && (
                      <StepReview
                        context={context}
                        symptoms={symptoms}
                        history={history}
                        onEdit={(s) => setStep(s)}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="flex items-center justify-between pt-8 mt-8 border-t border-surface-container-high">
                  <button
                    type="button"
                    onClick={() => setStep((s) => s - 1)}
                    disabled={step === 1}
                    className="flex items-center gap-2 text-sm font-bold text-primary hover:underline disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="px-5 py-2.5 rounded-2xl text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-colors border border-surface-container-high"
                    >
                      Save Progress
                    </button>

                    {step < 4 ? (
                      <button
                        type="button"
                        onClick={() => setStep((s) => s + 1)}
                        className="flex items-center gap-2 bg-primary hover:bg-primary-container text-white px-6 py-2.5 rounded-2xl font-bold text-sm transition-colors"
                      >
                        Continue <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <div className="flex flex-col items-end gap-2">
                        <button
                          type="button"
                          onClick={handleSubmit}
                          disabled={loading}
                          className="flex items-center gap-2 bg-primary hover:bg-primary-container disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-2xl font-bold text-sm transition-colors"
                        >
                          {loading ? "Analyzing…" : "Submit Assessment"} <Check className="w-4 h-4" />
                        </button>
                        {error && <p className="text-xs text-red-500">{error}</p>}
                      </div>
                    )}
                  </div>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
