import { formatINR } from "../../../utils/number";

const OutstandingTable = ({
  summary,
  sortConfig,
  handleSort,
  sortedOutstanding,
}) => {
  const {
    totalLoanAmount,
    totalEmi,
    paidPrincipal,
    remainPrincipal,
    paidInterest,
    remainInterest,
  } = summary;
  return (
    <>
      <table className="table-reponsive common-table outstanding-table">
        <thead>
          <tr>
            <th className="loan-name" onClick={() => handleSort("loan_name")}>
              Loan{" "}
              {sortConfig.key === "loan_name" &&
                (sortConfig.direction === "asc" ? "↑" : "↓")}
            </th>
            <th className="principal" onClick={() => handleSort("loan_amount")}>
              Loan Amount{" "}
              {sortConfig.key === "loan_amount" &&
                (sortConfig.direction === "asc" ? "↑" : "↓")}
            </th>
            <th className="intrest" onClick={() => handleSort("emi")}>
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
          {sortedOutstanding.length === 0 ? (
            <tr>
              <td colSpan={8} style={{ textAlign: "center" }}>
                No outstanding loans
              </td>
            </tr>
          ) : (
            <>
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
            </>
          )}
        </tbody>
      </table>
    </>
  );
};

export default OutstandingTable;
