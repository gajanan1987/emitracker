import { useActionState } from "react";
import "./../style/loginpage.scss";
import { useNavigate } from "react-router";
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
      <form className="login-form" action={formAction}>
        <h2>Login</h2>
        <input type="email" name="name" placeholder="Email" required />

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
        />

        <button disabled={isPending} type="submit">
          {isPending ? "Loging...." : "Login"}
        </button>

        {state?.error && (
          <p className="message">
            {state.error.message || "Login failed, please try again."}
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPage;
