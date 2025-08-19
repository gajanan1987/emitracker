import { useState, useEffect } from "react";
import { useAuth } from "../contex/Contex";
import { useNavigate } from "react-router";
import { getAllLoanDetails } from "../services/api";

const Account = () => {
  const [loginUser, setUser] = useState(null);

  const navigatin = useNavigate();

  const { signOut, user } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigatin("/");
  };

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user]);

  // useEffect(() => {
  //   async function test() {
  //     const data = await getAllLoanDetails();
  //     console.log("🚀 ~ Account ~ data:", data);
  //   }
  //   test();
  // }, [user]);
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

export default Account;
