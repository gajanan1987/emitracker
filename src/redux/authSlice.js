import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../services/supabase";
import { uploadAvatar } from "../utils/uploadAvatar";

export const signUp = createAsyncThunk(
  "auth/signUp",
  async ({ email, password }, { rejectWithValue }) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    console.log("🚀 ~ datasdsad:", data);
    if (error) return rejectWithValue(error.message);
    return {
      user: data.user,
    };
  }
);

export const signIn = createAsyncThunk(
  "auth/signIn",
  async ({ email, password }, { rejectWithValue }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log("🚀 ~ data:", data);
    if (error) return rejectWithValue(error.message);
    return data;
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ({ email }, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`, // page user goes after reset link
      });

      if (error) throw error;
      return { email };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async ({ email, password }, { rejectWithValue }) => {
    const { data, error } = await supabase.auth.updateUser({
      email,
      password,
    });

    if (error) return rejectWithValue(error.message);
    return { data };
  }
);

export const signOut = createAsyncThunk("auth/signOut", async () => {
  await supabase.auth.signOut();
  return null;
});

export const fetchSession = createAsyncThunk("auth/fetchSession", async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session?.user ?? null;
});

export const uploadAndReplaceAvatar = createAsyncThunk(
  "auth/uploadAndReplaceAvatar",
  async (
    { file, userId, bucket = "emi", folder = "avatars" },
    { getState, rejectWithValue }
  ) => {
    try {
      if (!file) return rejectWithValue("No file provided");

      // 0. Check bucket exists (optional) - you can skip this in production
      // 1. Get current avatar_path from redux state (if any)
      const state = getState();
      const currentPath = state?.auth?.user?.user_metadata?.avatar_path || null;

      // 2. If a previous file path exists, try to delete it (ignore not found)
      if (currentPath) {
        try {
          const { error: removeError } = await supabase.storage
            .from(bucket)
            .remove([currentPath]);
          if (removeError) {
            // If file not found, continue; otherwise throw
            // Supabase error messages differ; log for debugging
            console.warn(
              "Warning removing old avatar:",
              removeError.message || removeError
            );
          }
        } catch (rmErr) {
          console.warn("Remove call threw (ignored):", rmErr);
          // continue anyway
        }
      }

      // 3. Build new filename (timestamped or fixed - here timestamped)
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      // 4. Upload new file (use upsert:true to allow overwrite if same path used)
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error("Upload error from Supabase:", uploadError);
        throw uploadError;
      }

      // 5. Get public URL (for public bucket)
      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      const publicUrl = data?.publicUrl;

      // 6. Update user metadata with new avatar_url and avatar_path
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl, avatar_path: filePath },
      });

      if (updateError) {
        console.error("Error updating user metadata:", updateError);
        throw updateError;
      }

      // 7. Return both url and path
      return { avatar_url: publicUrl, avatar_path: filePath };
    } catch (err) {
      // return a readable error for the UI
      return rejectWithValue(err?.message || err);
    }
  }
);

////
export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue, getState }) => {
    const {
      auth: { user },
    } = getState();
    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .eq("user_id", user.id);

    console.log("🚀 ~ data:", data);

    if (error) return rejectWithValue(error.message);
    return data;
  }
);

export const addProfile = createAsyncThunk(
  "auth/addProfile",
  async (
    { userId, fname, lname, address, avatarFile },
    { rejectWithValue }
  ) => {
    try {
      let avatarData = { avatar_url: null, avatar_path: null };

      if (avatarFile) {
        avatarData = await uploadAvatar(userId, avatarFile);
      }

      const { data, error } = await supabase
        .from("profile")
        .insert([
          {
            user_id: userId,
            fname,
            lname,
            address,
            ...avatarData,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      return rejectWithValue(err.message || err);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (
    { userId, fname, lname, address, avatarFile },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState();
      const currentProfile = state.auth.profile?.[0] || {};

      let avatarData = {
        avatar_url: currentProfile.avatar_url || null,
        avatar_path: currentProfile.avatar_path || null,
      };

      if (avatarFile) {
        avatarData = await uploadAvatar(
          userId,
          avatarFile,
          currentProfile.avatar_path || null
        );
      }

      const { data, error } = await supabase
        .from("profile")
        .update({
          fname,
          lname,
          address,
          ...avatarData,
        })
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      return rejectWithValue(err.message || err);
    }
  }
);

const initialState = {
  user: null,
  status: "idle",
  profileStatus: "idle",
  error: null,
  profile: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSession.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchSession.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchSession.rejected, (state, action) => {
        state.status = "failed";
      })

      ////
      .addCase(signUp.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(signUp.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      ////
      .addCase(signIn.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      ////
      .addCase(signOut.fulfilled, () => initialState)

      ////
      .addCase(forgotPassword.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      //// Get Profile
      .addCase(getProfile.pending, (state) => {
        state.profileStatus = "loading";
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.profileStatus = "succeeded";
        state.profile = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.profileStatus = "failed";
        state.error = action.payload;
      })

      /// Add Profile
      // .addCase(addProfile.fulfilled, (state, action) => {
      //   state.profile = [action.payload];
      // })

      /// Update Profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile = [action.payload];
      })

      ///
      .addCase(uploadAndReplaceAvatar.fulfilled, (state, action) => {
        if (state.user) {
          state.user.user_metadata.avatar_url = action.payload.avatar_url;
          state.user.user_metadata.avatar_path = action.payload.avatar_path;
        }
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
