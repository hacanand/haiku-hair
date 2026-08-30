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

// ---- Illustrations (public/images), matched per option where we have one ----

export const PATTERN_IMAGES: Record<string, string> = {
  "Receding hairline": "/images/receding-hairline.png",
  "Thinning at crown": "/images/thinning-crown.png",
  "Widening part line": "/images/widening-part.png",
  "Diffuse thinning": "/images/diffuse-thinning.png",
  "Patchy loss": "/images/patchy-loss.png",
  "Sudden excessive shedding": "/images/sudden-shedding.png",
};

export const CONDITION_IMAGES: Record<string, string> = {
  "PCOS/PCOD": "/images/pcos-pcod.png",
  "Thyroid disorder": "/images/thyroid-hormonal.png",
  Diabetes: "/images/diabetes-blood-sugar.png",
  "Autoimmune disease": "/images/autoimmune-condition.png",
  Anemia: "/images/anemia-low-iron.png",
};

export const PAST6_IMAGES: Record<string, string> = {
  "Crash dieting or major weight loss": "/images/rapid-weight-loss.png",
  "High stress or emotional trauma": "/images/severe-stress.png",
  "Fever with illness (COVID, Dengue, Typhoid)": "/images/viral-illness.png",
  "Recent surgery": "/images/recent-surgery.png",
  "Change in location/water/air quality": "/images/hard-water-relocation.png",
};

export const SAMPLE_IMAGES: Record<string, string> = {
  Saliva: "/images/sample-saliva.png",
  Blood: "/images/sample-blood.png",
  Either: "/images/sample-either.png",
};

export const MISC_IMAGES = {
  menstrual: "/images/menstrual-pattern.png",
  pregnancy: "/images/pregnancy-postpartum.png",
  acne: "/images/adult-acne-oily-scalp.png",
  facialHair: "/images/excessive-facial-body-hair.png",
  healthIntro: "/images/general-health-check.png",
  hairWash: "/images/hair-wash-scalp-care.png",
  shelf: "/images/hair-care-shelf.png",
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
