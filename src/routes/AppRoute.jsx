import { BrowserRouter, Routes, Route } from "react-router";
import LoginPage from "../pages/Login";
import SignupPage from "../pages/SignUp";
import Dashboard from "../pages/Dashboard";
import Account from "../pages/Account";
import ProtectedRotes from "./ProtectedRotes";
import LoanCalculator from "../pages/LoanCalculator";
import LoanDetails from "../pages/LoanDetails";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/loancalculator" element={<LoanCalculator />} />
      <Route element={<ProtectedRotes />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/account" element={<Account />} />
        <Route path="/loandetails" element={<LoanDetails />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
