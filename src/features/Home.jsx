import React, { useEffect, useMemo } from "react";
import { Link } from "react-router";
import VantaBirds from "../components/VantaBirds";
import { useDispatch, useSelector } from "react-redux";
import { fetchLoans } from "../redux/loanSlice";
import { formatINR } from "../utils/number";
import { format } from "date-fns";

const Home = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { items } = useSelector((s) => s.loans);

  useEffect(() => {
    if (user) {
      dispatch(fetchLoans());
    }
  }, [dispatch, user]);

  // ✅ Precompute active loans + totals
  const { activeLoans, totalLoan, totalEmi, paidMonth, remaningMonth } =
    useMemo(() => {
      const active = items
        .map((item) => {
          return item;
        })
        .filter((item) => {
          return item.loanStatus !== "fullypaid";
        }); // Exclude fully paid

      const paidMonth = items
        .filter((item) => {
          return item.emiStatus === "Done" && item.loanStatus !== "fullypaid";
        })
        .reduce((sum, item) => {
          return sum + item.emi_amount;
        }, 0);

      const remaningMonth = items
        .filter((item) => {
          return (
            item.emiStatus === "Pending" && item.loanStatus !== "fullypaid"
          );
        })
        .reduce((sum, item) => {
          return sum + item.emi_amount;
        }, 0);

      return {
        activeLoans: active,
        totalLoan: active.reduce((sum, item) => sum + item.loan_amount, 0),
        totalEmi: active.reduce((sum, item) => sum + item.emi_amount, 0),
        paidMonth,
        remaningMonth,
      };
    }, [items]);

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

      {user && activeLoans.length > 0 && (
        <table className="table-reponsive loan-table home-table">
          <thead>
            <tr>
              <th>Loan</th>
              <th>Loan Amount</th>
              <th>EMI</th>
              <th>Due Date</th>
              <th>Remaining</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {activeLoans.map((item) => (
              <tr className="tr-year" key={item.id}>
                <td>{item.loan_name}</td>
                <td>{formatINR(item.loan_amount, true)}</td>
                <td>{formatINR(item.emi_amount, true)}</td>
                <td>{format(new Date(item.nextDueDate), "dd MMM yyyy")}</td>
                <td>{item.remaningEmi} months</td>
                <td className={item.emiStatus}>{item.emiStatus}</td>
              </tr>
            ))}

            {/* ✅ Summary row */}
            <tr className="summary-row">
              <td>Total</td>
              <td>{formatINR(totalLoan, true)}</td>
              <td>{formatINR(totalEmi, true)}</td>
              <td colSpan="3">
                <div>
                  <div className="paid">
                    <span>Paid Monthaly EMI:</span> {formatINR(paidMonth, true)}
                  </div>
                  <div className="rem">
                    <span>Remaning Monthaly EMI:</span>{" "}
                    {formatINR(remaningMonth, true)}
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </>
  );
};

export default Home;
