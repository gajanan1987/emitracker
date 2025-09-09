import React, { useState } from "react";
import { Link } from "react-router";
import LoanDetailsCard from "./LoanDetailsCard";
import { formatINR } from "../../../utils/number";
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
  console.log("🚀 ~ LoanDetails ~ currentSchedule:", currentSchedule);

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
      <Link className="btn btn-primary btn-back" onClick={handleBack}>
        Back
      </Link>
      {emiSummary && (
        <>
          <div className="loan-details-header">
            <div className="loan-details">
              <p>
                <span>Loan Name:</span> {emiSummary.loan_name}
              </p>
              ----------------------------------------------------------------------
              <p>
                <span>EMI:</span> {formatINR(emiSummary.emi, true)}
              </p>
              <p>
                <span>Interest Rate :</span> {emiSummary.interest_rate}%
              </p>
              ----------------------------------------------------------------------
              <p>
                <span>Loan Amount (A):</span>
                {formatINR(emiSummary.loan_amount, true)}
              </p>
              <p>
                <span>Interest (B): </span>{" "}
                {formatINR(emiSummary.totalInterest, true)}
              </p>
              <p>
                <span>Total Paid (A + B): </span>{" "}
                {formatINR(emiSummary.totalPayment, true)}
              </p>
              ----------------------------------------------------------------------
              {/* <p>
                <span>Emi Paid:</span> {emiSummary.paid}
              </p> */}
              <p>
                <span>Paid Interest:</span>
                {formatINR(emiSummary.paidInterest, true)}
              </p>
              <p>
                <span>Paid Principal:</span>
                {formatINR(emiSummary.paidPrincipal, true)}
              </p>
              {/* <p>Remaining Tenure: {emiSummary.remaining}</p> */}
              ----------------------------------------------------------------------
              <p>
                <span>Remaining Interest: </span>
                {formatINR(emiSummary.remainingInterest, true)}
              </p>
              <p>
                <span>Remaining Principal: </span>
                {formatINR(emiSummary.remainingPrincipal, true)}
              </p>
              {/* <p>
                <span>Total Tenure: </span> {emiSummary.tenure_months}
              </p> */}
              {/* <p>
                <span>Total Interest Paid: </span>{" "}
                {formatINR(emiSummary.totalInterest, true)}
              </p> */}
              {/* <p>
                <span>Total Principal Paid: </span>{" "}
                {formatINR(emiSummary.totalPayment, true)}
              </p> */}
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
              <React.Fragment key={index}>
                <LoanDetailsCard item={item} key={item.month} index={index} />
              </React.Fragment>
            ))}
          </div>
        ) : (
          <LoanTable currentSchedule={currentSchedule} />
        ))}
    </div>
  );
};

export default LoanDetails;
