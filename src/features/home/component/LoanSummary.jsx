import { formatINR } from "../../../utils/number";

const LoanSummary = ({
  totalLoanAmount,
  totalEmi,
  paidMonth,
  remaningMonth,
}) => (
  <tr className="summary-row">
    <td>Total</td>
    <td>{formatINR(totalLoanAmount, true)}</td>
    <td>{formatINR(totalEmi, true)}</td>
    <td colSpan="3">
      <div>
        <div className="paid">
          <span>Paid Monthly EMI:</span> {formatINR(paidMonth, true)}
        </div>
        <div className="rem">
          <span>Remaining Monthly EMI:</span> {formatINR(remaningMonth, true)}
        </div>
      </div>
    </td>
  </tr>
);

export default LoanSummary;
