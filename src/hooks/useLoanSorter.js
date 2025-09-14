import { useMemo, useState } from "react";

export const useLoanSorter = (loans, defaultKey = null) => {
  const [sortConfig, setSortConfig] = useState({
    key: "emi_amount",
    direction: "asc",
  });

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const sortedLoans = useMemo(() => {
    if (!loans) return [];
    if (!sortConfig.key) return loans;

    return [...loans].sort((a, b) => {
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];

      // Special case for date sorting
      if (sortConfig.key === "nextDueDate") {
        valA = new Date(valA);
        valB = new Date(valB);
      }

      // Case-insensitive string sorting
      if (typeof valA === "string") {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [loans, sortConfig]);

  return { sortedLoans, handleSort, sortConfig };
};
