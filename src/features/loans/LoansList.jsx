import React, { useEffect, useState } from "react";
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
import EditLoan from "./components/EditLoan";

const LoansList = () => {
  const dispatch = useDispatch();
  const navigatin = useNavigate();
  const [loanData, setLoanData] = useState();
  const [loanEditData, setLoanEditData] = useState();

  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => {
    setOpen(false);
    dispatch(removeSummery());
  };

  //Modal Edit
  const [editOpen, setEditOpen] = useState(false);
  const onEditOpenModal = () => setEditOpen(true);

  const onEditCloseModal = () => {
    setEditOpen(false);
    dispatch(removeSummery());
  };

  const {
    items,
    currentSchedule,
    emiSummary,
    status: loanStatus,
  } = useSelector((s) => s.loans);
  console.log("🚀 ~ LoansList ~ items:", items);

  const { status, error, user } = useSelector((s) => s.auth);

  //cust modal

  async function expire() {
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

  const getLoanDetails = async (id, type) => {
    const fetchLoan = await dispatch(loanDetails(id)).unwrap();

    if (type === "click") {
      setLoanData(fetchLoan);
    } else {
      setLoanEditData(fetchLoan);
      onEditOpenModal();
    }
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
          <div>
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

            <CustomModal
              open={editOpen}
              setOpen={setEditOpen}
              onOpenModal={onEditOpenModal}
              onCloseModal={onEditCloseModal}
            >
              <EditLoan
                loanEditData={loanEditData}
                onCloseModal={onEditCloseModal}
              />
            </CustomModal>
          </div>
        </>
      )}
    </>
  );
};

export default LoansList;
