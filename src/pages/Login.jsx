import { useActionState } from "react";
import "./../style/loginpage.scss";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../contex/Contex";

const LoginPage = () => {
  const { signIn } = useAuth();
  const navigation = useNavigate();

  const [state, formAction, isPending] = useActionState(loginForm, {
    data: null,
    error: null,
  });

  async function loginForm(prevState, formData) {
    const username = formData.get("name");
    const pwd = formData.get("password");

    if (!username || !pwd) return;

    try {
      const data = await signIn(username, pwd);
      if (data?.user) {
        navigation("/account");
        return { data };
      } else {
        return { error: { message: "Invalid email or password" } };
      }
    } catch (err) {
      return { error: { message: err.message || "Login failed" } };
    }
  }

  return (
    <div className="login-container">
      {/* <div className="animated-bg"></div> */}
      <form className="login-form" action={formAction}>
        <h1>Sign In</h1>
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

        <button className="color-primary" disabled={isPending} type="submit">
          {isPending ? "Signing...." : "Sign In"}
        </button>

        <p className="no-account">
          Don't have an account?{" "}
          <Link to="/signup" style={{ textDecoration: "underline" }}>
            Sign Up
          </Link>
        </p>

        {state?.error && (
          <p className="message">
            {state.error.message || "Sign In failed, please try again."}
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPage;
