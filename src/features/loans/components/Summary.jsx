import { useDispatch, useSelector } from "react-redux";
import { formatINR } from "../../../utils/number";
import custMessage from "../../../utils/toast";
import { createLoan } from "../../../redux/loanSlice";
import { useState } from "react";

const Summary = ({ emiSummary, formData, onCloseModal }) => {
  const dispatch = useDispatch();
  const {
    user: { id, email },
  } = useSelector((s) => s.auth);

  const [saving, setSaving] = useState(false);

  const addNewLoan = async () => {
    setSaving(true);

    const payload = {
      user_id: id,
      loan_amount: formData.loanAmount,
      interest_rate: formData.loanInterest,
      tenure_months: formData.loanTenure,
      emi_amount: emiSummary.emi,
      loan_date: formData.loanDate,
      emi_date: formData.loanEmiDate,
      loan_name: formData.loanName,
      email,
    };

    try {
      await dispatch(
        createLoan({
          loan: payload,
          remaining: emiSummary.remaining,
        })
      ).unwrap();

      custMessage.success("Loan added successfully");
      onCloseModal();
    } catch (error) {
      custMessage.error(error.message || "Failed to add loan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="summary">
      <h2>Summary</h2>
      <p>
        Loan Amount:{" "}
        {formatINR(emiSummary.totalPayment - emiSummary.totalInterest, true)}
      </p>
      <p>Interest: {formatINR(emiSummary.totalInterest, true)}</p>
      <p>ROI: {emiSummary.interest_rate}%</p>
      <p>Tenure: {emiSummary.tenure_months} Months</p>
      <hr />
      <p>Loan Amount + Interest: {formatINR(emiSummary.totalPayment, true)}</p>
      <p>EMI: {formatINR(emiSummary.emi, true)}</p>
      <p>Paid EMIs: {emiSummary.paid}</p>
      <p>Remaining EMIs: {emiSummary.remaining}</p>
      <p>Principal Paid: {formatINR(emiSummary.paidPrincipal, true)}</p>
      <p>Interest Paid: {formatINR(emiSummary.paidInterest, true)}</p>
      <p>
        Remaining Principal: {formatINR(emiSummary.remainingPrincipal, true)}
      </p>
      <p>Remaining Interest: {formatINR(emiSummary.remainingInterest, true)}</p>

      <div className="btn-wrapper">
        <button
          className="btn btn-primary"
          onClick={addNewLoan}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Loan"}
        </button>
        <button
          className="btn btn-secondary"
          onClick={onCloseModal}
          disabled={saving}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Summary;
