import supabase from "../services/supabase";

/**
 * Upload avatar file and (optionally) delete the old one
 */
export async function uploadAvatar(userId, file, oldPath = null) {
  const bucket = "emi";
  const folder = "avatars";

  try {
    // 1. Delete old avatar if exists
    if (oldPath) {
      const { error: removeError } = await supabase.storage
        .from(bucket)
        .remove([oldPath]);
      if (removeError) {
        console.warn("⚠️ Could not remove old avatar:", removeError.message);
      }
    }

    // 2. Generate unique file name
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // 3. Upload new file
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    // 4. Get public URL
    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return { avatar_url: data.publicUrl, avatar_path: filePath };
  } catch (err) {
    console.error("❌ Upload avatar failed:", err);
    throw err;
  }
}
