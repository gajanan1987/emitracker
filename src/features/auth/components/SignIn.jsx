import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { signIn } from "../../../redux/authSlice";
import custMessage from "../../../utils/toast";
import Input from "../../../components/Input";

const SignIn = ({ setMode }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { status, error, user } = useSelector((s) => s.auth);

  const isInvalid = !formData.email || !formData.password;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = formData;
    if (!email && !password) {
      custMessage.warning("Please enter email and password");
      return;
    }
    if (!email) {
      custMessage.warning("Please enter email");
      return;
    }
    if (!password) {
      custMessage.warning("Please enter password");
      return;
    }

    if (isInvalid) return;

    dispatch(signIn({ email, password }))
      .unwrap()
      .then(() => custMessage.success("Login successfully"))
      .catch((err) => custMessage.error(err.message || "Login failed"));
  };
  return (
    <>
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Sign In</h1>

        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />

        <Input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="password"
          required
        />

        <button
          className="btn btn-primary"
          disabled={status === "loading"}
          type="submit"
        >
          {status === "loading" ? "Signing In..." : "Sign In"}
        </button>

        <p className="forgot">
          <Link onClick={() => setMode("forgot")}>Forgot Password ?</Link>
        </p>

        <p className="no-account">
          Don't have an account?{" "}
          <Link
            onClick={() => setMode("signup")}
            style={{ textDecoration: "underline" }}
          >
            Sign Up
          </Link>
        </p>
      </form>
    </>
  );
};

export default SignIn;
