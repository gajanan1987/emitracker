import { useLoanSorter } from "../../../hooks/useLoanSorter";
import { formatINR } from "../../../utils/number";
import OutstandingSummary from "./OutstandingSummary";

const OutstandingTable = ({ summary, items }) => {
  const { sortedLoans, handleSort, sortConfig } = useLoanSorter(items);

  // helper for showing arrow
  const sortArrow = (key) =>
    sortConfig.key === key ? (sortConfig.direction === "asc" ? "↑" : "↓") : "";
  return (
    <>
      <table className="table-reponsive common-table outstanding-table">
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
            <td colSpan={2} className="principle">
              <table>
                <thead>
                  <tr>
                    <th style={{ backgroundColor: "#8dc08d" }} colSpan={2}>
                      Principal
                    </th>
                  </tr>
                  <tr>
                    <th
                      className="green"
                      onClick={() => handleSort("paidPrincipal")}
                    >
                      Paid {sortArrow("paidPrincipal")}
                    </th>
                    <th
                      className="red"
                      onClick={() => handleSort("remainingPrincipal")}
                    >
                      Remaining {sortArrow("remainingPrincipal")}
                    </th>
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
                    <th
                      className="green"
                      onClick={() => handleSort("paidInterest")}
                    >
                      Paid {sortArrow("paidInterest")}
                    </th>
                    <th
                      className="red"
                      onClick={() => handleSort("remainingInterest")}
                    >
                      Remaining {sortArrow("remainingInterest")}
                    </th>
                  </tr>
                </thead>
              </table>
            </td>
            <th onClick={() => handleSort("remaining")}>
              Remaining {sortArrow("remaining")}
            </th>
          </tr>
        </thead>

        <tbody>
          {sortedLoans.length === 0 ? (
            <tr>
              <td colSpan={8} style={{ textAlign: "center" }}>
                No outstanding loans
              </td>
            </tr>
          ) : (
            <>
              {sortedLoans.map((item) => (
                <tr
                  className={`tr-year ${item.remaining === 0 ? "Done" : ""}`}
                  key={item.id}
                >
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
              {sortedLoans.length > 0 && (
                <OutstandingSummary summary={summary} />
              )}
            </>
          )}
        </tbody>
      </table>
    </>
  );
};

export default OutstandingTable;
