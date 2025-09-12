import { useState } from "react";
import { formatINR } from "../../utils/number";
import LoanTable from "../loans/components/LoanTable";
import { useDispatch, useSelector } from "react-redux";
import {
  computeScheduleFor,
  removeSummery,
  selectScheduleState,
} from "../../redux/loanSlice";
import RoiCalc from "./components/RoiCalc";
import PrincipalCalc from "./components/PrincipalCalc";

export default function LoanCalculator() {
  const menu = ["Calculate EMI", "Calculate ROI", "Calculate Principal"];
  const dispatch = useDispatch();
  const currentSchedule = useSelector(selectScheduleState);

  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [tenure, setTenure] = useState("");

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

    dispatch(computeScheduleFor({ data, type: "loanDetails" }));
  };

  const handleChange = (item) => {
    setBtn(item);
    if (currentSchedule) {
      dispatch(removeSummery());
    }
  };

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
