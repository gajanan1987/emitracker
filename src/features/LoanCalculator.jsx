import { useState } from "react";
import { addMonths, format } from "date-fns";
import "./../style/loanCalculator.scss";
import { formatINR } from "../utils/number";
import {
  calculateLoanAmount,
  calculateRemainingTenure,
  calculateROI,
} from "../utils/calculateEmi";

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [tenure, setTenure] = useState("");

  const [schedule, setSchedule] = useState([]);
  const [summary, setSummary] = useState(null);

  const round = (num) => Math.round(num);

  const calculateEMI = () => {
    const P = parseFloat(loanAmount);
    const annualRate = parseFloat(interestRate);
    const n = parseInt(tenure);
    const r = annualRate / 12 / 100;

    if (!P || !annualRate || !n) {
      alert("Please fill all fields correctly!");
      return;
    }

    // ---- Assumptions ----
    const loanStart = new Date(); // today
    const firstEmi = addMonths(loanStart, 1); // first EMI after 1 month

    // EMI Formula
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    // Amortization
    let balance = P;
    let scheduleArr = [];
    let totalInterest = 0;
    let totalPrincipal = 0;

    for (let i = 1; i <= n; i++) {
      const interestForMonth = balance * r;
      const principalForMonth = emi - interestForMonth;
      balance -= principalForMonth;

      totalInterest += interestForMonth;
      totalPrincipal += principalForMonth;

      const emiDueDate = addMonths(firstEmi, i - 1);

      scheduleArr.push({
        month: format(emiDueDate, "dd MMM yyyy"),
        emi: round(emi),
        principal: round(principalForMonth),
        interest: round(interestForMonth),
        balance: balance > 0 ? round(balance) : 0,
        date: emiDueDate,
      });
    }

    // Till date EMIs paid
    const today = new Date();
    const paid = scheduleArr.filter((row) => row.date <= today).length;
    const remaining = n - paid;

    const paidPrincipal = scheduleArr
      .slice(0, paid)
      .reduce((sum, row) => sum + row.principal, 0);

    const paidInterest = scheduleArr
      .slice(0, paid)
      .reduce((sum, row) => sum + row.interest, 0);

    const remainingPrincipal = round(P - paidPrincipal);
    const remainingInterest = round(totalInterest - paidInterest);

    setSchedule(scheduleArr);
    setSummary({
      emi: round(emi),
      totalInterest: round(totalInterest),
      totalPayment: round(P + totalInterest),
      paid,
      remaining,
      paidPrincipal: paidPrincipal,
      paidInterest: paidInterest,
      remainingPrincipal,
      remainingInterest,
    });
  };

  const op = calculateLoanAmount(32500, 7.4, 54);
  console.log("🚀 ~ LoanCalculator ~ op:", op);
  const op1 = calculateROI(1488833, 32500, 54);
  console.log("🚀 ~ LoanCalculator ~ op1:", op1);
  const op2 = calculateRemainingTenure(1488833, 32500, 7.4, 20);
  console.log("🚀 ~ LoanCalculator ~ op2:", op2);

  return (
    <div className="loan-tracker">
      <h1>EMI Calculator</h1>

      <div className="form">
        <input
          type="number"
          placeholder="Loan Amount"
          value={loanAmount}
          onChange={(e) => setLoanAmount(e.target.value)}
        />
        {/* <input type="range" id="volume" name="volume" min="0" max="100" /> */}
        <input
          type="number"
          placeholder="Annual Interest Rate (%)"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
        />
        <input
          type="number"
          placeholder="Tenure (Months)"
          value={tenure}
          onChange={(e) => setTenure(e.target.value)}
        />
        <button className="btn btn-primary" onClick={calculateEMI}>
          Calculate
        </button>
      </div>

      {summary && (
        <div className="summary">
          <h2>Summary</h2>
          <p>EMI: {formatINR(summary.emi, true)}</p>
          <p>Total Interest: {formatINR(summary.totalInterest, true)}</p>
          <p>Total Payment: {formatINR(summary.totalPayment, true)}</p>
          <p>Paid EMIs: {summary.paid}</p>
          <p>Remaining EMIs: {summary.remaining}</p>
          <p>Principal Paid: {formatINR(summary.paidPrincipal, true)}</p>
          <p>Interest Paid: {formatINR(summary.paidInterest, true)}</p>
          <p>
            Remaining Principal: {formatINR(summary.remainingPrincipal, true)}
          </p>
          <p>
            Remaining Interest: {formatINR(summary.remainingInterest, true)}
          </p>
        </div>
      )}

      {schedule.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>EMI</th>
              <th>Principal</th>
              <th>Interest</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((row, index) => (
              <tr
                key={index}
                style={{
                  background:
                    row.date <= new Date() ? "#e0ffe0" : "transparent",
                }}
              >
                <td>{row.month}</td>
                <td>{row.emi}</td>
                <td>{row.principal}</td>
                <td>{row.interest}</td>
                <td>{row.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
