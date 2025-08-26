import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import VantaBirds from "../components/VantaBirds";
import { useDispatch, useSelector } from "react-redux";
import { fetchSession, signOut } from "../redux/authSlice";
import { fetchLoans } from "../redux/loanSlice";

const Home = () => {
  const dispatch = useDispatch();
  const { status, error, user } = useSelector((s) => s.auth);

  useEffect(() => {
    dispatch(fetchLoans());
  }, [dispatch]);

  useEffect(() => {
    if (!user) {
      dispatch(fetchSession());
    }
  }, [dispatch]);

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
