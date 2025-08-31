import { Link, NavLink } from "react-router";
import logo from "../../public/logo.svg";
import { useSelector } from "react-redux";

const Header = () => {
  const { status, error, user } = useSelector((s) => s.auth);
  return (
    <nav className="header-nav">
      <NavLink className="logo" to="/" exact="true">
        <img src={logo} />
      </NavLink>
      <ul className="nav-links">
        <li>
          <NavLink to="/loancalculator">EMI Calculator</NavLink>
        </li>
        {!user && (
          <>
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
          </>
        )}

        {user && (
          <>
            <li>
              <NavLink to="/loans-list">Loans</NavLink>
            </li>
            <li>
              <NavLink to="/account">Account</NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Header;
