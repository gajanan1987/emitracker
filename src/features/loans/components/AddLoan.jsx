import { useEffect, useState } from "react";
import { computeScheduleFor, createLoan } from "../../../redux/loanSlice";
import { useDispatch, useSelector } from "react-redux";
import { formatINR } from "../../../utils/number";
import custMessage from "../../../utils/toast";

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
    user: { id, email },
  } = useSelector((s) => s.auth);

  const addNewLoan = async () => {
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

    dispatch(createLoan(payload)).then((data) => {
      custMessage.success("Loan Added successfully");
    });
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
    <div className="add-loan-form">
      <h2>Add New Loan EMI</h2>

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
          <button className="btn btn-primary" onClick={addNewLoan}>
            Save Loan
          </button>
        </div>
      )}
    </div>
  );
};

export default AddLoan;
