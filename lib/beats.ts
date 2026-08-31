// The 4 voice beats: what the copilot says, the strict JSON Schema Groq must
// answer with (response_format: json_schema, so the model can't invent
// fields or values outside our enums), and the chip field metadata the UI
// uses to render + edit the extracted answer. One file so prompt, schema and
// UI stay in sync.

import {
  DURATION_OPTIONS,
  FAMILY_OPTIONS,
  PATTERN_OPTIONS,
  PATTERN_IMAGES,
  PAST6_OPTIONS,
  PAST6_IMAGES,
  SMOKING_SEVERITY_OPTIONS,
  WASH_FREQUENCY_OPTIONS,
  MISC_IMAGES,
} from "@/lib/schema";

export type BeatFieldKind = "number" | "single" | "multi" | "yesno" | "text";

export interface BeatField {
  key: string;
  label: string;
  kind: BeatFieldKind;
  options?: readonly string[];
  /** Renders this field nested under a parent chip, only when parent equals this value. */
  followupOf?: { key: string; equals: string };
  /** Force bottom-sheet editing even for small option counts (per design spec). */
  sheet?: boolean;
  /** Empty array is a valid, confident answer ("None of these") rather than "missing". */
  allowEmpty?: boolean;
  /** Per-option illustration thumbnails shown in the sheet editor, where we have them. */
  optionImages?: Record<string, string>;
}

export interface Beat {
  id: "A" | "B" | "C" | "D";
  title: string;
  promptText: string;
  audioSrc: string;
  systemPrompt: string;
  jsonSchema: Record<string, unknown>;
  fields: BeatField[];
  heroImage?: string;
}

// Gender pre-fill signal for the sex-gate screen, which immediately follows
// Beat A (see STEP_ORDER in lib/steps.ts) — so Beat A is the only beat that
// runs early enough for this to be useful, and the only one wired up below.
const LIKELY_SEX_PROMPT_SUFFIX =
  ' Separately, set likely_sex ONLY if the patient\'s own words contain an unambiguous self-referential cue to their own sex — e.g. a Hindi verb/adjective that grammatically agrees with a first-person subject ("pareshaan tha" vs "pareshaan thi"), or an explicit statement like "main ek mahila hoon"/"main aadmi hoon". Do not infer it from topic, tone, name, or any indirect cue — if there\'s no clear grammatical or explicit self-reference, set it to null. This is a low-stakes pre-fill the patient always confirms afterward, but a wrong guess is worse than no guess, so default to null whenever uncertain.';

const LIKELY_SEX_SCHEMA_PROPERTY = {
  likely_sex: {
    type: ["string", "null"],
    enum: ["female", "male", null],
    description: "Only set from a clear grammatical/self-referential cue in the patient's own words — null otherwise.",
  },
} as const;

export const BEAT_A: Beat = {
  id: "A",
  title: "Hair story",
  promptText:
    "Bataiye, hair loss kab shuru hua tha — umar kitni thi tab — aur kitne time se chal raha hai? Aur family mein kisi ko, jaise papa, mummy ya bhai-behen ko, aisi hi problem rahi hai?",
  audioSrc: "https://ucarecdn.com/333ecee6-41a9-4adb-a386-ea52ca468a81/beat-a.wav",
  heroImage: "https://ucarecdn.com/9c236ffc-f5f4-43c8-9eb6-c4d12828ac1a/-/preview/",
  systemPrompt:
    "The patient is answering: when did hair loss begin (age), how long has it been going on, and whether anyone in their family (father/mother/siblings) has had hair loss. They may also casually mention the shape/pattern of their hair loss (receding hairline, crown thinning, widening part, diffuse thinning, patchy loss, sudden shedding) — capture it only if actually said, never guess it from other context." +
    LIKELY_SEX_PROMPT_SUFFIX,
  jsonSchema: {
    type: "object",
    additionalProperties: false,
    properties: {
      age_hair_loss_began: { type: ["integer", "null"], description: "Age in years, or null if not mentioned" },
      duration: { type: ["string", "null"], enum: [...DURATION_OPTIONS, null] },
      family_history: { type: "array", items: { type: "string", enum: [...FAMILY_OPTIONS] } },
      pattern: { type: "array", items: { type: "string", enum: [...PATTERN_OPTIONS] } },
      ...LIKELY_SEX_SCHEMA_PROPERTY,
    },
    required: ["age_hair_loss_began", "duration", "family_history", "pattern", "likely_sex"],
  },
  fields: [
    { key: "age_hair_loss_began", label: "Age it began", kind: "number" },
    { key: "duration", label: "Duration", kind: "single", options: DURATION_OPTIONS },
    { key: "family_history", label: "Family history", kind: "multi", options: FAMILY_OPTIONS, sheet: true },
    { key: "pattern", label: "Pattern", kind: "multi", options: PATTERN_OPTIONS, sheet: true, optionImages: PATTERN_IMAGES },
  ],
};

