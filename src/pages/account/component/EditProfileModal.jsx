import { useState } from "react";
import Input from "../../../components/Input";
import { useDispatch } from "react-redux";
import { addProfile, updateProfile } from "../../../redux/authSlice";
import custMessage from "../../../utils/toast";
import ProfilePhotoUpload from "./ProfilePhotoUpload";

const EditProfileModal = ({
  onCloseModal,
  user,
  fname,
  lname,
  address,
  avatar,
}) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    userId: user?.id || "",
    fname: fname || "",
    lname: lname || "",
    address: address || "",
  });

  const [avatarFile, setAvatarFile] = useState(null); // only File object
  const [previewUrl, setPreviewUrl] = useState(avatar || ""); // preview image URL

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.userId) return;

    dispatch(updateProfile({ ...formData, avatarFile }))
      .unwrap()
      .then(() => {
        custMessage.success("Profile updated!");
        setAvatarFile(null);
        onCloseModal();
      })
      .catch((err) => {
        custMessage.error(err || "Something went wrong");
      });
  };

  return (
    <div className="edit-profile-modal">
      <h2>Edit Profile</h2>

      <div className="form">
        <Input
          type="text"
          label="Enter First Name"
          name="fname"
          value={formData.fname}
          onChange={handleChange}
          placeholder="First Name"
          required
        />

        <Input
          type="text"
          label="Enter Last Name"
          name="lname"
          value={formData.lname}
          onChange={handleChange}
          placeholder="Last Name"
          required
        />

        <Input
          type="text"
          label="Enter Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          required
        />

        <div className="file-wrapper input-wrapper">
          <label>Profile Photo</label>
          {previewUrl && <img src={previewUrl} alt="Avatar" width={100} />}
          <input type="file" accept="image/*" onChange={handleFile} />
        </div>

        <div className="btn-wrapper">
          <button className="btn btn-primary" onClick={handleSubmit}>
            Save
          </button>
          <button className="btn btn-primary-hallow" onClick={handleSubmit}>
            Cancle
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
