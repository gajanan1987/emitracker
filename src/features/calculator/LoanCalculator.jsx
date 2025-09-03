import { useEffect, useState } from "react";
import { addMonths, format } from "date-fns";
import { formatINR } from "../../utils/number";
import {
  calculateLoanAmount,
  calculateRemainingTenure,
  calculateROI,
} from "../../utils/calculateEmi";
import LoanTable from "../loans/components/LoanTable";
import { useDispatch, useSelector } from "react-redux";
import {
  computeScheduleFor,
  removeSummery,
  selectScheduleState,
} from "../../redux/loanSlice";
import { Link, NavLink } from "react-router";
import RoiCalc from "./components/RoiCalc";
import PrincipalCalc from "./components/PrincipalCalc";

export default function LoanCalculator() {
  const menu = ["Calculate EMI", "Calculate ROI", "Calculate Principal"];
  const dispatch = useDispatch();
  const currentSchedule = useSelector(selectScheduleState);
  console.log("🚀 ~ LoanCalculator ~ currentSchedule:", currentSchedule);

  const [loanAmount, setLoanAmount] = useState(3000000);
  const [interestRate, setInterestRate] = useState(12);
  const [tenure, setTenure] = useState(120);

  const [btn, setBtn] = useState("Calculate EMI");

  const [schedule, setSchedule] = useState([]);
  const [summary, setSummary] = useState(null);

  const handleCalc = () => {
    const today = new Date();
    const formatDate = (date) => date.toISOString().split("T")[0];
    const loan_date = formatDate(today);
    const emi_date = formatDate(new Date(today.setDate(today.getDate() + 1)));
    const data = {
      loan_amount: loanAmount,
      interest_rate: interestRate,
      tenure_months: tenure,
      loan_date,
      emi_date,
    };

    console.log("🚀 ~ handleCalc ~ data:", data);
    dispatch(computeScheduleFor({ data, type: "loanDetails" }));
  };

  const handleChange = (item) => {
    setBtn(item);
    if (currentSchedule) {
      dispatch(removeSummery());
    }
  };

  // const op = calculateLoanAmount(32500, 7.4, 54);
  // console.log("🚀 ~ LoanCalculator ~ op:", op);

  // const op1 = calculateROI(1488833, 32500, 54);
  // console.log("🚀 ~ LoanCalculator ~ op1:", op1);

  // const op2 = calculateRemainingTenure(1488833, 32500, 7.4, 20);
  // console.log("🚀 ~ LoanCalculator ~ op2:", op2);

  return (
    <div className="loan-tracker">
      <div className="cust-btn-group">
        <ul>
          {menu.map((item) => {
            return (
              <li key={item} className={` ${btn === item ? "active" : ""}`}>
                <button className="cust-btn" onClick={() => handleChange(item)}>
                  {item}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {btn === "Calculate EMI" && (
        <>
          <h1>EMI Calculator</h1>
          <div className="form">
            <div className="input-wrapper">
              <label>Enter Loan Amount</label>

              <input
                type="number"
                placeholder="Loan Amount"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
              />
            </div>
            <div className="input-wrapper">
              <label>Enter RIO</label>

              <input
                type="number"
                placeholder="Annual Interest Rate (%)"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
              />
            </div>
            <div className="input-wrapper">
              <label>Enter Tenure</label>
              <input
                type="number"
                placeholder="Tenure (Months)"
                value={tenure}
                onChange={(e) => setTenure(e.target.value)}
              />
            </div>

            {/* <input type="range" id="volume" name="volume" min="0" max="100" /> */}

            <div className="btn-wrapper">
              <button className="btn btn-primary" onClick={() => handleCalc()}>
                Calculate
              </button>
            </div>
          </div>
        </>
      )}
      {btn === "Calculate ROI" && <RoiCalc />}
      {btn === "Calculate Principal" && <PrincipalCalc />}

      {summary && (
        <div className="summary">
          <h2>Summary</h2>
          <p>EMI: {formatINR(summary.emi, true)}</p>
          <p>Interest: {formatINR(summary.totalInterest, true)}</p>
          <p>Loan + Interest: {formatINR(summary.totalPayment, true)}</p>
          {/* <p>Paid EMIs: {summary.paid}</p> */}
          {/* <p>Remaining EMIs: {summary.remaining}</p> */}
          {/* <p>Principal Paid: {formatINR(summary.paidPrincipal, true)}</p>
          <p>Interest Paid: {formatINR(summary.paidInterest, true)}</p> */}
          {/* <p>
            Remaining Principal: {formatINR(summary.remainingPrincipal, true)}
          </p>
          <p>
            Remaining Interest: {formatINR(summary.remainingInterest, true)}
          </p> */}
        </div>
      )}

      {currentSchedule?.length > 0 && (
        <LoanTable currentSchedule={currentSchedule} />
      )}
    </div>
  );
}
