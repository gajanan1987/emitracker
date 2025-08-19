// import React, { useState } from "react";
// import { differenceInMonths, addMonths, format } from "date-fns";
// import "./../style/loanTracker.scss";

// export default function LoanCalculator() {
//   const [loanAmount, setLoanAmount] = useState("");
//   const [interestRate, setInterestRate] = useState("");
//   const [tenure, setTenure] = useState("");
//   const [loanDate, setLoanDate] = useState("");
//   const [emiDate, setEmiDate] = useState("");
//   const [schedule, setSchedule] = useState([]);
//   const [summary, setSummary] = useState(null);

//   const calculateEMI = () => {
//     const P = parseFloat(loanAmount);
//     const annualRate = parseFloat(interestRate);
//     const n = parseInt(tenure);
//     const r = annualRate / 12 / 100;

//     // EMI Formula
//     const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

//     // Amortization
//     let balance = P;
//     let scheduleArr = [];
//     let totalInterest = 0;
//     let totalPrincipal = 0;
//     let startDate = new Date(loanDate);

//     for (let i = 1; i <= n; i++) {
//       const interestForMonth = balance * r;
//       const principalForMonth = emi - interestForMonth;
//       balance -= principalForMonth;

//       totalInterest += interestForMonth;
//       totalPrincipal += principalForMonth;

//       scheduleArr.push({
//         month: format(addMonths(startDate, i - 1), "MMM yyyy"),
//         emi: emi.toFixed(2),
//         principal: principalForMonth.toFixed(2),
//         interest: interestForMonth.toFixed(2),
//         balance: balance > 0 ? balance.toFixed(2) : "0.00",
//       });
//     }

//     // Till date EMIs paid
//     const paidMonths = differenceInMonths(new Date(), new Date(loanDate)) + 1;
//     const paid = Math.min(paidMonths, n);
//     const remaining = n - paid;

//     const paidPrincipal = scheduleArr
//       .slice(0, paid)
//       .reduce((sum, row) => sum + parseFloat(row.principal), 0);

//     const paidInterest = scheduleArr
//       .slice(0, paid)
//       .reduce((sum, row) => sum + parseFloat(row.interest), 0);

//     const remainingPrincipal = P - paidPrincipal;
//     const remainingInterest = totalInterest - paidInterest;

//     setSchedule(scheduleArr);
//     setSummary({
//       emi: emi.toFixed(2),
//       totalInterest: totalInterest.toFixed(2),
//       totalPayment: (P + totalInterest).toFixed(2),
//       paid,
//       remaining,
//       paidPrincipal: paidPrincipal.toFixed(2),
//       paidInterest: paidInterest.toFixed(2),
//       remainingPrincipal: remainingPrincipal.toFixed(2),
//       remainingInterest: remainingInterest.toFixed(2),
//     });
//   };

//   return (
//     <div className="loan-tracker">
//       <h1>Loan EMI Tracker</h1>

//       <div className="form">
//         <input
//           type="number"
//           placeholder="Loan Amount"
//           value={loanAmount}
//           onChange={(e) => setLoanAmount(e.target.value)}
//         />
//         <input
//           type="number"
//           placeholder="Annual Interest Rate (%)"
//           value={interestRate}
//           onChange={(e) => setInterestRate(e.target.value)}
//         />
//         <input
//           type="number"
//           placeholder="Tenure (Months)"
//           value={tenure}
//           onChange={(e) => setTenure(e.target.value)}
//         />
//         <label>Loan Start Date</label>
//         <input
//           type="date"
//           value={loanDate}
//           onChange={(e) => setLoanDate(e.target.value)}
//         />
//         <label>EMI Payment Date</label>
//         <input
//           type="date"
//           value={emiDate}
//           onChange={(e) => setEmiDate(e.target.value)}
//         />
//         <button onClick={calculateEMI}>Calculate</button>
//       </div>

