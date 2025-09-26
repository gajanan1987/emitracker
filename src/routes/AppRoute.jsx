import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router";
import ProtectedRotes from "./ProtectedRotes";

const Home = lazy(() => import("../pages/home/Home"));
const AuthPage = lazy(() => import("../pages/auth/AuthPage"));
const LoanCalculator = lazy(() => import("../pages/calculator/LoanCalculator"));
const LoansList = lazy(() => import("../pages/loans/LoansList"));
const AccountPage = lazy(() => import("../pages/account/Account"));
const ResetPassword = lazy(() =>
  import("../pages/auth/components/ResetPassword")
);
const OutstandingPage = lazy(() =>
  import("../pages/outstanding/OutstandingPage")
);

const AppRoutes = () => {
  return (
    <Suspense fallback="Loading.....">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/loancalculator" element={<LoanCalculator />} />
        <Route element={<ProtectedRotes />}>
          <Route path="/loans-list" element={<LoansList />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/outstanding" element={<OutstandingPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
