import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { getUserLoanDetailsbyId } from "../services/api";
import { calculateEMI } from "../utils/calculateEmi";
import LoanDetailsCard from "../components/Loan/LoanDetailsCard";
import { formatIN, formatINR } from "../utils/number";
import EmiChart from "../components/EmiChart";

const LoanDetails = () => {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState([]);
  console.log("🚀 ~ LoanDetails ~ summary:", summary);
  const [schedule, setSchedule] = useState([]);
  const location = useLocation();
  const id = location.state.loanId;

  useEffect(() => {
    async function fetchData() {
      const data = await getUserLoanDetailsbyId(id);
      setData(data);
      const op = calculateEMI(data);
      setSummary(op[0]);
      setSchedule(op[1]);
    }
    fetchData();
  }, [id]);

  return (
    <div>
      {summary && (
        <>
          <div className="loan-details-page">
            <div className="loan-details">
              <p>Loan Amount: {formatINR(summary.loan_amount, true)}</p>
              <p>EMI: {formatINR(summary.emi, true)}</p>
              <p>Interest Rate : {summary.interest_rate}%</p>
              <p>Emi Paid: {summary.paid}</p>
              <p>Paid Interest: {formatINR(summary.paidInterest, true)}</p>
              <p>Paid Principal: {formatINR(summary.paidPrincipal, true)}</p>
              <p>Remaining Tenure: {summary.remaining}</p>
              <p>
                Remaining Interest: {formatINR(summary.remainingInterest, true)}
              </p>
              <p>
                Remaining Principal:{" "}
                {formatINR(summary.remainingPrincipal, true)}
              </p>
              <p>Total Tenure: {summary.tenure_months}</p>
              <p>
                Total Interest Paid: {formatINR(summary.totalInterest, true)}
              </p>
              <p>
                Total Principal Paid: {formatINR(summary.totalPayment, true)}
              </p>
            </div>
            <div className="chart-wrapper">
              <EmiChart paid={summary.paid} total={summary.tenure_months} />
              <p>Remaining Tenure: {summary.remaining}</p>
            </div>
          </div>
        </>
      )}

      {schedule.length > 0 && (
        <>
          <div className="loandetails-card">
            {schedule.map((item, index) => {
              return (
                <LoanDetailsCard item={item} key={item.month} index={index} />
              );
            })}
          </div>
        </>
      )}

      {/* {schedule.length > 0 && (
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
      )} */}
    </div>
  );
};

export default LoanDetails;
