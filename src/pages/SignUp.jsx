import React, { useActionState } from "react";
import "./../style/signupPage.scss";
import { useAuth } from "../contex/Contex";
import { Link } from "react-router";

const SignupPage = () => {
  const [state, formAction, isPending] = useActionState(signupForm, {
    data: null,
    error: null,
  });

  const { signUpWithEmail } = useAuth();

  async function signupForm(prevState, formData) {
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) return;

    try {
      await signUpWithEmail(email, password);
    } catch (error) {
      return { error: error };
    }
  }

  return (
    <div className="signup-container">
      <form className="signup-form" action={formAction}>
        <h1>Create Account</h1>

        <div className="input-wrapper">
          <input type="email" name="email" placeholder="Email" required />
        </div>
        <div className="input-wrapper">
          <input
            type="password"
            name="password"
            placeholder="Password (min 6 characters)"
            required
          />
        </div>

        <button className="color-primary" disabled={isPending} type="submit">
          {isPending ? "Loading...." : "Sign Up"}
        </button>

        <p className="no-account">
          Already have an account?{" "}
          <Link to="/login" style={{ textDecoration: "underline" }}>
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
