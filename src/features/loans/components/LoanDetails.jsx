import React, { useEffect, useState } from "react";
import { data, Link, useLocation, useNavigate } from "react-router";
import { calculateEMI } from "../../../utils/calculateEmi";
import LoanDetailsCard from "./LoanDetailsCard";
import { formatIN, formatINR } from "../../../utils/number";
import EmiChart from "../../../components/EmiChart";
import { useDispatch, useSelector } from "react-redux";
import { removeSummery } from "../../../redux/loanSlice";
import LoanTable from "./LoanTable";

const LoanDetails = () => {
  const [view, setView] = useState("table");
  const dispatch = useDispatch();
  const { items, currentSchedule, emiSummary, status } = useSelector(
    (s) => s.loans
  );

  const navigatin = useNavigate();

  const handleBack = () => {
    dispatch(removeSummery());
  };

  const handleView = () => {
    if (view === "card") {
      setView("table");
    } else {
      setView("card");
    }
  };

  return (
    <div className="loan-details-wrapper">
      <Link className="btn btn-primary" onClick={handleBack}>
        Back
      </Link>
      {emiSummary && (
        <>
          <div className="loan-details-header">
            <div className="loan-details">
              <p>Loan Name: {emiSummary.loan_name}</p>
              <p>Loan Amount: {formatINR(emiSummary.loan_amount, true)}</p>
              <p>EMI: {formatINR(emiSummary.emi, true)}</p>
              <p>Interest Rate : {emiSummary.interest_rate}%</p>
              <p>Emi Paid: {emiSummary.paid}</p>
              <p>Paid Interest: {formatINR(emiSummary.paidInterest, true)}</p>
              <p>Paid Principal: {formatINR(emiSummary.paidPrincipal, true)}</p>
              {/* <p>Remaining Tenure: {emiSummary.remaining}</p> */}
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

      <div className="btn-wrapper">
        <button className="btn btn-primary" onClick={() => handleView()}>
          {view === "card" ? "Switch Table view" : "Switch Card View"}
        </button>
      </div>

      {currentSchedule.length > 0 &&
        (view === "card" ? (
          <div className="loandetails-card">
            {currentSchedule.map((item, index) => (
              <LoanDetailsCard item={item} key={item.month} index={index} />
            ))}
          </div>
        ) : (
          <LoanTable currentSchedule={currentSchedule} />
        ))}
    </div>
  );
};

export default LoanDetails;
