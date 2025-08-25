import { configureStore } from "@reduxjs/toolkit";
import loanSlice from "./loanSlice";
import authSlice from "./authSlice";

export const store = configureStore({
  reducer: {
    loans: loanSlice,
    auth: authSlice,
  },
});
