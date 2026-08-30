// Single source of truth for the 16-question GenoRoot intake — option lists,
// row labels and the illustration map. Mirrors take-home-assignment.json
// verbatim (option wording matters less than coverage, but matching the
// machine-readable schema keeps the final export easy to grade).
// Pure data only — safe to import from both server (API routes) and client
// (step components) code.

export type YesNo = "Yes" | "No";
export type Sex = "female" | "male" | "unspecified";

export const DURATION_OPTIONS = [
  "Less than 6 months",
  "6-12 months",
  "Over a year",
] as const;

export const FAMILY_OPTIONS = [
  "Father had hair loss",
  "Mother had hair loss",
  "Siblings with thinning or baldness",
  "No known family history",
] as const;

export const PATTERN_OPTIONS = [
  "Receding hairline",
  "Thinning at crown",
  "Widening part line",
  "Diffuse thinning",
  "Patchy loss",
  "Sudden excessive shedding",
] as const;

export const CONDITION_OPTIONS = [
  "PCOS/PCOD",
  "Thyroid disorder",
  "Diabetes",
  "Autoimmune disease",
  "Anemia",
  "None",
] as const;

export const MENSTRUAL_OPTIONS = [
  "Regular",
  "Irregular",
  "Menopausal",
  "Not applicable",
] as const;

export const PREGNANCY_OPTIONS = [
  "Currently pregnant",
  "Postpartum <1 year",
  "Not applicable",
] as const;

export const PAST6_OPTIONS = [
  "Crash dieting or major weight loss",
  "High stress or emotional trauma",
  "Fever with illness (COVID, Dengue, Typhoid)",
  "Recent surgery",
  "Change in location/water/air quality",
] as const;

export const SMOKING_SEVERITY_OPTIONS = [
  "Mild <5/day",
  "Moderate 5-10/day",
  "Severe >10/day",
] as const;

export const WASH_FREQUENCY_OPTIONS = ["Daily", "Alternate Days", "Weekly"] as const;

export const PRODUCT_DURATION_OPTIONS = ["<3mo", "3-6mo", ">6mo"] as const;

export const PROCEDURE_SESSIONS_OPTIONS = ["1-3", "4-6", ">6"] as const;

export const SAMPLE_OPTIONS = ["Saliva", "Blood", "Either"] as const;

export const PRODUCT_ROWS = [
  "OTC/Medicated Shampoos",
  "Hair Oils/Serums",
  "Topical Minoxidil",
  "Oral Minoxidil",
  "Supplements",
] as const;

export const PROCEDURE_ROWS = [
  "PRP/GFC/iPRF",
  "Stem Cells/Exosomes",
  "Hair Transplant",
  "Other",
] as const;

// ---- Full-text display labels ----
// The stored value always matches the source form's exact wording (schema
// fidelity for grading); these are only what the patient reads — spelled
// out instead of the form's slash-joined shorthand or unit abbreviations.

export const PRODUCT_ROW_LABELS: Record<string, string> = {
  "OTC/Medicated Shampoos": "Over-the-counter or medicated shampoos",
  "Hair Oils/Serums": "Hair oils or serums",
  "Topical Minoxidil": "Topical minoxidil",
  "Oral Minoxidil": "Oral minoxidil",
  Supplements: "Supplements",
};

export const PROCEDURE_ROW_LABELS: Record<string, string> = {
  "PRP/GFC/iPRF": "PRP, GFC, or iPRF therapy",
  "Stem Cells/Exosomes": "Stem cell or exosome therapy",
  "Hair Transplant": "Hair transplant",
  Other: "Other procedure",
};

export const PRODUCT_DURATION_LABELS: Record<string, string> = {
  "<3mo": "Less than 3 months",
  "3-6mo": "3 to 6 months",
  ">6mo": "More than 6 months",
};

export const PROCEDURE_SESSIONS_LABELS: Record<string, string> = {
  "1-3": "1 to 3 sessions",
  "4-6": "4 to 6 sessions",
  ">6": "More than 6 sessions",
};

// ---- Illustrations (public/images), matched per option where we have one ----

