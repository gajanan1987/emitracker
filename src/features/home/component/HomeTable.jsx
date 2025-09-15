import { formatINR } from "../../../utils/number";
import { format } from "date-fns";
import { useLoanSorter } from "../../../hooks/useLoanSorter";
import LoanSummary from "./LoanSummary";

const HomeTable = ({ activeLoans, summaryData }) => {
  const { sortedLoans, handleSort, sortConfig } = useLoanSorter(
    activeLoans,
    "emiStatus"
  );

  if (!sortedLoans.length) {
    return <p>No loans found. Add your first loan to start tracking 🚀</p>;
  }

  // helper for showing arrow
  const sortArrow = (key) =>
    sortConfig.key === key ? (sortConfig.direction === "asc" ? "↑" : "↓") : "";

  return (
    <table className="table-reponsive common-table home-table">
      <thead>
        <tr>
          <th className="loan-name" onClick={() => handleSort("loan_name")}>
            Loan {sortArrow("loan_name")}
          </th>
          <th className="principal" onClick={() => handleSort("loan_amount")}>
            Loan Amount {sortArrow("loan_amount")}
          </th>
          <th className="intrest" onClick={() => handleSort("emi_amount")}>
            EMI {sortArrow("emi_amount")}
          </th>
          <th onClick={() => handleSort("nextDueDate")}>
            Due Date {sortArrow("nextDueDate")}
          </th>
          <th onClick={() => handleSort("remaningEmi")}>
            Remaining {sortArrow("remaningEmi")}
          </th>
          <th onClick={() => handleSort("emiStatus")}>
            Status {sortArrow("emiStatus")}
          </th>
        </tr>
      </thead>

      <tbody>
        {sortedLoans.map((item) => (
          <tr className="tr-year" key={item.id}>
            <td>{item.loan_name}</td>
            <td>{formatINR(item.loan_amount, true)}</td>
            <td>{formatINR(item.emi_amount, true)}</td>
            <td>
              {item.nextDueDate
                ? format(new Date(item.nextDueDate), "dd MMM yyyy")
                : "N/A"}
            </td>
            <td>{item.remaningEmi} months</td>
            <td className={item.emiStatus}>{item.emiStatus}</td>
          </tr>
        ))}

        <LoanSummary {...summaryData} />
      </tbody>
    </table>
  );
};

export default HomeTable;
