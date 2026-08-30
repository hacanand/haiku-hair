"use client";

import { TableRowsStep } from "@/components/intake/table-rows-step";
import { useIntakeStore } from "@/lib/store";
import {
  PRODUCT_ROWS,
  PROCEDURE_ROWS,
  PRODUCT_DURATION_OPTIONS,
  PROCEDURE_SESSIONS_OPTIONS,
  MISC_IMAGES,
} from "@/lib/schema";
import type { ProductAnswer, ProcedureAnswer } from "@/lib/schema";

export function ProductsStep() {
  const products = useIntakeStore((s) => s.answers.products);
  const setProductField = useIntakeStore((s) => s.setProductField);
  const goNext = useIntakeStore((s) => s.goNext);

  return (
    <TableRowsStep
      eyebrow="Products you've tried"
      sectionTitle="Have you used this before?"
      rows={PRODUCT_ROWS}
      rowImages={{ "OTC/Medicated Shampoos": MISC_IMAGES.shelf }}
      primaryQuestion={(row) => `Have you used ${row}?`}
      primaryKey="used"
      extraFields={[
        { key: "duration", label: "For how long?", kind: "single", options: PRODUCT_DURATION_OPTIONS },
        { key: "helped", label: "Did it help?", kind: "yesno" },
        { key: "side_effects", label: "Any side effects?", kind: "yesno" },
      ]}
      getRowAnswer={(row) => products[row] as unknown as Record<string, ProductAnswer[keyof ProductAnswer]>}
      setRowField={(row, field, value) => setProductField(row, field as keyof ProductAnswer, value as never)}
      onFinish={goNext}
    />
  );
}

export function ProceduresStep() {
  const procedures = useIntakeStore((s) => s.answers.procedures);
  const setProcedureField = useIntakeStore((s) => s.setProcedureField);
  const goNext = useIntakeStore((s) => s.goNext);

  return (
    <TableRowsStep
      eyebrow="In-clinic procedures"
      sectionTitle="Have you had this done in-clinic?"
      rows={PROCEDURE_ROWS}
      primaryQuestion={(row) => `Have you had ${row} done?`}
      primaryKey="done"
      extraFields={[
        { key: "sessions", label: "How many sessions?", kind: "single", options: PROCEDURE_SESSIONS_OPTIONS },
        { key: "helped", label: "Did it help?", kind: "yesno" },
      ]}
      getRowAnswer={(row) => procedures[row] as unknown as Record<string, ProcedureAnswer[keyof ProcedureAnswer]>}
      setRowField={(row, field, value) => setProcedureField(row, field as keyof ProcedureAnswer, value as never)}
      onFinish={goNext}
    />
  );
}
