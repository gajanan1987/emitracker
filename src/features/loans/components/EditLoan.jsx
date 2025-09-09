import { useEffect, useState } from "react";
import { computeScheduleFor, editLoan } from "../../../redux/loanSlice";
import { useDispatch, useSelector } from "react-redux";
import { formatINR } from "../../../utils/number";
import custMessage from "../../../utils/toast";

const EditLoan = ({ loanEditData, onCloseModal }) => {
  // console.log("🚀 ~ EditLoan ~ loanEditData:", loanEditData);
  const dispatch = useDispatch();
  const { emiSummary } = useSelector((s) => s.loans);

  // const [formData, setFormData] = useState([]);
  const [formData, setFormData] = useState({
    loanAmount: loanEditData.loan_amount,
    loanIntrest: loanEditData.interest_rate,
    loanTenure: loanEditData.tenure_months,
    loanDate: loanEditData.loan_date,
    loanEmiDate: loanEditData.emi_date,
    loanName: loanEditData.loan_name,
  });

  const {
    user: { id, email },
  } = useSelector((s) => s.auth);

  const handleCalculate = () => {
    const data = {
      loan_amount: formData.loanAmount,
      interest_rate: formData.loanIntrest,
      tenure_months: formData.loanTenure,
      loan_date: formData.loanDate,
      emi_date: formData.loanEmiDate,
    };
    // const op = calculateEMI(data);
    // dispatch(computeScheduleFor(data));
    dispatch(computeScheduleFor({ data, type: "addLoan" }));
  };

  const editLoanSave = async () => {
    const payload = {
      user_id: id,
      loan_amount: formData.loanAmount,
      interest_rate: formData.loanIntrest,
      tenure_months: formData.loanTenure,
      emi_amount: emiSummary.emi,
      loan_date: formData.loanDate,
      emi_date: formData.loanEmiDate,
      loan_name: formData.loanName,
      email,
    };
    console.log("🚀 ~ editLoan ~ payload:", payload);

    dispatch(
      editLoan({
        loan: payload,
        remaining: emiSummary.remaining,
        loanId: loanEditData.id,
      })
    ).then((data) => {
      custMessage.success("Loan Added successfully");
    });
    onCloseModal();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const data = { ...formData, [name]: value };
    setFormData(data);
  };

  // useEffect(() => {
  //   // setSummary(emiSummary);
  // }, [emiSummary]);

  return (
    <div className="add-loan-form">
      <h2>Edit Loan EMI</h2>

      <div className="form">
        <div className="input-wrapper">
          <label>Enter Bank Name / Loan Number Account </label>
          <input
            type="text"
            placeholder="Bank Name / Acc. Number"
            value={formData.loanName}
            name="loanName"
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className="input-wrapper">
          <label>Enter Loan Amount </label>
          <input
            type="number"
            placeholder="Loan Amount"
            value={formData.loanAmount}
            name="loanAmount"
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className="input-wrapper">
          <label>Enter Interest Rate (%) </label>
          <input
            type="number"
            placeholder="Annual Interest Rate (%)"
            value={formData.loanIntrest}
            name="loanIntrest"
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className="input-wrapper">
          <label>Enter Tenure (Months) </label>
          <input
            type="number"
            placeholder="Tenure (Months)"
            value={formData.loanTenure}
            name="loanTenure"
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className="input-wrapper">
          <label>Loan Start Date</label>
          <input
            type="date"
            value={formData.loanDate}
            name="loanDate"
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className="input-wrapper">
          <label>First EMI Date</label>
          <input
            type="date"
            value={formData.loanEmiDate}
            name="loanEmiDate"
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className="btn-wrapper">
          <button className="btn btn-primary-hallow" onClick={handleCalculate}>
            Calculate
          </button>
        </div>
      </div>

      {emiSummary && (
        <div className="summary">
          <h2>Summary</h2>
          <p>
            Loan Amount:{" "}
            {formatINR(
              emiSummary.totalPayment - emiSummary.totalInterest,
              true
            )}
          </p>
          <p>Interest: {formatINR(emiSummary.totalInterest, true)}</p>
          <p>ROI: {emiSummary.interest_rate}%</p>
          <p>Tenure: {emiSummary.tenure_months} Month</p>

          <p>-----------------------------------------</p>
          <p>
            Loan Amount + Interest: {formatINR(emiSummary.totalPayment, true)}
          </p>

          <p>EMI: {formatINR(emiSummary.emi, true)}</p>

          <p>Paid EMIs: {emiSummary.paid}</p>
          <p>Remaining EMIs: {emiSummary.remaining}</p>
          <p>Principal Paid: {formatINR(emiSummary.paidPrincipal, true)}</p>
          <p>Interest Paid: {formatINR(emiSummary.paidInterest, true)}</p>
          <p>
            Remaining Principal:{" "}
            {formatINR(emiSummary.remainingPrincipal, true)}
          </p>
          <p>
            Remaining Interest: {formatINR(emiSummary.remainingInterest, true)}
          </p>
          <button className="btn btn-primary" onClick={editLoanSave}>
            Save Loan
          </button>
        </div>
      )}
    </div>
  );
};

export default EditLoan;
