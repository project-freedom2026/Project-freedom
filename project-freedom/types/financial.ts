export type ID = string;

export type Currency = string;

export type Money = number;

export type AssetBase = {
  id: ID;
  name: string;
  notes?: string;
  value: Money;
};

export type PensionItem = AssetBase & {
  type: "pension";
  pensionType?: string; // workplace, private, SIPP, defined-benefit estimate
};

export type InvestmentItem = AssetBase & {
  type: "investment";
  accountType?: string; // ISA, GIA, etc.
};

export type CashAccountItem = AssetBase & {
  type: "cash";
};

export type DebtItem = AssetBase & {
  type: "debt";
  outstanding?: Money;
  monthlyPayment?: Money;
};

export type PropertyItem = AssetBase & {
  type: "property";
  outstandingMortgage?: Money;
  includeInInvestableWealth?: boolean;
  monthlyRentalIncome?: Money | null;
  monthlyCosts?: Money | null;
};

export type OtherAssetItem = AssetBase & {
  type: "other";
};

export type FinancialModelV2 = {
  schemaVersion: number;
  currency: Currency;
  profile?: {
    firstName?: string;
    dateOfBirth?: string; // ISO
    country?: string;
    preferredCurrency?: Currency;
    annualLifestyleGoal?: Money;
    withdrawalAssumption?: number; // percent
  };
  pensions: PensionItem[];
  investments: InvestmentItem[];
  cash: CashAccountItem[];
  debts: DebtItem[];
  properties: PropertyItem[];
  others: OtherAssetItem[];
  // legacy compatibility fields (kept for v1 compatibility)
  legacy?: {
    pension?: Money;
    investments?: Money;
    property?: Money;
    cash?: Money;
    debts?: Money;
    freedomNumber?: number;
    annualReturn?: number;
    annualContribution?: number;
    annualIncome?: number;
    withdrawalRate?: number;
  };
};
