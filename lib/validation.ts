// Runtime validation derived directly from take-home-assignment.json — the
// graded form's own declared question types and option lists — instead of a
// hand-maintained parallel schema that could quietly drift from it.
//
// Used two ways:
//  1. sanitizeBeatResult() — defends the /api/extract route: even though we
//     ask Groq for strict json_schema output, a bad response is coerced
//     field-by-field to a safe null/[] rather than corrupting state.
//  2. validateFinalAnswers() — runs on the Review screen before submit, so
//     "the form actually gets filled correctly" is a checked fact, not a
//     hope. See README "How you tested the fill".

import { z, type ZodTypeAny } from "zod";
import formSchema from "@/take-home-assignment.json";
import type { BeatField } from "@/lib/beats";
import type { IntakeState } from "@/lib/schema";

interface JsonFollowup {
  key: string;
  type: string;
  options?: string[];
}
interface JsonRow {
  key?: string;
  type?: string;
  options?: string[];
  followup?: JsonFollowup;
}
interface JsonColumn {
  key: string;
  type: string;
  options?: string[];
}
interface JsonQuestion {
  n: number;
  key: string;
  type: string;
  options?: string[];
  femaleOnly?: boolean;
  rows?: JsonRow[] | string[];
  columns?: JsonColumn[];
  followup?: JsonFollowup;
}
interface JsonSection {
  id: string;
  title: string;
  questions: JsonQuestion[];
}
interface JsonForm {
  form: string;
  sections: JsonSection[];
}

const FORM = formSchema as JsonForm;

function leafSchema(type: string | undefined, options?: string[]): ZodTypeAny {
  switch (type) {
    case "number":
      return z.number().nullable();
    case "yesno":
      return z.enum(["Yes", "No"]).nullable();
    case "bool":
      return z.boolean().nullable();
    case "text":
      return z.string().nullable();
    case "single":
      return options?.length ? z.enum(options as [string, ...string[]]).nullable() : z.string().nullable();
    case "multi":
      return options?.length ? z.array(z.enum(options as [string, ...string[]])) : z.array(z.string());
    default:
      return z.unknown();
  }
}

function tableSchema(q: JsonQuestion): ZodTypeAny {
  if (q.columns) {
    // Q12/Q13 shape: rows is a plain string array, columns define each row's fields.
    const colShape: Record<string, ZodTypeAny> = {};
    for (const col of q.columns) colShape[col.key] = leafSchema(col.type, col.options);
    const rowSchema = z.object(colShape);
    const rowKeys = (q.rows as string[]) ?? [];
    return z.object(Object.fromEntries(rowKeys.map((r) => [r, rowSchema])));
  }
  // Q11 shape: rows carry their own key/type (+ optional followup), flattened as siblings.
  const shape: Record<string, ZodTypeAny> = {};
  for (const row of (q.rows as JsonRow[]) ?? []) {
    if (!row.key || !row.type) continue;
    shape[row.key] = leafSchema(row.type, row.options);
    if (row.followup) shape[row.followup.key] = leafSchema(row.followup.type, row.followup.options);
  }
  return z.object(shape);
}

/** Zod schema for the full 16-question answer set, built straight from the JSON file. */
export function buildIntakeAnswersSchema() {
  const shape: Record<string, ZodTypeAny> = {};
  for (const section of FORM.sections) {
    for (const q of section.questions) {
      shape[q.key] = q.type === "table" ? tableSchema(q) : leafSchema(q.type, q.options);
      if (q.followup) shape[q.followup.key] = leafSchema(q.followup.type, q.followup.options);
    }
  }
  return z.object(shape);
}

export const IntakeAnswersSchema = buildIntakeAnswersSchema();

/** Validates the collected answers (minus UI-only `sex` metadata) against the source form schema. */
export function validateFinalAnswers(state: IntakeState) {
  const { sex: _sex, ...answers } = state;
  void _sex;
  return IntakeAnswersSchema.safeParse(answers);
}

function beatFieldLeaf(field: BeatField): ZodTypeAny {
  if (field.kind === "number") return z.number().nullable();
  if (field.kind === "yesno") return z.enum(["Yes", "No"]).nullable();
  if (field.kind === "text") return z.string().nullable();
  if (field.kind === "multi") {
    return field.options ? z.array(z.enum(field.options as unknown as [string, ...string[]])) : z.array(z.string());
  }
  return field.options ? z.enum(field.options as unknown as [string, ...string[]]).nullable() : z.string().nullable();
}

/** Coerces a Groq extraction response to a guaranteed-safe shape, field by field. */
export function sanitizeBeatResult(fields: BeatField[], raw: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const field of fields) {
    const parsed = beatFieldLeaf(field).safeParse(raw[field.key]);
    out[field.key] = parsed.success ? parsed.data : field.kind === "multi" ? [] : null;
  }
  return out;
}
