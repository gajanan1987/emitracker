import { useState } from "react";
import { addLoan } from "../services/api";
import { useAuth } from "../contex/Contex";
import { calculateEMI } from "../utils/calculateEmi";

export default function AddLoan() {
  const [loanAmount, setLoanAmount] = useState(3000000);
  const [interestRate, setInterestRate] = useState(12);
  const [tenure, setTenure] = useState(30);
  const [emi, setEmi] = useState(null);
  const [loanName, setLoanName] = useState("HDFC Bank");

  const [loanDate, setLoanDate] = useState("2025-08-01");
  const [emiDate, setEmiDate] = useState("2025-08-05");

  const [schedule, setSchedule] = useState([]);
  const [summary, setSummary] = useState(null);

  const {
    user: { id },
  } = useAuth();

  const saveToSupabase = async () => {
    if (!emi) {
      alert("Please calculate EMI first");
      return;
    }

    const data = await addLoan(
      id,
      loanAmount,
      interestRate,
      tenure,
      emi,
      loanDate,
      emiDate,
      loanName
    );

    // if (error) {
    //   console.error(error);
    //   alert("Error saving loan");
    // } else {
    //   alert("Loan saved successfully!");
    //   console.log(data);
    // }
  };

  const handleClick = () => {
    const data = [
      {
        interest_rate: interestRate,
        loan_amount: loanAmount,
        start_date: loanDate,
        emi_date: emiDate,
        tenure_months: tenure,
      },
    ];
    const op = calculateEMI(data);
    setSummary(op[0]);
    setEmi(op[0].emi);
    console.log("🚀 ~ handleClick ~ op:", op);
  };

  return (
    <div className="loan-tracker">
      <h1>Loan EMI Tracker</h1>

      <div className="form">
        <label>Enter Bank Name / Loan Number Account </label>
        <input
          type="text"
          placeholder="Bank Name / Acc. Number"
          value={loanName}
          onChange={(e) => setLoanName(e.target.value)}
        />
        <label>Enter Loan Amount </label>
        <input
          type="number"
          placeholder="Loan Amount"
          value={loanAmount}
          onChange={(e) => setLoanAmount(e.target.value)}
        />
        <label>Enter Interest Rate (%) </label>
        <input
          type="number"
          placeholder="Annual Interest Rate (%)"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
        />
        <label>Enter Tenure (Months) </label>
        <input
          type="number"
          placeholder="Tenure (Months)"
          value={tenure}
          onChange={(e) => setTenure(e.target.value)}
        />
        <label>Loan Start Date</label>
        <input
          type="date"
          value={loanDate}
          onChange={(e) => setLoanDate(e.target.value)}
        />
        <label>First EMI Date</label>
        <input
          type="date"
          value={emiDate}
          onChange={(e) => setEmiDate(e.target.value)}
        />
        <button onClick={handleClick}>Calculate</button>
      </div>

      {summary && (
        <div className="summary">
          <h2>Summary</h2>
          <p>Total Amount: ₹{summary.totalPayment - summary.totalInterest}</p>
          <p>Total Interest: ₹{summary.totalInterest}</p>
          <p>Interest Rate: {summary.interest_rate}%</p>
          <p>Tenure: {summary.tenure_months} Month</p>

          <p>-----------------------------------------</p>
          <p>Total Payment with Interest: ₹{summary.totalPayment}</p>

          <p>EMI: ₹{summary.emi}</p>

          <p>Paid EMIs: {summary.paid}</p>
          <p>Remaining EMIs: {summary.remaining}</p>
          <p>Principal Paid: ₹{summary.paidPrincipal}</p>
          <p>Interest Paid: ₹{summary.paidInterest}</p>
          <p>Remaining Principal: ₹{summary.remainingPrincipal}</p>
          <p>Remaining Interest: ₹{summary.remainingInterest}</p>
          <button onClick={saveToSupabase}>Save Loan</button>
        </div>
      )}
    </div>
  );
}
