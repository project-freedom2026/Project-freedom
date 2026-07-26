import { FinancialModelV2 } from "../../types/financial";
import { readJson, writeJson, getSchemaVersion, setSchemaVersion } from "../storage";

const LEGACY_KEY = "project-freedom-data";
const MONTHLY_CHECKINS_KEY = "project-freedom-monthly-check-ins";
const TARGET_VERSION = 2;

function makeId(prefix = "migrated") {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function migrateIfNeeded(): void {
  if (typeof window === "undefined") return;

  const current = getSchemaVersion();
  if (current >= TARGET_VERSION) return;

  try {
    const legacyRaw = window.localStorage.getItem(LEGACY_KEY);

    const base: FinancialModelV2 = {
      schemaVersion: TARGET_VERSION,
      currency: "GBP",
      profile: {},
      pensions: [],
      investments: [],
      cash: [],
      debts: [],
      properties: [],
      others: [],
    };

    if (legacyRaw) {
      try {
        const parsed = JSON.parse(legacyRaw) as any;

        // map simple numeric fields into collections
        if (typeof parsed.pension === "number" && parsed.pension > 0) {
          base.pensions.push({
            id: makeId("pension"),
            name: "Existing Pension",
            value: parsed.pension,
            type: "pension",
          });
        }

        if (typeof parsed.investments === "number" && parsed.investments > 0) {
          base.investments.push({
            id: makeId("investment"),
            name: "Existing Investments",
            value: parsed.investments,
            type: "investment",
          });
        }

        if (typeof parsed.cash === "number" && parsed.cash > 0) {
          base.cash.push({
            id: makeId("cash"),
            name: "Existing Savings",
            value: parsed.cash,
            type: "cash",
          });
        }

        if (typeof parsed.debts === "number" && parsed.debts > 0) {
          base.debts.push({
            id: makeId("debt"),
            name: "Existing Debt",
            value: parsed.debts,
            type: "debt",
            outstanding: parsed.debts,
          });
        }

        if (typeof parsed.property === "number" && parsed.property > 0) {
          base.properties.push({
            id: makeId("property"),
            name: "Primary residence",
            value: parsed.property,
            type: "property",
            outstandingMortgage: 0,
            includeInInvestableWealth: false,
          });
        }

        // preserve legacy numeric fields for compatibility
        base.legacy = {
          pension: typeof parsed.pension === "number" ? parsed.pension : 0,
          investments: typeof parsed.investments === "number" ? parsed.investments : 0,
          property: typeof parsed.property === "number" ? parsed.property : 0,
          cash: typeof parsed.cash === "number" ? parsed.cash : 0,
          debts: typeof parsed.debts === "number" ? parsed.debts : 0,
          freedomNumber: typeof parsed.freedomNumber === "number" ? parsed.freedomNumber : undefined,
          annualReturn: typeof parsed.annualReturn === "number" ? parsed.annualReturn : undefined,
          annualContribution: typeof parsed.annualContribution === "number" ? parsed.annualContribution : undefined,
          annualIncome: typeof parsed.annualIncome === "number" ? parsed.annualIncome : undefined,
          withdrawalRate: typeof parsed.withdrawalRate === "number" ? parsed.withdrawalRate : undefined,
        };
      } catch (err) {
        console.warn("Legacy project-freedom-data exists but could not be parsed; preserving as-is.", err);
      }
    }

    // preserve monthly snapshots if present
    try {
      const checkinsRaw = window.localStorage.getItem(MONTHLY_CHECKINS_KEY);
      if (checkinsRaw) {
        // no changes for now; keep key as-is
      }
    } catch (e) {
      // ignore
    }

    // write migrated model back under the same key (idempotent)
    writeJson<FinancialModelV2>(LEGACY_KEY, base);
    setSchemaVersion(TARGET_VERSION);
  } catch (e) {
    console.error("Migration to v2 failed", e);
  }
}
