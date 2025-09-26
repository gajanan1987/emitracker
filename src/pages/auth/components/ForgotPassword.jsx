import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { forgotPassword } from "../../../redux/authSlice";
import custMessage from "../../../utils/toast";
import Input from "../../../components/Input";

const ForgotPassword = ({ setMode }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
  });

  const { status, error, user } = useSelector((s) => s.auth);

  const isInvalid = !formData.email;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email } = formData;
    if (!email) {
      custMessage.warning("Please enter email");
      return;
    }

    if (isInvalid) return;

    dispatch(forgotPassword({ email }))
      .unwrap()
      .then(() => {
        custMessage.success(
          "Password reset email sent. Check your inbox and follow the link."
        );
        setMode("login");
      })
      .catch((err) =>
        custMessage.error(err.message || "Password reset failed")
      );
  };
  return (
    <>
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Forgot Password</h1>

        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />

        <button
          className="btn btn-primary"
          disabled={status === "loading"}
          type="submit"
        >
          {status === "loading" ? "Loading..." : "Send Reset Email"}
        </button>

        <p className="no-account">
          Back to{" "}
          <Link
            onClick={() => setMode("login")}
            style={{ textDecoration: "underline" }}
          >
            Sign In
          </Link>
        </p>
      </form>
    </>
  );
};

export default ForgotPassword;
