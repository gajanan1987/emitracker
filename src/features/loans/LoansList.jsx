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
    console.log("sadsad");
    dispatch(signOut());
    navigatin("/");
  }

  useEffect(() => {
    dispatch(removeSummery());
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
    // console.log("🚀 ~ getLoanDetails ~ fetchLoan:", fetchLoan);
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
          <div className="loan-card-wrapper">
            {items?.length > 0 ? (
              items?.map((item) => {
                return (
                  <LoanCard
                    item={item}
                    key={item.id}
                    remaningEmi={item.remaningEmi}
                    deleteLoanById={deleteLoanById}
                    getLoanDetails={getLoanDetails}
                  />
                );
              })
            ) : (
              <h1>
                No Loans pls....{" "}
                <button
                  className="btn btn-primary"
                  onClick={() => onOpenModal()}
                >
                  Add Loan
                </button>
              </h1>
            )}
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
