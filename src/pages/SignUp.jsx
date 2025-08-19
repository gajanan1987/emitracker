import React, { useActionState } from "react";
import "./../style/signupPage.scss";
import { useAuth } from "../contex/Contex";

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
        <h2>Create Account</h2>

        <input type="email" name="email" placeholder="Email" required />

        <input
          type="password"
          name="password"
          placeholder="Password (min 6 characters)"
          required
        />

        <button disabled={isPending} type="submit">
          {isPending ? "Loading...." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
