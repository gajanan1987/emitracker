import { formatINR } from "../../../utils/number";

const EmiSummery = ({ emiSummary }) => {
  return (
    <>
      <div className="summary">
        <h2>Summary</h2>
        <p>EMI: {formatINR(emiSummary.emi, true)}</p>
        <p>Loan (A): {formatINR(emiSummary.emi, true)}</p>
        <p>Interest (B): {formatINR(emiSummary.totalInterest, true)}</p>
        <p>Loan(A) + Interest(B): {formatINR(emiSummary.totalPayment, true)}</p>
      </div>
    </>
  );
};

export default EmiSummery;
