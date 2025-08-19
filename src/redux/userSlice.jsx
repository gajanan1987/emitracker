import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: [
    {
      name: "gaju",
    },
  ],
};

const usersSlice = createSlice({
  name: "user",
  initialState,
});

// const {} = users.actions;

export default usersSlice.reducer;
