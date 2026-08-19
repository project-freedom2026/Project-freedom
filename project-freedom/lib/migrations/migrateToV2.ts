import { FinancialModelV2 } from "../../types/financial";
import { writeJson, getSchemaVersion, setSchemaVersion } from "../storage";

const LEGACY_KEY = "project-freedom-data";
const MONTHLY_CHECKINS_KEY = "project-freedom-monthly-check-ins";
const TARGET_VERSION = 3;

function isFiniteNonNegative(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function makeId(prefix: string) {
  return `migrated-${prefix}`;
}

function isV2Model(value: unknown): value is FinancialModelV2 {
  if (!value || typeof value !== "object") return false;

  const model = value as Partial<FinancialModelV2>;
  return (
    typeof model.schemaVersion === "number" &&
    model.schemaVersion >= 2 &&
    Array.isArray(model.pensions) &&
    Array.isArray(model.investments) &&
    Array.isArray(model.cash) &&
    Array.isArray(model.debts) &&
    Array.isArray(model.properties) &&
    Array.isArray(model.others)
  );
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
      futureIncome: [],
    };

    if (legacyRaw) {
      try {
        const parsed: unknown = JSON.parse(legacyRaw);

        if (isV2Model(parsed)) {
          writeJson<FinancialModelV2>(LEGACY_KEY, {
            ...parsed,
            schemaVersion: TARGET_VERSION,
            futureIncome: Array.isArray(parsed.futureIncome) ? parsed.futureIncome : [],
          });
          setSchemaVersion(TARGET_VERSION);
          return;
        }

        if (!parsed || typeof parsed !== "object") {
          throw new Error("Legacy financial data is not an object");
        }

        const legacy = parsed as Record<string, unknown>;

        // map simple numeric fields into collections
        if (isFiniteNonNegative(legacy.pension) && legacy.pension > 0) {
          base.pensions.push({
            id: makeId("pension"),
            name: "Existing Pension",
            value: legacy.pension,
            type: "pension",
          });
        }

        if (isFiniteNonNegative(legacy.investments) && legacy.investments > 0) {
          base.investments.push({
            id: makeId("investment"),
            name: "Existing Investments",
            value: legacy.investments,
            type: "investment",
          });
        }

        if (isFiniteNonNegative(legacy.cash) && legacy.cash > 0) {
          base.cash.push({
            id: makeId("cash"),
            name: "Existing Savings",
            value: legacy.cash,
            type: "cash",
          });
        }

        if (isFiniteNonNegative(legacy.debts) && legacy.debts > 0) {
          base.debts.push({
            id: makeId("debt"),
            name: "Existing Debt",
            value: legacy.debts,
            type: "debt",
            outstanding: legacy.debts,
          });
        }

        if (isFiniteNonNegative(legacy.property) && legacy.property > 0) {
          base.properties.push({
            id: makeId("property"),
            name: "Primary residence",
            value: legacy.property,
            type: "property",
            outstandingMortgage: 0,
            includeInInvestableWealth: false,
          });
        }

        // preserve legacy numeric fields for compatibility
        base.legacy = {
          pension: isFiniteNonNegative(legacy.pension) ? legacy.pension : 0,
          investments: isFiniteNonNegative(legacy.investments) ? legacy.investments : 0,
          property: isFiniteNonNegative(legacy.property) ? legacy.property : 0,
          cash: isFiniteNonNegative(legacy.cash) ? legacy.cash : 0,
          debts: isFiniteNonNegative(legacy.debts) ? legacy.debts : 0,
          freedomNumber: isFiniteNonNegative(legacy.freedomNumber) ? legacy.freedomNumber : undefined,
          annualReturn: isFiniteNonNegative(legacy.annualReturn) ? legacy.annualReturn : undefined,
          annualContribution: isFiniteNonNegative(legacy.annualContribution) ? legacy.annualContribution : undefined,
          annualIncome: isFiniteNonNegative(legacy.annualIncome) ? legacy.annualIncome : undefined,
          withdrawalRate: isFiniteNonNegative(legacy.withdrawalRate) ? legacy.withdrawalRate : undefined,
        };
      } catch (err) {
        console.warn("Legacy project-freedom-data exists but could not be parsed; preserving as-is.", err);
        return;
      }
    }

    // preserve monthly snapshots if present
    try {
      const checkinsRaw = window.localStorage.getItem(MONTHLY_CHECKINS_KEY);
      if (checkinsRaw) {
        // no changes for now; keep key as-is
      }
    } catch {
      // ignore
    }

    // write migrated model back under the same key (idempotent)
    writeJson<FinancialModelV2>(LEGACY_KEY, base);
    setSchemaVersion(TARGET_VERSION);
  } catch (e) {
    console.error("Migration to v2 failed", e);
  }
}
