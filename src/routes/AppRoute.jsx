import { BrowserRouter, Routes, Route } from "react-router";
import Account from "../pages/Account";
import ProtectedRotes from "./ProtectedRotes";
import LoanCalculator from "../pages/LoanCalculator";
// import LoanDetails from "../pages/LoanDetails";
import AuthPage from "../features/auth/AuthPage";
import LoansList from "../features/loans/LoansList";
import Home from "../features/Home";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/loancalculator" element={<LoanCalculator />} />
      <Route element={<ProtectedRotes />}>
        <Route path="/loans-list" element={<LoansList />} />
        <Route path="/account" element={<Account />} />
        {/* <Route path="/loandetails" element={<LoanDetails />} /> */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
