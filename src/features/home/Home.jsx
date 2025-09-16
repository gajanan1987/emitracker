import { useEffect } from "react";
import { Navigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchLoans, selectLoanItems } from "../../redux/loanSlice";
import { useAuth } from "../../hooks/useAuth";
import HomeTable from "./component/HomeTable";
import Banner from "./component/Banner";
import { getProfile } from "../../redux/authSlice";

const Home = () => {
  const dispatch = useDispatch();
  const { session, loading } = useAuth();
  const { user } = useSelector((s) => s.auth);
  const { status } = useSelector((s) => s.loans);
  const loanData = useSelector(selectLoanItems); // ✅ Get both activeLoans + summary

  useEffect(() => {
    if (user && status === "idle") {
      dispatch(fetchLoans());
    }
  }, [dispatch, user, status]);

  useEffect(() => {
    if (user) {
      dispatch(getProfile());
    }
  }, [dispatch, user]);

  if (loading) return <p className="loading">Loading...</p>;
  if (!user) return <Navigate to="/login" />;

  return (
    <>
      <Banner session={session} user={user} />

      {user && (
        <>
          {status === "loading" && <p>Loading loans...</p>}
          {status === "succeeded" && (
            <HomeTable
              activeLoans={loanData.activeLoans}
              summaryData={{
                totalLoanAmount: loanData.totalLoanAmount,
                totalEmi: loanData.totalEmi,
                paidMonth: loanData.paidMonth,
                remaningMonth: loanData.remaningMonth,
              }}
            />
          )}
        </>
      )}
    </>
  );
};

export default Home;
