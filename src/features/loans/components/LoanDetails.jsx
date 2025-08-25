import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { calculateEMI } from "../../../utils/calculateEmi";
import LoanDetailsCard from "./LoanDetailsCard";
import { formatIN, formatINR } from "../../../utils/number";
import EmiChart from "../../../components/EmiChart";
import { useDispatch, useSelector } from "react-redux";
import { removeSummery } from "../../../redux/loanSlice";

const LoanDetails = () => {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const dispatch = useDispatch();
  // const location = useLocation();
  // const id = location.state.loanId;
  const { items, currentSchedule, emiSummary, status } = useSelector(
    (s) => s.loans
  );
  console.log("🚀 ~ LoanDetails ~ emiSummary:", emiSummary);

  const navigatin = useNavigate();

  // useEffect(() => {
  //   async function fetchData() {
  //     const data = await getUserLoanDetailsbyId(id);
  //     setData(data);
  //     const op = calculateEMI(data);
  //     setSummary(op[0]);
  //     setSchedule(op[1]);
  //   }
  //   fetchData();
  // }, [id]);

  const handleBack = () => {
    // navigatin(-1);
    dispatch(removeSummery());
  };

  return (
    <div>
      <Link className="btn btn-primary" onClick={handleBack}>
        Back
      </Link>
      {emiSummary && (
        <>
          <div className="loan-details-page">
            <div className="loan-details">
              <p>Loan Amount: {formatINR(emiSummary.loan_amount, true)}</p>
              <p>EMI: {formatINR(emiSummary.emi, true)}</p>
              <p>Interest Rate : {emiSummary.interest_rate}%</p>
              <p>Emi Paid: {emiSummary.paid}</p>
              <p>Paid Interest: {formatINR(emiSummary.paidInterest, true)}</p>
              <p>Paid Principal: {formatINR(emiSummary.paidPrincipal, true)}</p>
              <p>Remaining Tenure: {emiSummary.remaining}</p>
              <p>
                Remaining Interest:{" "}
                {formatINR(emiSummary.remainingInterest, true)}
              </p>
              <p>
                Remaining Principal:{" "}
                {formatINR(emiSummary.remainingPrincipal, true)}
              </p>
              <p>Total Tenure: {emiSummary.tenure_months}</p>
              <p>
                Total Interest Paid: {formatINR(emiSummary.totalInterest, true)}
              </p>
              <p>
                Total Principal Paid: {formatINR(emiSummary.totalPayment, true)}
              </p>
            </div>
            <div className="chart-wrapper">
              <EmiChart
                paid={emiSummary.paid}
                total={emiSummary.tenure_months}
              />
              <p>Remaining Tenure: {emiSummary.remaining}</p>
            </div>
          </div>
        </>
      )}

      {currentSchedule.length > 0 && (
        <>
          <div className="loandetails-card">
            {currentSchedule.map((item, index) => {
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
