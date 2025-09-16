import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadAndReplaceAvatar } from "../../redux/authSlice";
import custMessage from "../../utils/toast";

const MAX_SIZE_MB = 1;

const ProfilePhotoUpload = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileSizeMB = file.size / (1024 * 1024); // convert bytes → MB
    console.log("🚀 ~ handleFileChange ~ fileSizeMB:", fileSizeMB);
    if (fileSizeMB > MAX_SIZE_MB) {
      alert(
        `File too large! Please upload a photo smaller than ${MAX_SIZE_MB} MB.`
      );
      return;
    }

    setPreview(URL.createObjectURL(file));
    setLoading(true);

    dispatch(
      uploadAndReplaceAvatar({
        file,
        userId: user.id,
        bucket: "emi",
        folder: "avatars",
      })
    )
      .unwrap()
      .then((res) => {
        custMessage.success("Avatar uploaded");
        // Optionally update local UI/user state if not auto-updated by reducer
        console.log("Uploaded:", res);
      })
      .catch((err) => {
        custMessage.error(err || "Upload failed");
        console.error("Upload failed:", err);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="fileupload">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && <img src={preview} alt="preview" width={120} />}
      {loading && <p>Uploading...</p>}
    </div>
  );
};

export default ProfilePhotoUpload;
