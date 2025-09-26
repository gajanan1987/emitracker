import { formatINR } from "../../../utils/number";

const OutstandingSummary = ({ summary }) => {
  const {
    totalLoanAmount,
    totalEmi,
    paidPrincipal,
    remainPrincipal,
    paidInterest,
    remainInterest,
  } = summary;

  return (
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
  );
};

export default OutstandingSummary;
