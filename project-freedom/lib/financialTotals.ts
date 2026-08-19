import { FinancialModelV2, Money } from "../types/financial";

const safeMoney = (value: number | null | undefined): Money =>
  typeof value === "number" && Number.isFinite(value) ? Math.max(0, value) : 0;

const sum = (values: number[]) => values.reduce((total, value) => total + safeMoney(value), 0);

export function getFinancialTotals(model: FinancialModelV2) {
  const propertyEquity = sum(
    model.properties.map((property) =>
      Math.max(0, safeMoney(property.value) - safeMoney(property.outstandingMortgage)),
    ),
  );
  const includedPropertyEquity = sum(
    model.properties.map((property) =>
      property.includeInInvestableWealth
        ? Math.max(0, safeMoney(property.value) - safeMoney(property.outstandingMortgage))
        : 0,
    ),
  );
  const pension = sum(model.pensions.map((item) => item.value));
  const investments = sum(model.investments.map((item) => item.value));
  const cash = sum(model.cash.map((item) => item.value));
  const otherAssets = sum(model.others.map((item) => item.value));
  const debts = sum(model.debts.map((item) => item.outstanding ?? item.value));

  return {
    pension,
    investments,
    cash,
    propertyEquity,
    includedPropertyEquity,
    otherAssets,
    debts,
    netWorth: pension + investments + cash + propertyEquity + otherAssets - debts,
    investableWealth: pension + investments + cash + includedPropertyEquity + otherAssets - debts,
  };
}