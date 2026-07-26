export const SCHEMA_KEY = "project-freedom-schema-version";

export function readJson<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error("Failed to read JSON from localStorage", key, e);
    return null;
  }
}

export function writeJson<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Failed to write JSON to localStorage", key, e);
  }
}

export function setSchemaVersion(version: number): void {
  try {
    window.localStorage.setItem(SCHEMA_KEY, String(version));
  } catch (e) {
    console.error("Failed to set schema version", e);
  }
}

export function getSchemaVersion(): number {
  try {
    const raw = window.localStorage.getItem(SCHEMA_KEY);
    return raw ? Number(raw) || 0 : 0;
  } catch (e) {
    console.error("Failed to read schema version", e);
    return 0;
  }
}
