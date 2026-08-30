# Haiku Studio Take-Home --- Founding Full Stack Engineer

## The intake that fills itself

**Due:** Mon 31 Aug · 11:59 pm IST\
**Budget:** 6--10 hours · Reply to the email you received this in

## The problem

Patients at a hair and scalp clinic fill a 16-question intake form
before their consultation. Today it is paper, typed into software later.
People abandon it, answer carelessly, or need a nurse to walk them
through it.

The last decade of clinic software was forms and dashboards: the human
clicks, the software stores. We want the opposite: the software does the
work, the human gets the outcome. Here the outcome is a doctor who has a
complete, accurate picture before the patient walks in, and a patient
who barely noticed they filled anything.

Build a small web app that gets a patient through this intake. The only
fixed thing is the output: the form below, fully filled, visible as
structured data. Everything else---what the patient sees, hears, or
taps---is yours.

Voice copilot, no AI at all, one screen, many steps: be creative, and
design for a real patient in a real clinic.

## What we judge, in this order

### 1. How it feels

Snappy, obvious without instructions, finishable by a 55-year-old on a
phone. We will try it on a phone and a laptop.

### 2. Taste

How each question gets answered. Some are one tap, some are speech, some
should be inferred from an earlier answer and just confirmed. Think per
question, not one chat box for everything.

### 3. Ideas

What you added that we did not ask for, and what you would do with one
more week.

### 4. Resourcefulness

Which models and services you chose and why, what you bought instead of
built, how you checked the form actually gets filled correctly, and how
you deployed.

We hire for judgement that reaches a working outcome fast, not for code
written from scratch.

Any stack, any paid or free service, any AI coding tool (we use Claude
Code every day). We do not judge what you chose; we judge whether you
chose well.

## Rules

-   Language: Hinglish is fine.
-   Build only what the patient touches. No login, no admin panel.
-   No real personal data; use made-up patients.
-   Keep API keys out of the repo.

## Submit by replying to the email

1.  **A live link** (Vercel, Netlify, Render, anything) that works
    without us installing anything.
2.  **The repo** (GitHub, public or invite `nikhil@thevectorlabs.in`, my
    GitHub account) with a README containing:
    -   How to run it
    -   Your choices: models, services, bought vs built
    -   How you tested the fill
    -   What you would improve with one more week
3.  **A 2-minute screen recording** of you walking through it as a
    patient, naming the two or three decisions you are proudest of.

This stands in for a screening call, so treat it as one.

------------------------------------------------------------------------

# The Form That Must Be Filled at the End

## Hair & scalp intake --- 16 questions

### A · Personal and Family Hair Loss History

#### 1. Age when hair loss began

-   Number

#### 2. Duration

-   Under 6 months
-   6--12 months
-   Over a year

#### 3. Family history

Multi-select: - Father - Mother - Siblings with thinning or baldness -
No known family history

#### 4. Pattern

Multi-select: - Receding hairline - Thinning at crown - Widening part
line - Diffuse thinning - Patchy loss - Sudden excessive shedding

### B · Hormonal and Health Influences

#### 5. Diagnosed conditions

Multi-select: - PCOS or PCOD - Thyroid disorder - Diabetes - Autoimmune
disease - Anemia - None

#### 6. Menstrual cycle

Female patients only: - Regular - Irregular - Menopausal - Not
applicable

#### 7. Pregnancy-related hair loss

Female patients only: - Currently pregnant - Postpartum under 1 year -
Not applicable

#### 8. Acne or oily skin in adulthood

-   Yes
-   No

#### 9. Excess body or facial hair growth

-   Yes
-   No

### C · Lifestyle and Environmental Triggers

#### 10. In the past 6 months

Multi-select: - Crash dieting or major weight loss - High stress or
emotional trauma - Fever with illness (COVID, dengue, typhoid) - Recent
surgery - Change in location, water, or air quality

#### 11. Habits

Each answered as applicable:

-   **Smoking:** Yes / No
    -   If yes: under 5, 5--10, or over 10 a day
-   **Alcohol:** Yes / No
-   **Hard water for hair wash:** Yes / No
-   **Hair wash frequency:** Daily / Alternate days / Weekly
-   **Heating tools or styling chemicals:** Yes / No
-   **Salon treatments** such as keratin, rebonding, or smoothening:
    -   Yes / No
    -   If yes, which?

### D · Current Hair Care and Treatments

#### 12. Products

For each row: - Used: Yes / No - Duration: Under 3 months / 3--6 months
/ Over 6 months - Helped: Yes / No - Side effects: Yes / No

Rows: - Medicated shampoos - Hair oils or serums - Topical minoxidil -
Oral minoxidil - Supplements

#### 13. In-clinic procedures

For each row: - Done: Yes / No - Sessions: 1--3 / 4--6 / Over 6 -
Helped: Yes / No

Rows: - PRP - GFC or iPRF - Stem cells or exosomes - Hair transplant -
Other

#### 14. Side effects or poor response to past treatment

-   Yes / No
-   If yes, describe

### E · Sample and Consent

#### 15. Preferred sample type

-   Saliva
-   Blood
-   Either

#### 16. Consent to sample collection and genetic analysis

-   Yes
-   No

## Design consideration

How you learn the patient's sex for questions 6 and 7, or whether you
ask at all, is part of the design.

A machine-readable version is available at
`haikustudio.ai/hiring/intake-schema.json`; field names are not
graded---coverage and correctness are.

## After you submit

We review within two working days and reply either way. If it goes well,
the next step is a 30-minute call where you walk us through your
decisions.

Questions: just reply to the email.
