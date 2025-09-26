import { Link } from "react-router";
import VantaBirds from "../../../components/VantaBirds";

const Banner = ({ session, user }) => {
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
    </>
  );
};

export default Banner;
