import { FutureIncomeStream } from "../types/financial";

export type FutureIncomeProjection = {
  enabledIncome: number;
  currentYear: number;
  retirementIncomeAtYear: (year: number) => number;
};

export function getFutureIncomeProjection(
  streams: FutureIncomeStream[] | undefined,
  currentYear = new Date().getFullYear(),
): FutureIncomeProjection {
  const validStreams = (streams ?? []).filter(
    (stream) => stream.enabled && Number.isFinite(stream.annualAmount) && stream.annualAmount > 0,
  );

  return {
    enabledIncome: validStreams.reduce((total, stream) => total + stream.annualAmount, 0),
    currentYear,
    retirementIncomeAtYear: (year: number) => validStreams.reduce(
      (total, stream) => total + (year >= stream.startYear ? stream.annualAmount : 0),
      0,
    ),
  };
}

export function getStatePensionStartYear(dateOfBirth?: string, explicitStartYear?: number): number {
  if (Number.isFinite(explicitStartYear) && explicitStartYear && explicitStartYear > 0) return explicitStartYear;
  if (!dateOfBirth) return new Date().getFullYear() + 10;
  const date = new Date(dateOfBirth);
  if (Number.isNaN(date.getTime())) return new Date().getFullYear() + 10;
  return date.getFullYear() + 67;
}