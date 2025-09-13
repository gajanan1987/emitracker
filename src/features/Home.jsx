import React, { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router";
import VantaBirds from "../components/VantaBirds";
import { useDispatch, useSelector } from "react-redux";
import { fetchLoans, selectLoanItems } from "../redux/loanSlice";
import { formatINR } from "../utils/number";
import { format } from "date-fns";
import { useAuth } from "../hooks/useAuth";

const Home = () => {
  const dispatch = useDispatch();
  const { session, loading } = useAuth();
  const { user } = useSelector((s) => s.auth);
  const { items, status } = useSelector((s) => s.loans);

  const [sortKey, setSortKey] = useState("nextDueDate"); // default sort
  const [sortOrder, setSortOrder] = useState("asc"); // asc or desc

  // useEffect(() => {
  //   if (user) {
  //     dispatch(fetchLoans());
  //   }
  // }, [dispatch, user]);
  useEffect(() => {
    if (user && session) {
      dispatch(fetchLoans());
    }
  }, [dispatch, user, session]);

  const { activeLoans, totalLoanAmount, totalEmi, paidMonth, remaningMonth } =
    useSelector(selectLoanItems);
  // useSelector(selectLoanSummary);
  const newdata = useSelector(selectLoanItems);
  console.log("🚀 ~ Home ~ newdata:", newdata);

  const sortedLoans = useMemo(() => {
    if (!activeLoans) return [];
    return [...activeLoans].sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];

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

  if (loading) return <p className="loading">Loading...</p>; // wait for session check
  if (!user) return <Navigate to="/login" />;

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
          {loading || (status === "loading" && <p>Loading loans...</p>)}

          {status === "succeeded" && sortedLoans.length === 0 && (
            <p>No loans found. Add your first loan to start tracking 🚀</p>
          )}
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
                    {/* <td>{format(new Date(item.nextDueDate), "dd MMM yyyy")}</td> */}
                    <td>
                      {item.nextDueDate
                        ? format(new Date(item.nextDueDate), "dd MMM yyyy")
                        : "N/A"}
                    </td>
                    <td>{item.remaningEmi} months</td>
                    <td className={item.emiStatus}>{item.emiStatus}</td>
                  </tr>
                ))}

                {/* ✅ Summary row */}
                <tr className="summary-row">
                  <td>Total</td>
                  <td>{formatINR(totalLoanAmount, true)}</td>
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
