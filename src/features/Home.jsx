import React, { useEffect } from "react";
import { Link } from "react-router";
import VantaBirds from "../components/VantaBirds";
import { useDispatch, useSelector } from "react-redux";
import { fetchLoans } from "../redux/loanSlice";
import { formatINR } from "../utils/number";
import { format, isBefore, isToday } from "date-fns";
import { pendingEmi } from "../utils/pendingEmi";

const Home = () => {
  const dispatch = useDispatch();
  const { status, error, user } = useSelector((s) => s.auth);
  const { items } = useSelector((s) => s.loans);
  console.log("🚀 ~ Home ~ items:", items);

  useEffect(() => {
    if (user && items.length < 1) {
      dispatch(fetchLoans());
    }
  }, [dispatch, user]);

  return (
    <>
      <div
        className={`home-banner ${items.length > 0 ? "logedin" : "logedout"} `}
      >
        <div>
          <h1 className="color-title">
            Simplifying Loan Management for Everyone
          </h1>

          <p>
            Managing loans doesn’t have to be complicated. Our platform makes it
            easy to:
          </p>
          <ul>
            <li>Track loan applications in real-time</li>
            <li>Automate EMI schedules and reminders</li>
            <li>Monitor payments and defaulters with accuracy</li>
            <li>Get insightful reports and dashboards</li>
          </ul>

          <Link
            className="btn btn-primary"
            to={user ? "/loans-list" : "/login"}
          >
            Track Emi
          </Link>
          <VantaBirds />
        </div>
      </div>

      {user && (
        <table className="table-reponsive loan-table home-table">
          <thead>
            <tr>
              <th>Loan</th>
              <th>Loan Amount</th>
              <th>EMI</th>
              <th>Date</th>
              <th>Remaning</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {items?.map((item) => {
              const targetDate = new Date(item.emi_date);
              const today = new Date();
              const newDate = new Date(
                today.getFullYear(),
                today.getMonth(),
                targetDate.getDate()
              );
              const status = isToday(newDate)
                ? "Today"
                : isBefore(newDate, new Date())
                ? "Done"
                : "Pending";

              const tenure = item.tenure_months;
              const remaningEmi = pendingEmi(targetDate, tenure);
              return (
                <React.Fragment key={item.id}>
                  <tr className="tr-year">
                    <td>{item.loan_name}</td>
                    <td>{formatINR(item.loan_amount, true)}</td>
                    <td>{formatINR(item.emi_amount, true)}</td>
                    <td>{format(newDate, "dd MMM yyyy")}</td>
                    <td>{remaningEmi} months</td>
                    <td className={`${status}`}>{status}</td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
};

export default Home;
