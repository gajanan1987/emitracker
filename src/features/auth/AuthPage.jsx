import { useActionState, useEffect, useState } from "react";
import "./../../style/loginpage.scss";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSession, signIn, signUp } from "../../redux/authSlice";
import VantaBirds from "../../components/VantaBirds";

const AuthPage = () => {
  const [mode, setMode] = useState("login");
  const { status, error, user } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch session only once (root App usually handles this)
  useEffect(() => {
    if (!user) {
      dispatch(fetchSession());
    }
  }, [dispatch]);

  // Redirect only after successful login
  useEffect(() => {
    if (user && mode === "login") {
      navigate("/loans-list", { replace: true });
    }
  }, [status, user, mode, navigate]);

  const [state, formAction, isPending] = useActionState(loginForm, {
    data: null,
    error: null,
  });

  async function loginForm(prevState, formData) {
    const email = formData.get("name");
    const password = formData.get("password");

    if (!email || !password) return;

    if (mode === "login") {
      dispatch(signIn({ email, password }));
    } else {
      dispatch(signUp({ email, password }));
      alert("Signup initiated. Verify email, then login.");
      setMode("login");
    }
  }

  const handleChange = () => {
    setMode(mode === "login" ? "signup" : "login");
  };

  return (
    <>
      <div className="login-container">
        <form className="login-form" action={formAction}>
          <h1>{mode === "login" ? "Sign In" : "Sign Up"}</h1>

          <div className="input-wrapper">
            <input type="email" name="name" placeholder="Email" required />
          </div>

          <div className="input-wrapper">
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
            />
          </div>

          <button
            className="btn btn-primary"
            disabled={isPending || status === "loading"}
            type="submit"
          >
            {mode === "login"
              ? status === "loading"
                ? "Signing In..."
                : "Sign In"
              : "Sign Up"}
          </button>

          <p className="no-account">
            {mode === "login"
              ? "Don't have an account? "
              : "Already have an account? "}
            <Link
              style={{ textDecoration: "underline" }}
              onClick={handleChange}
            >
              {mode === "login" ? "Sign Up" : "Sign In"}
            </Link>
          </p>

          {error && (
            <p className="message">
              {error.message || "Sign In failed, please try again."}
            </p>
          )}
        </form>
      </div>
      <VantaBirds />
    </>
  );
};

export default AuthPage;
