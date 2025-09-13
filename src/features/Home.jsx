import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import VantaBirds from "../components/VantaBirds";
import { useDispatch, useSelector } from "react-redux";
import { fetchLoans } from "../redux/loanSlice";
import { formatINR } from "../utils/number";
import { format } from "date-fns";
import { useAuth } from "../hooks/useAuth";

const Home = () => {
  const dispatch = useDispatch();
  const { session, loading } = useAuth();
  const { user } = useSelector((s) => s.auth);
  const { items, status } = useSelector((s) => s.loans);
  console.log("🚀 ~ Home ~ status:", status);

  const [sortKey, setSortKey] = useState("nextDueDate"); // default sort
  const [sortOrder, setSortOrder] = useState("asc"); // asc or desc

  useEffect(() => {
    if (user && items.length < 1) {
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

  const sortedLoans = useMemo(() => {
    const sorted = [...activeLoans];
    sorted.sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];

      // If date field
      if (sortKey === "nextDueDate") {
        valA = new Date(valA);
        valB = new Date(valB);
      }

      if (typeof valA === "string") {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [activeLoans, sortKey, sortOrder]);

  // ✅ Handle sort change
  const handleSort = (key) => {
    if (sortKey === key) {
      // toggle order if same column
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <div
        className={`home-banner ${session && user ? "logedin" : "logedout"} `}
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
        <>
          {status === "loading" && <p>Loading loans...</p>}

          {status === "succeeded" && sortedLoans.length > 0 && (
            <table className="table-reponsive common-table home-table">
              <thead>
                <tr>
                  <th
                    className="loan-name"
                    onClick={() => handleSort("loan_name")}
                  >
                    Loan
                  </th>
                  <th
                    className="principal"
                    onClick={() => handleSort("loan_amount")}
                  >
                    Loan Amount
                  </th>
                  <th
                    className="intrest"
                    onClick={() => handleSort("emi_amount")}
                  >
                    EMI
                  </th>
                  <th onClick={() => handleSort("nextDueDate")}>Due Date</th>
                  <th onClick={() => handleSort("remaningEmi")}>Remaining</th>
                  <th onClick={() => handleSort("emiStatus")}>Status</th>
                </tr>
              </thead>

              <tbody>
                {sortedLoans.map((item) => (
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
                        <span>Paid Monthly EMI:</span>{" "}
                        {formatINR(paidMonth, true)}
                      </div>
                      <div className="rem">
                        <span>Remaining Monthly EMI:</span>{" "}
                        {formatINR(remaningMonth, true)}
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </>
      )}
    </>
  );
};

export default Home;
