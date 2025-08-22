import { Link, NavLink } from "react-router";
import "./../style/header.scss";
import { useAuth } from "../contex/Contex";
import logo from "../../public/logo.svg";

const Header = () => {
  const { user } = useAuth();
  return (
    <nav className="header-nav">
      <NavLink to="/" exact="true">
        <img src={logo} />
      </NavLink>
      <ul className="nav-links">
        <li>
          <NavLink to="/loancalculator">Loan Calculator</NavLink>
        </li>
        {!user && (
          <>
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
          </>
        )}

        {user && (
          <li>
            <NavLink to="/account">Account</NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Header;
