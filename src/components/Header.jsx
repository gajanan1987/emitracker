import { Link, NavLink } from "react-router";
import logo from "../../public/logo.svg";
import { useSelector } from "react-redux";
import { useState } from "react";

const Header = () => {
  const { status, error, user } = useSelector((s) => s.auth);
  const [nav, setNav] = useState(false);

  const handleHamburger = () => {
    setNav(!nav);
  };
  return (
    <nav className="header-nav">
      <NavLink
        className="logo"
        to="/"
        exact="true"
        onClick={() => setNav(false)}
      >
        <img src={logo} />
      </NavLink>

      <Link className="hamburger" onClick={handleHamburger}>
        <div></div>
        <div></div>
        <div></div>
      </Link>
      <ul className={`nav-links ${nav ? "show" : "hide"}`}>
        <li>
          <NavLink to="/loancalculator" onClick={() => setNav(false)}>
            EMI Calculator
          </NavLink>
        </li>
        {!user && (
          <>
            <li>
              <NavLink to="/login" onClick={() => setNav(false)}>
                Login
              </NavLink>
            </li>
          </>
        )}

        {user && (
          <>
            <li>
              <NavLink to="/loans-list" onClick={() => setNav(false)}>
                Loans
              </NavLink>
            </li>
            <li>
              <NavLink to="/outstanding" onClick={() => setNav(false)}>
                Outstanding
              </NavLink>
            </li>
            <li>
              <NavLink to="/account" onClick={() => setNav(false)}>
                Account
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Header;
