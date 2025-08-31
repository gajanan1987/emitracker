import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../../redux/authSlice";
import {
  computeScheduleFor,
  deleteLoan,
  fetchLoans,
  loanDetails,
  removeSummery,
} from "../../redux/loanSlice";
import { pendingEmi } from "../../utils/pendingEmi";
import CustomModal from "../../components/CustomModal";
import AddLoan from "./components/AddLoan";
import LoanCard from "./components/LoanCard";
import LoanDetails from "./components/LoanDetails";
import custMessage from "../../utils/toast";

const LoansList = () => {
  const [loanData, setLoanData] = useState();
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const dispatch = useDispatch();
  const navigatin = useNavigate();

  const {
    items,
    currentSchedule,
    emiSummary,
    status: loanStatus,
  } = useSelector((s) => s.loans);

  const { status, error, user } = useSelector((s) => s.auth);

  const onCloseModal = () => {
    setOpen(false);
    dispatch(removeSummery());
  };
  //cust modal

  async function expire() {
    dispatch(signOut());
    navigatin("/");
  }

  useEffect(() => {
    dispatch(fetchLoans());
  }, []);

  useEffect(() => {
    if (loanStatus === "failed") {
      expire();
    }
  }, [items]);

  const deleteLoanById = (id, lname) => {
    dispatch(deleteLoan(id))
      .unwrap()
      .then((data) => {
        custMessage.success(`${lname} Loan Deleted successfully`);
      })
      .catch((err) => {});
  };

  const getLoanDetails = async (id) => {
    const fetchLoan = await dispatch(loanDetails(id)).unwrap();
    setLoanData(fetchLoan);
  };

  useEffect(() => {
    if (!loanData) return;
    dispatch(computeScheduleFor({ data: loanData, type: "loanDetails" }));
  }, [loanData]);

  return (
    <>
      {currentSchedule ? (
        <LoanDetails />
      ) : (
        <>
          {items === "JWT expired"}
          <div className="loan-card-wrapper">
            {items?.map((item) => {
              const targetDate = new Date(item.emi_date);
              const tenure = item.tenure_months;
              const remaningEmi = pendingEmi(targetDate, tenure);
              return (
                <LoanCard
                  item={item}
                  key={item.id}
                  remaningEmi={remaningEmi}
                  deleteLoanById={deleteLoanById}
                  getLoanDetails={getLoanDetails}
                />
              );
            })}
          </div>
          <CustomModal
            open={open}
            setOpen={setOpen}
            onOpenModal={onOpenModal}
            onCloseModal={onCloseModal}
          >
            <AddLoan emiSummary={emiSummary} onCloseModal={onCloseModal} />
          </CustomModal>

          <button className="add-new-loan" onClick={() => onOpenModal()}>
            +
          </button>
        </>
      )}
    </>
  );
};

export default LoansList;
