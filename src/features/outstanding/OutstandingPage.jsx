import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatINR } from "../../utils/number";
import { computeOutstanding } from "../../redux/loanSlice";

const Remaining = () => {
  const dispatch = useDispatch();
  const { items, outstanding } = useSelector((state) => state.loans);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const sortedOutstanding = useMemo(() => {
    if (!sortConfig.key) return outstanding;
    return [...outstanding].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [outstanding, sortConfig]);

  useEffect(() => {
    if (items.length > 0) {
      dispatch(computeOutstanding(items));
    }
  }, [dispatch, items]);

  const {
    totalLoanAmount,
    totalEmi,
    paidPrincipal,
    remainPrincipal,
    paidInterest,
    remainInterest,
  } = useMemo(() => {
    const filterData =
      outstanding?.filter((item) => item.loanStatus !== "fullypaid") || [];

    return {
      totalLoanAmount: filterData.reduce(
        (sum, item) => sum + item.loan_amount,
        0
      ),
      totalEmi: filterData.reduce((sum, item) => sum + item.emi, 0),
      paidPrincipal: filterData.reduce(
        (sum, item) => sum + item.paidPrincipal,
        0
      ),
      remainPrincipal: filterData.reduce(
        (sum, item) => sum + item.remainingPrincipal,
        0
      ),
      paidInterest: filterData.reduce(
        (sum, item) => sum + item.paidInterest,
        0
      ),
      remainInterest: filterData.reduce(
        (sum, item) => sum + item.remainingInterest,
        0
      ),
    };
  }, [outstanding]);

  return (
    <div>
      <h1>Outstanding Loan Details</h1>
      <table className="table-reponsive common-table outstanding-table">
        <thead>
          <tr>
            <th onClick={() => handleSort("loan_name")}>
              Loan{" "}
              {sortConfig.key === "loan_name" &&
                (sortConfig.direction === "asc" ? "↑" : "↓")}
            </th>
            <th onClick={() => handleSort("loan_amount")}>
              Loan Amount{" "}
              {sortConfig.key === "loan_amount" &&
                (sortConfig.direction === "asc" ? "↑" : "↓")}
            </th>
            <th onClick={() => handleSort("emi")}>
              EMI{" "}
              {sortConfig.key === "emi" &&
                (sortConfig.direction === "asc" ? "↑" : "↓")}
            </th>
            <td colSpan={2} className="principle">
              <table>
                <thead>
                  <tr>
                    <th style={{ backgroundColor: "#8dc08d" }} colSpan={2}>
                      Principal
                    </th>
                  </tr>
                  <tr>
                    <th className="green">Paid</th>
                    <th className="red">Remaining</th>
                  </tr>
                </thead>
              </table>
            </td>

            <td colSpan={2} className="principle">
              <table>
                <thead>
                  <tr>
                    <th style={{ backgroundColor: "#e99999" }} colSpan={2}>
                      Interest
                    </th>
                  </tr>
                  <tr>
                    <th className="green">Paid</th>
                    <th className="red">Remaining</th>
                  </tr>
                </thead>
              </table>
            </td>
            <th onClick={() => handleSort("remaining")}>
              Remaining{" "}
              {sortConfig.key === "remaining" &&
                (sortConfig.direction === "asc" ? "↑" : "↓")}
            </th>
          </tr>
        </thead>

        <tbody>
          {sortedOutstanding.map((item) => (
            <tr className="tr-year" key={item.id}>
              <td>{item.loan_name}</td>
              <td>{formatINR(item.loan_amount, true)}</td>
              <td>{formatINR(item.emi, true)}</td>
              <td>{formatINR(item.paidPrincipal, true)}</td>
              <td>{formatINR(item.remainingPrincipal, true)}</td>

              <td>{formatINR(item.paidInterest, true)}</td>
              <td>{formatINR(item.remainingInterest, true)}</td>

              <td>{item.remaining} months</td>
            </tr>
          ))}

          {/* ✅ Summary row */}
          <tr className="summary-row">
            <td>Total</td>
            <td>{formatINR(totalLoanAmount, true)}</td>
            <td>{formatINR(totalEmi, true)}</td>
            <td>{formatINR(paidPrincipal, true)}</td>
            <td>{formatINR(remainPrincipal, true)}</td>
            <td>{formatINR(paidInterest, true)}</td>
            <td>{formatINR(remainInterest, true)}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Remaining;
