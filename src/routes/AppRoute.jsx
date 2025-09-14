import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router";
import ProtectedRotes from "./ProtectedRotes";

const Home = lazy(() => import("../features/home/Home"));
const AuthPage = lazy(() => import("../features/auth/AuthPage"));
const LoanCalculator = lazy(() =>
  import("../features/calculator/LoanCalculator")
);
const LoansList = lazy(() => import("../features/loans/LoansList"));
const AccountPage = lazy(() => import("../features/Account"));
const OutstandingPage = lazy(() =>
  import("../features/outstanding/OutstandingPage")
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
          <Route path="/account" element={<AccountPage />} />
          <Route path="/outstanding" element={<OutstandingPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
