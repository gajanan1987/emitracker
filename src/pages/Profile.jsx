import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../style/account.scss";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      // const { data, error } = await supabase.auth.getUser();
      // if (data?.user) {
      //   setUser(data.user);
      // } else {
      //   navigate("/login");
      // }
    };

    getUser();
  }, [navigate]);

  const handleLogout = async () => {
    navigate("/login");
  };

  return (
    <div className="account-container">
      <div className="account-card">
        <h2>My Account</h2>
        {user ? (
          <>
            <p>
              <strong>Email:</strong> {user.email}
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

export default Profile;
