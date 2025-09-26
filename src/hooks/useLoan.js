import { useDispatch, useSelector } from "react-redux";
import {
  fetchLoans,
  deleteLoan,
  loanDetails,
  computeScheduleFor,
  removeSummery,
  createLoan,
  editLoan,
} from "../redux/loanSlice";
import { useEffect } from "react";

const useLoan = () => {
  const dispatch = useDispatch();
  const { items, status, error, currentSchedule, emiSummary } = useSelector(
    (s) => s.loans
  );
  const { user } = useSelector((s) => s.auth);

  // ✅ Load loans initially
  useEffect(() => {
    if (!user) return;
    if (user && status === "idle") {
      dispatch(fetchLoans());
    }
  }, [dispatch, user, status]);

  const getLoanDetails = (id) => dispatch(loanDetails(id));
  const deleteLoanById = (id) => dispatch(deleteLoan(id));
  const calculateEmi = (data, type = "addLoan") =>
    dispatch(computeScheduleFor({ data, type }));
  const resetSummary = () => dispatch(removeSummery());
  const saveLoan = (loan, remaining) =>
    dispatch(createLoan({ loan, remaining }));
  const updateLoan = (loan, remaining, loanId) =>
    dispatch(editLoan({ loan, remaining, loanId }));

  return {
    user,
    items,
    status,
    error,
    currentSchedule,
    emiSummary,

    deleteLoanById,
    saveLoan,
  };
};

export default useLoan;
