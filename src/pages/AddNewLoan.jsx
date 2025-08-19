import { useState } from "react";

import "./../style/loan.scss";
import { addLoan } from "../services/api";

export default function AddNewLoan() {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [startDate, setStartDate] = useState("");
  const [emi, setEmi] = useState(null);
  const [summary, setSummary] = useState(null);

  const calculateEMI = () => {
    const P = parseFloat(loanAmount);
    const R = parseFloat(interestRate) / 12 / 100;
    const N = parseInt(tenure);

    const emiValue = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    const totalPayable = emiValue * N;
    const totalInterest = totalPayable - P;

    setEmi(emiValue.toFixed(2));
    setSummary({
      totalPayable: totalPayable.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
    });
  };

  const saveToSupabase = async () => {
    if (!emi) {
      alert("Please calculate EMI first");
      return;
    }

    const data = await addLoan(
      "6b718365-b048-428b-93ae-215d1238dc25",
      loanAmount,
      interestRate,
      tenure,
      emi,
      startDate,
      0,
      tenure,
      summary.totalInterest,
      summary.totalPayable
    );

    // if (error) {
    //   console.error(error);
    //   alert("Error saving loan");
    // } else {
    //   alert("Loan saved successfully!");
    //   console.log(data);
    // }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px" }}>
      <h2>Loan EMI Calculator</h2>
      <input
        type="number"
        placeholder="Loan Amount"
        value={loanAmount}
        onChange={(e) => setLoanAmount(e.target.value)}
      />
      <input
        type="number"
        placeholder="Interest Rate %"
        value={interestRate}
        onChange={(e) => setInterestRate(e.target.value)}
      />
      <input
        type="number"
        placeholder="Tenure (months)"
        value={tenure}
        onChange={(e) => setTenure(e.target.value)}
      />
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />

      <button onClick={calculateEMI}>Calculate EMI</button>

      {emi && (
        <div>
          <p>Monthly EMI: ₹{emi}</p>
          <p>Total Interest: ₹{summary.totalInterest}</p>
          <p>Total Payable: ₹{summary.totalPayable}</p>
          <button onClick={saveToSupabase}>Save Loan</button>
        </div>
      )}
    </div>
  );
}
