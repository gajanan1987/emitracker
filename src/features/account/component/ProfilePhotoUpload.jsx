import { useState } from "react";

const MAX_SIZE_MB = 1;

const ProfilePhotoUpload = () => {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > MAX_SIZE_MB) {
      return alert(`File too large! Max ${MAX_SIZE_MB} MB.`);
    }

    setPreview(URL.createObjectURL(file));
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
