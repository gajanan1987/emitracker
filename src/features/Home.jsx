import { useEffect } from "react";
import { Link } from "react-router";
import VantaBirds from "../components/VantaBirds";
import { useDispatch, useSelector } from "react-redux";
import { fetchLoans } from "../redux/loanSlice";

const Home = () => {
  const dispatch = useDispatch();
  const { status, error, user } = useSelector((s) => s.auth);
  const { items } = useSelector((s) => s.loans);

  useEffect(() => {
    if (user && items.length < 0) {
      dispatch(fetchLoans());
    }
  }, [dispatch, user]);

  return (
    <>
      <div className="home-banner">
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

        <Link className="btn btn-primary" to={user ? "/loans-list" : "/login"}>
          Track Emi
        </Link>
        <VantaBirds />
      </div>
    </>
  );
};

export default Home;
