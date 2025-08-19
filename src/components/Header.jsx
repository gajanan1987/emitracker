import { Link, NavLink } from "react-router";
import "./../style/header.scss";
import { useAuth } from "../contex/Contex";

const Header = () => {
  const { user } = useAuth();
  return (
    <nav className="header-nav">
      <NavLink to="/" exact="true">
        EMI Tracker
      </NavLink>
      <ul className="nav-links">
        <li>
          <NavLink to="/loancalculator" activeclassname="active">
            Loan Calculator
          </NavLink>
        </li>
        {!user && (
          <>
            <li>
              <NavLink to="/login" activeclassname="active">
                Login
              </NavLink>
            </li>
            <li>
              <NavLink to="/signup" activeclassname="active">
                Signup
              </NavLink>
            </li>
          </>
        )}

        {user && (
          <li>
            <NavLink to="/account" activeclassname="active">
              Account
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Header;
