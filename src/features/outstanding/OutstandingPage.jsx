import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLoans, selectLoanItems } from "../../redux/loanSlice";
import OutstandingTable from "./component/OutstandingTable";

const Remaining = () => {
  const dispatch = useDispatch();
  const { items, outstanding } = useSelector((state) => state.loans);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const summary = useSelector(selectLoanItems);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const sortedOutstanding = useMemo(() => {
    if (!sortConfig.key) return items;
    return [...items].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [items, sortConfig]);

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchLoans());
    }
  }, [dispatch, items]);

  return (
    <div>
      <h1>Outstanding Loan Details</h1>
      <OutstandingTable
        summary={summary}
        sortConfig={sortConfig}
        handleSort={handleSort}
        sortedOutstanding={sortedOutstanding}
      />
    </div>
  );
};

export default Remaining;
