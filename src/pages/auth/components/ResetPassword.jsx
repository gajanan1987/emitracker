import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../../redux/authSlice";
import Input from "../../../components/Input";
import { useState } from "react";
import custMessage from "../../../utils/toast";
import "../../../style/resetpwd-page.scss";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const {
    user: { email },
  } = useSelector((s) => s.auth);

  const [formData, setFormData] = useState({
    email,
    password: "",
    confirmPassword: "",
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResetPassword = () => {
    if (!formData.password || !formData.confirmPassword) {
      custMessage.warning("Please enter both password fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      custMessage.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setSaving(true);

    dispatch(updateUser({ email: formData.email, password: formData.password }))
      .unwrap()
      .then(() => {
        custMessage.success(
          "Password updated successfully. Please check mail."
        );
      })
      .catch((err) => {
        custMessage.error(err || "Password reset failed");
      })
      .finally(() => {
        setSaving(false);
      });
  };

  const isDisabled =
    !formData.password ||
    !formData.confirmPassword ||
    formData.password !== formData.confirmPassword ||
    formData.password.length < 6 ||
    saving;

  return (
    <div className="reset-container">
      <div className="reset-form">
        <h1>Reset Password</h1>

        <Input
          type="password"
          label="Enter new password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="password"
          required
        />

        <Input
          type="password"
          label="Confirm new password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="confirm password"
          required
        />

        <div className="btn-wrapper">
          <button
            className="btn btn-primary"
            onClick={handleResetPassword}
            disabled={isDisabled}
          >
            {saving ? "Saving..." : "Reset Password"}
          </button>
        </div>

        <p className="note">Password min 6 characters required</p>
      </div>
    </div>
  );
};

export default ResetPassword;