export const PATTERN_IMAGES: Record<string, string> = {
  "Receding hairline": "https://ucarecdn.com/3cf6bd0c-014a-499f-9987-d3006fb0732d/receding-hairline.png",
  "Thinning at crown": "https://ucarecdn.com/686d91b6-1703-4c9c-847a-a2ccc3a4de4e/thinning-crown.png",
  "Widening part line": "https://ucarecdn.com/42f714a5-a0cb-4dbd-9dd7-9f75581c028a/widening-part.png",
  "Diffuse thinning": "https://ucarecdn.com/0b3598f2-dfbf-40f9-81e7-6b3ad62b9be9/diffuse-thinning.png",
  "Patchy loss": "https://ucarecdn.com/edf01f15-b83e-4829-b254-563914ccfff4/patchy-loss.png",
  "Sudden excessive shedding": "https://ucarecdn.com/70fe1814-b850-4ab3-a14f-619bd4e5459c/sudden-shedding.png",
};

export const CONDITION_IMAGES: Record<string, string> = {
  "PCOS/PCOD": "https://ucarecdn.com/2734b163-0a77-4c00-a80a-e39c10f16e56/pcos-pcod.png",
  "Thyroid disorder": "https://ucarecdn.com/5dd8a6f1-33e5-4cf3-a103-1e195bb2e8a7/thyroid-hormonal.png",
  Diabetes: "https://ucarecdn.com/8f5aa24f-ac01-46c2-9723-3255f4ea7222/diabetes-blood-sugar.png",
  "Autoimmune disease": "https://ucarecdn.com/39d1de0e-3652-41b4-8661-5f04a0d5c69b/autoimmune-condition.png",
  Anemia: "https://ucarecdn.com/dba75c7f-c1f6-4208-bd66-0537bf751ea8/anemia-low-iron.png",
};

export const PAST6_IMAGES: Record<string, string> = {
  "Crash dieting or major weight loss": "https://ucarecdn.com/1f272ced-d464-4732-ae18-65990c44d569/rapid-weight-loss.png",
  "High stress or emotional trauma": "https://ucarecdn.com/8bf44ae9-d18e-401a-b4e3-45d99769a897/severe-stress.png",
  "Fever with illness (COVID, Dengue, Typhoid)": "https://ucarecdn.com/dd0a8876-e962-4f3b-8e6e-706b611ab6c3/viral-illness.png",
  "Recent surgery": "https://ucarecdn.com/bcec9bbd-1b6c-4f21-a63e-c8c771f156aa/recent-surgery.png",
  "Change in location/water/air quality": "https://ucarecdn.com/2fe83ab7-8881-4388-b223-32a12178ef0b/hard-water-relocation.png",
};

export const SAMPLE_IMAGES: Record<string, string> = {
  Saliva: "https://ucarecdn.com/05bb4409-d0a2-420c-b613-6ee948b0fad9/sample-saliva.png",
  Blood: "https://ucarecdn.com/ebdc23bf-2d03-49c3-879d-9d4009c69ef6/sample-blood.png",
  Either: "https://ucarecdn.com/07898465-acdf-4270-9842-ee3471eaa87a/sample-either.png",
};

export const MISC_IMAGES = {
  menstrual: "https://ucarecdn.com/7eec36aa-454a-4dfa-b7b5-1b104ad4ff93/menstrual-pattern.png",
  pregnancy: "https://ucarecdn.com/aecdca15-9283-428a-85ca-a96a8d622d0c/pregnancy-postpartum.png",
  acne: "https://ucarecdn.com/cf0d1fe2-2d9f-4576-8e4c-c780c7dbc416/adult-acne-oily-scalp.png",
  facialHair: "https://ucarecdn.com/d4f773f3-e7e7-4ee9-9251-118c6e2a4c80/excessive-facial-body-hair.png",
  healthIntro: "https://ucarecdn.com/91911fbf-e5ff-463f-9cc7-d513ca513eee/general-health-check.png",
  hairWash: "https://ucarecdn.com/2b172c0b-79e7-4ab9-b508-0c42ae1145c4/hair-wash-scalp-care.png",
  shelf: "https://ucarecdn.com/9af152f7-6662-4ecd-8859-aaef67bf43fb/hair-care-shelf.png",
} as const;