export const BEAT_B: Beat = {
  id: "B",
  title: "Life changes",
  promptText:
    "Pichhle 6 mahine mein kuch aisa hua jo bataana zaroori ho — bahut stress, weight loss, bukhaar ya koi illness, surgery, ya kahin shift hona?",
  audioSrc: "https://ucarecdn.com/aefc17e0-a6f0-42ed-beab-4dc134a3a41b/beat-b.wav",
  heroImage: "https://ucarecdn.com/9df2dcbf-37c0-4e4c-a689-86791aa29d77/-/preview/",
  systemPrompt:
    "The patient is listing anything from the past 6 months that could explain hair loss: crash dieting/weight loss, high stress or emotional trauma, fever/illness like COVID/dengue/typhoid, recent surgery, or a change in location/water/air quality. If they say nothing applies (e.g. 'kuch nahi', 'nothing', 'all fine'), return an empty array — that is a complete, confident answer, not a missing one.",
  jsonSchema: {
    type: "object",
    additionalProperties: false,
    properties: {
      past_6_months: { type: "array", items: { type: "string", enum: [...PAST6_OPTIONS] } },
    },
    required: ["past_6_months"],
  },
  fields: [
    { key: "past_6_months", label: "Recent life changes", kind: "multi", options: PAST6_OPTIONS, sheet: true, allowEmpty: true, optionImages: PAST6_IMAGES },
  ],
};

export const BEAT_C: Beat = {
  id: "C",
  title: "Daily routine",
  promptText:
    "Ab apni roz ki routine bataiye — smoking ya alcohol lete hain? Paani hard hai ghar ka? Baal kitni baar dhote hain? Aur koi salon treatment jaise keratin ya rebonding karwaya hai?",
  audioSrc: "https://ucarecdn.com/2c32bff4-77c1-463f-83d6-86df0ab250dd/beat-c.wav",
  heroImage: MISC_IMAGES.hairWash,
  systemPrompt:
    "The patient describes daily habits: smoking (and if yes, how many/day), alcohol, whether their home water supply is hard, how often they wash their hair, use of heating tools or styling chemicals, and any salon treatments like keratin/rebonding/smoothening (and if yes, which one). Only fill a field if it was actually mentioned; leave others null.",
  jsonSchema: {
    type: "object",
    additionalProperties: false,
    properties: {
      smoking: { type: ["string", "null"], enum: ["Yes", "No", null] },
      smoking_severity: { type: ["string", "null"], enum: [...SMOKING_SEVERITY_OPTIONS, null] },
      alcohol: { type: ["string", "null"], enum: ["Yes", "No", null] },
      hard_water: { type: ["string", "null"], enum: ["Yes", "No", null] },
      hair_wash_frequency: { type: ["string", "null"], enum: [...WASH_FREQUENCY_OPTIONS, null] },
      heating_tools_styling_chemicals: { type: ["string", "null"], enum: ["Yes", "No", null] },
      salon_treatments: { type: ["string", "null"], enum: ["Yes", "No", null] },
      salon_treatment_detail: { type: ["string", "null"], description: "Which salon treatment, in the patient's words" },
    },
    required: [
      "smoking",
      "smoking_severity",
      "alcohol",
      "hard_water",
      "hair_wash_frequency",
      "heating_tools_styling_chemicals",
      "salon_treatments",
      "salon_treatment_detail",
    ],
  },
  fields: [
    { key: "smoking", label: "Smoking", kind: "yesno" },
    { key: "smoking_severity", label: "How much", kind: "single", options: SMOKING_SEVERITY_OPTIONS, followupOf: { key: "smoking", equals: "Yes" } },
    { key: "alcohol", label: "Alcohol", kind: "yesno" },
    { key: "hard_water", label: "Hard water", kind: "yesno" },
    { key: "hair_wash_frequency", label: "Hair wash frequency", kind: "single", options: WASH_FREQUENCY_OPTIONS },
    { key: "heating_tools_styling_chemicals", label: "Heating tools / chemicals", kind: "yesno" },
    { key: "salon_treatments", label: "Salon treatments", kind: "yesno" },
    { key: "salon_treatment_detail", label: "Which treatment", kind: "text", followupOf: { key: "salon_treatments", equals: "Yes" } },
  ],
};

export const BEAT_D: Beat = {
  id: "D",
  title: "Past treatment response",
  promptText:
    "Kya kisi purane treatment se koi side effect hua, ya wo aapke liye kaam nahi kiya? Apne shabdon mein bataiye.",
  audioSrc: "https://ucarecdn.com/c69187c0-6793-431f-bd2f-4d46aab03dea/beat-d.wav",
  heroImage: "https://ucarecdn.com/236fce9f-82e4-4d34-ac07-a61171997976/-/preview/",
  systemPrompt:
    "The patient is describing, in their own words, whether any past hair treatment gave them a side effect or simply didn't work. Set past_treatment_side_effects to 'Yes' if they describe any problem/side effect/lack of result, 'No' if they clearly say everything was fine, or null if unclear. Put a short direct summary close to their own words in describe (null if nothing to report).",
  jsonSchema: {
    type: "object",
    additionalProperties: false,
    properties: {
      past_treatment_side_effects: { type: ["string", "null"], enum: ["Yes", "No", null] },
      describe: { type: ["string", "null"] },
    },
    required: ["past_treatment_side_effects", "describe"],
  },
  // These two fields still need to be declared (used by the sanitizer and by
  // applyBeatResult to know what to merge) even though the UI renders them
  // with a bespoke combined chip (PastTreatmentChip), not the generic field
  // loop — per spec this stays one quoted yes/no + text chip, never split
  // further. VoiceBeatStep special-cases beat "D" to skip the generic loop.
  fields: [
    { key: "past_treatment_side_effects", label: "Past treatment response", kind: "yesno" },
    { key: "describe", label: "Details", kind: "text" },
  ],
};

export const BEATS: Record<"A" | "B" | "C" | "D", Beat> = {
  A: BEAT_A,
  B: BEAT_B,
  C: BEAT_C,
  D: BEAT_D,
};
