import { useEffect, useState } from "react";
import "./../../style/authpage.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import VantaBirds from "../../components/VantaBirds";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import ForgotPassword from "./components/ForgotPassword";

const AuthPage = () => {
  const [mode, setMode] = useState("login"); // login | signup | forgot
  const { status, error, user } = useSelector((s) => s.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && mode === "login") {
      navigate("/", { replace: true });
    }
  }, [status, user, mode, navigate]);

  return (
    <>
      <div className="login-container">
        {mode === "login" ? (
          <SignIn setMode={setMode} />
        ) : mode === "signup" ? (
          <SignUp setMode={setMode} />
        ) : (
          <ForgotPassword setMode={setMode} />
        )}
      </div>
      <VantaBirds />
    </>
  );
};

export default AuthPage;