// ---- Answer shape ----

export interface HabitsAnswers {
  smoking: YesNo | null;
  smoking_severity: string | null;
  alcohol: YesNo | null;
  hard_water: YesNo | null;
  hair_wash_frequency: string | null;
  heating_tools_styling_chemicals: YesNo | null;
  salon_treatments: YesNo | null;
  salon_treatment_detail: string | null;
}

export interface ProductAnswer {
  used: boolean | null;
  duration: string | null;
  helped: YesNo | null;
  side_effects: YesNo | null;
}

export interface ProcedureAnswer {
  done: boolean | null;
  sessions: string | null;
  helped: YesNo | null;
}

export interface IntakeState {
  sex: Sex | null;
  age_hair_loss_began: number | null;
  duration: string | null;
  family_history: string[];
  pattern: string[];
  diagnosed_conditions: string[];
  menstrual_cycle: string | null;
  pregnancy_related: string | null;
  adult_acne_oily_skin: YesNo | null;
  excess_body_facial_hair: YesNo | null;
  past_6_months: string[];
  habits: HabitsAnswers;
  products: Record<string, ProductAnswer>;
  procedures: Record<string, ProcedureAnswer>;
  past_treatment_side_effects: YesNo | null;
  describe: string | null;
  sample_type: string | null;
  consent: YesNo | null;
}

export function createInitialState(): IntakeState {
  return {
    sex: null,
    age_hair_loss_began: null,
    duration: null,
    family_history: [],
    pattern: [],
    diagnosed_conditions: [],
    menstrual_cycle: null,
    pregnancy_related: null,
    adult_acne_oily_skin: null,
    excess_body_facial_hair: null,
    past_6_months: [],
    habits: {
      smoking: null,
      smoking_severity: null,
      alcohol: null,
      hard_water: null,
      hair_wash_frequency: null,
      heating_tools_styling_chemicals: null,
      salon_treatments: null,
      salon_treatment_detail: null,
    },
    products: Object.fromEntries(
      PRODUCT_ROWS.map((row) => [row, { used: null, duration: null, helped: null, side_effects: null }])
    ),
    procedures: Object.fromEntries(
      PROCEDURE_ROWS.map((row) => [row, { done: null, sessions: null, helped: null }])
    ),
    past_treatment_side_effects: null,
    describe: null,
    sample_type: null,
    consent: null,
  };
}

// Builds the final, gradeable structured export — grouped by section like
// the source form (take-home-assignment.json), plus the intake metadata.
export function buildOutput(state: IntakeState) {
  return {
    form: "GenoRoot Hair & Scalp Intake",
    submitted_at: new Date().toISOString(),
    patient: { sex: state.sex ?? "unspecified" },
    sections: {
      A: {
        title: "Personal & Family Hair Loss History",
        age_hair_loss_began: state.age_hair_loss_began,
        duration: state.duration,
        family_history: state.family_history,
        pattern: state.pattern,
      },
      B: {
        title: "Hormonal & Health Influences",
        diagnosed_conditions: state.diagnosed_conditions,
        menstrual_cycle: state.menstrual_cycle,
        pregnancy_related: state.pregnancy_related,
        adult_acne_oily_skin: state.adult_acne_oily_skin,
        excess_body_facial_hair: state.excess_body_facial_hair,
      },
      C: {
        title: "Lifestyle & Environmental Triggers",
        past_6_months: state.past_6_months,
        habits: state.habits,
      },
      D: {
        title: "Current Hair Care & Treatments",
        products: PRODUCT_ROWS.map((row) => ({ row, ...state.products[row] })),
        procedures: PROCEDURE_ROWS.map((row) => ({ row, ...state.procedures[row] })),
        past_treatment_side_effects: state.past_treatment_side_effects,
        describe: state.describe,
      },
      E: {
        title: "Sample Collection & Consent",
        sample_type: state.sample_type,
        consent: state.consent,
      },
    },
  };
}
