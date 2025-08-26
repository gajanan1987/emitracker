import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { signOut } from "../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";

const AccountPage = () => {
  const [loginUser, setUser] = useState(null);

  const dispatch = useDispatch();
  const navigatin = useNavigate();

  const { status, error, user } = useSelector((s) => s.auth);

  const handleLogout = async () => {
    dispatch(signOut());
    navigatin("/");
  };

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user]);

  return (
    <div className="account-container">
      <div className="account-card">
        <h2>My Account</h2>

        {loginUser ? (
          <>
            <p>
              <strong>Email:</strong> {loginUser.email}
            </p>
            <button onClick={handleLogout}>Log Out</button>
          </>
        ) : (
          <p>Loading user information...</p>
        )}
      </div>
    </div>
  );
};

export default AccountPage;
