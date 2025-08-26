import { useEffect, useState } from "react";
import { useAuth } from "../../../contex/Contex";
import { computeScheduleFor, createLoan } from "../../../redux/loanSlice";
import { useDispatch, useSelector } from "react-redux";

const AddLoan = ({ emiSummary, onCloseModal }) => {
  const dispatch = useDispatch();

  // const [formData, setFormData] = useState([]);
  const [formData, setFormData] = useState({
    loanAmount: 1234567,
    loanIntrest: 12,
    loanTenure: 40,
    loanDate: "2025-08-01",
    loanEmiDate: "2025-08-05",
    loanName: "testing",
  });

  const {
    user: { id },
  } = useAuth();

  const saveToSupabase = async () => {
    const payload = {
      user_id: id,
      loan_amount: formData.loanAmount,
      interest_rate: formData.loanIntrest,
      tenure_months: formData.loanTenure,
      emi_amount: emiSummary.emi,
      loan_date: formData.loanDate,
      emi_date: formData.loanEmiDate,
      loan_name: formData.loanName,
    };

    const res = dispatch(createLoan(payload));
    onCloseModal();
  };

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    const data = { ...formData, [name]: value };
    setFormData(data);
  };

  useEffect(() => {
    // setSummary(emiSummary);
  }, [emiSummary]);

  return (
    <div className="loan-tracker">
      <h1>Loan EMI Tracker</h1>

      <div className="form">
        <label>Enter Bank Name / Loan Number Account </label>
        <input
          type="text"
          placeholder="Bank Name / Acc. Number"
          value={formData.loanName}
          name="loanName"
          onChange={(e) => handleChange(e)}
        />
        <label>Enter Loan Amount </label>
        <input
          type="number"
          placeholder="Loan Amount"
          value={formData.loanAmount}
          name="loanAmount"
          onChange={(e) => handleChange(e)}
        />
        <label>Enter Interest Rate (%) </label>
        <input
          type="number"
          placeholder="Annual Interest Rate (%)"
          value={formData.loanIntrest}
          name="loanIntrest"
          onChange={(e) => handleChange(e)}
        />
        <label>Enter Tenure (Months) </label>
        <input
          type="number"
          placeholder="Tenure (Months)"
          value={formData.loanTenure}
          name="loanTenure"
          onChange={(e) => handleChange(e)}
        />
        <label>Loan Start Date</label>
        <input
          type="date"
          value={formData.loanDate}
          name="loanDate"
          onChange={(e) => handleChange(e)}
        />
        <label>First EMI Date</label>
        <input
          type="date"
          value={formData.loanEmiDate}
          name="loanEmiDate"
          onChange={(e) => handleChange(e)}
        />
        <button onClick={handleCalculate}>Calculate</button>
      </div>

      {emiSummary && (
        <div className="summary">
          <h2>Summary</h2>
          <p>
            Total Amount: ₹{emiSummary.totalPayment - emiSummary.totalInterest}
          </p>
          <p>Total Interest: ₹{emiSummary.totalInterest}</p>
          <p>Interest Rate: {emiSummary.interest_rate}%</p>
          <p>Tenure: {emiSummary.tenure_months} Month</p>

          <p>-----------------------------------------</p>
          <p>Total Payment with Interest: ₹{emiSummary.totalPayment}</p>

          <p>EMI: ₹{emiSummary.emi}</p>

          <p>Paid EMIs: {emiSummary.paid}</p>
          <p>Remaining EMIs: {emiSummary.remaining}</p>
          <p>Principal Paid: ₹{emiSummary.paidPrincipal}</p>
          <p>Interest Paid: ₹{emiSummary.paidInterest}</p>
          <p>Remaining Principal: ₹{emiSummary.remainingPrincipal}</p>
          <p>Remaining Interest: ₹{emiSummary.remainingInterest}</p>
          <button onClick={saveToSupabase}>Save Loan</button>
        </div>
      )}
    </div>
  );
};

export default AddLoan;
