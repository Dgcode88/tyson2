import { useEffect, useState } from "react";

// Persisted state: behaves like useState but reads its initial value from
// localStorage and writes back on every change. Replaces the three repeated
// useState + useEffect blocks in the original App. JSON-encoded so it works for
// numbers, objects, and booleans alike.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage full or unavailable — fail silently, state still works in-memory */
    }
  }, [key, value]);

  return [value, setValue];
}
