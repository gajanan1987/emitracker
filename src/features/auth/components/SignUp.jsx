import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { addProfile, signUp } from "../../../redux/authSlice";
import custMessage from "../../../utils/toast";
import Input from "../../../components/Input";

const SignUp = ({ setMode }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
  });
  const [previewUrl, setPreviewUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);

  const { status, error, user } = useSelector((s) => s.auth);

  const isInvalid =
    !formData.email ||
    !formData.password ||
    formData.password !== formData.confirmPassword ||
    formData.password.length < 6;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // show preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isInvalid) return;

    const { fname, lname, address, email, password } = formData;

    try {
      const { user } = await dispatch(signUp({ email, password })).unwrap();

      if (user.id) {
        const data = {
          userId: user?.id || "",
          fname: fname || "",
          lname: lname || "",
          address: address || "",
        };
        await dispatch(addProfile({ ...data, avatarFile })).unwrap();
      }

      custMessage.info("Signup successful. Verify your email, then login");
      setMode("login");
    } catch (err) {
      custMessage.error(err.message || "Signup failed");
    }
  };
  return (
    <>
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Sign Up</h1>

        <Input
          type="text"
          name="fname"
          label="Enter First Name"
          value={formData.fname}
          onChange={handleChange}
          placeholder="First Name"
          required
        />

        <Input
          type="text"
          name="lname"
          label="Enter Last Name"
          value={formData.lname}
          onChange={handleChange}
          placeholder="Last Name"
          required
        />

        <Input
          type="email"
          name="email"
          label="Enter Email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />

        <Input
          type="password"
          name="password"
          label="Enter Password (min 6 char)"
          value={formData.password}
          onChange={handleChange}
          placeholder="password"
          required
        />

        <Input
          type="password"
          name="confirmPassword"
          label="Enter confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="confirm Password"
          required
        />

        <Input
          type="text"
          name="address"
          label="Enter Address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          required
        />

        <div className="file-wrapper input-wrapper">
          <label>Upload Profile Photo</label>
          {previewUrl && <img src={previewUrl} alt="Avatar" width={100} />}
          <input type="file" accept="image/*" onChange={handleFile} />
        </div>

        <button
          className="btn btn-primary"
          disabled={status === "loading" || isInvalid}
          type="submit"
        >
          {status === "loading" ? "Signing Up..." : "Sign Up"}
        </button>

        <p className="no-account">
          Already have an account?
          <Link
            onClick={() => setMode("login")}
            style={{ textDecoration: "underline" }}
          >
            {" "}
            Sing In
          </Link>
        </p>
      </form>
    </>
  );
};

export default SignUp;
