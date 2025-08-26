import { BrowserRouter, Routes, Route } from "react-router";
import ProtectedRotes from "./ProtectedRotes";
import AuthPage from "../features/auth/AuthPage";
import LoansList from "../features/loans/LoansList";
import Home from "../features/Home";
import AccountPage from "../features/Account";
import LoanCalculator from "../features/LoanCalculator";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/loancalculator" element={<LoanCalculator />} />
      <Route element={<ProtectedRotes />}>
        <Route path="/loans-list" element={<LoansList />} />
        <Route path="/account" element={<AccountPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
