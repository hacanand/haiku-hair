"use client";

import { Clock, ThumbsUp, ShieldAlert, Repeat } from "lucide-react";
import { TableRowsStep } from "@/components/intake/table-rows-step";
import { useIntakeStore } from "@/lib/store";
import {
  PRODUCT_ROWS,
  PROCEDURE_ROWS,
  PRODUCT_ROW_LABELS,
  PROCEDURE_ROW_LABELS,
  PRODUCT_DURATION_OPTIONS,
  PRODUCT_DURATION_LABELS,
  PROCEDURE_SESSIONS_OPTIONS,
  PROCEDURE_SESSIONS_LABELS,
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
      rowLabels={PRODUCT_ROW_LABELS}
      rowImages={{ 
        "OTC/Medicated Shampoos": MISC_IMAGES.shelf,
        "Hair Oils/Serums": "https://ucarecdn.com/80be3a42-0362-40ef-8398-0d9fd6d92d74/Hair_Oil_with_Herbal_Products.png",
        "Topical Minoxidil": "https://ucarecdn.com/47f994e9-fb3b-472e-9fed-39205e490724/topical_minoxidil.png",
        "Oral Minoxidil": "https://ucarecdn.com/0ae93600-13eb-4486-8266-86ecd240b1c0/oral_minoxidil.png",
        "Supplements": "https://ucarecdn.com/4dd06478-2bad-4df1-9cd4-ceda4d7a56cb/hair_supplements.png"
      }}
      primaryQuestion={(rowLabel) => `Have you used ${rowLabel.charAt(0).toLowerCase() + rowLabel.slice(1)}?`}
      primaryKey="used"
      extraFields={[
        {
          key: "duration",
          label: "For how long?",
          icon: Clock,
          kind: "single",
          options: PRODUCT_DURATION_OPTIONS,
          optionLabels: PRODUCT_DURATION_LABELS,
        },
        { key: "helped", label: "Did it help?", icon: ThumbsUp, kind: "yesno" },
        { key: "side_effects", label: "Any side effects?", icon: ShieldAlert, kind: "yesno" },
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
      rowLabels={PROCEDURE_ROW_LABELS}
      rowImages={{
        "PRP/GFC/iPRF": "https://ucarecdn.com/c394fc2d-0129-4828-b3de-f2bcdeb0d4a0/prp_gfc_iprf_therapy.png",
        "Stem Cells/Exosomes": "https://ucarecdn.com/56712338-88de-4647-b96e-5e864b55fe77/stem_cell_exosome_therapy.png",
        "Hair Transplant": "https://ucarecdn.com/eda0d35e-01d0-4f7e-8ba4-06d25b518943/hair_transplant.png",
        "Other": "https://ucarecdn.com/6ba0e6b4-7523-463a-9522-748eac078f87/other_procedure.png"
      }}
      primaryQuestion={(rowLabel) => `Have you had ${rowLabel} done?`}
      primaryKey="done"
      extraFields={[
        {
          key: "sessions",
          label: "How many sessions?",
          icon: Repeat,
          kind: "single",
          options: PROCEDURE_SESSIONS_OPTIONS,
          optionLabels: PROCEDURE_SESSIONS_LABELS,
        },
        { key: "helped", label: "Did it help?", icon: ThumbsUp, kind: "yesno" },
      ]}
      getRowAnswer={(row) => procedures[row] as unknown as Record<string, ProcedureAnswer[keyof ProcedureAnswer]>}
      setRowField={(row, field, value) => setProcedureField(row, field as keyof ProcedureAnswer, value as never)}
      onFinish={goNext}
    />
  );
}