//       {summary && (
//         <div className="summary">
//           <h2>Summary</h2>
//           <p>EMI: ₹{summary.emi}</p>
//           <p>Total Interest: ₹{summary.totalInterest}</p>
//           <p>Total Payment: ₹{summary.totalPayment}</p>
//           <p>Paid EMIs: {summary.paid}</p>
//           <p>Remaining EMIs: {summary.remaining}</p>
//           <p>Principal Paid: ₹{summary.paidPrincipal}</p>
//           <p>Interest Paid: ₹{summary.paidInterest}</p>
//           <p>Remaining Principal: ₹{summary.remainingPrincipal}</p>
//           <p>Remaining Interest: ₹{summary.remainingInterest}</p>
//         </div>
//       )}

//       {schedule.length > 0 && (
//         <table>
//           <thead>
//             <tr>
//               <th>Month</th>
//               <th>EMI</th>
//               <th>Principal</th>
//               <th>Interest</th>
//               <th>Balance</th>
//             </tr>
//           </thead>
//           <tbody>
//             {schedule.map((row, index) => (
//               <tr key={index}>
//                 <td>{row.month}</td>
//                 <td>{row.emi}</td>
//                 <td>{row.principal}</td>
//                 <td>{row.interest}</td>
//                 <td>{row.balance}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }

import { useState } from "react";
import { addMonths, format } from "date-fns";
import "./../style/loanCalculator.scss";

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [tenure, setTenure] = useState("");

  const [loanDate, setLoanDate] = useState("");
  const [emiDate, setEmiDate] = useState("");

  const [schedule, setSchedule] = useState([]);
  const [summary, setSummary] = useState(null);

  const round = (num) => Math.round(num); // ✅ rounding helper

  const calculateEMI = () => {
    const P = parseFloat(loanAmount);
    const annualRate = parseFloat(interestRate);
    const n = parseInt(tenure);
    const r = annualRate / 12 / 100;

    if (!P || !annualRate || !n || !loanDate || !emiDate) {
      alert("Please fill all fields correctly!");
      return;
    }

    const loanStart = new Date(loanDate);
    const firstEmi = new Date(emiDate);

    // ✅ validation: first EMI date should be after loan start date
    if (firstEmi <= loanStart) {
      alert("First EMI Date must be greater than Loan Start Date!");
      return;
    }

    // EMI Formula
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    // Amortization
    let balance = P;
    let scheduleArr = [];
    let totalInterest = 0;
    let totalPrincipal = 0;

    let startDate = firstEmi;

    for (let i = 1; i <= n; i++) {
      const interestForMonth = balance * r;
      const principalForMonth = emi - interestForMonth;
      balance -= principalForMonth;

      totalInterest += interestForMonth;
      totalPrincipal += principalForMonth;

      const emiDueDate = addMonths(startDate, i - 1);

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

  return (
    <div className="loan-tracker">
      <h1>Loan EMI Tracker</h1>

      <div className="form">
        <input
          type="number"
          placeholder="Loan Amount"
          value={loanAmount}
          onChange={(e) => setLoanAmount(e.target.value)}
        />
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
        <button onClick={calculateEMI}>Calculate</button>
      </div>

      {summary && (
        <div className="summary">
          <h2>Summary</h2>
          <p>EMI: ₹{summary.emi}</p>
          <p>Total Interest: ₹{summary.totalInterest}</p>
          <p>Total Payment: ₹{summary.totalPayment}</p>
          <p>Paid EMIs: {summary.paid}</p>
          <p>Remaining EMIs: {summary.remaining}</p>
          <p>Principal Paid: ₹{summary.paidPrincipal}</p>
          <p>Interest Paid: ₹{summary.paidInterest}</p>
          <p>Remaining Principal: ₹{summary.remainingPrincipal}</p>
          <p>Remaining Interest: ₹{summary.remainingInterest}</p>
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
