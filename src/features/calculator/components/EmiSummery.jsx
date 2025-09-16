import { formatINR } from "../../../utils/number";

const EmiSummery = ({ emiSummary }) => {
  console.log("🚀 ~ EmiSummery ~ emiSummary:", emiSummary);
  return (
    <>
      <div className="summary">
        <h2>Summary</h2>
        <p>EMI: {formatINR(emiSummary.emi, true)}</p>
        <p>Loan (A): {formatINR(emiSummary.loan_amount, true)}</p>
        <p>Interest (B): {formatINR(emiSummary.totalInterest, true)}</p>
        <p>Loan(A) + Interest(B): {formatINR(emiSummary.totalPayment, true)}</p>
      </div>
    </>
  );
};

export default EmiSummery;
