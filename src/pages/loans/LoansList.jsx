import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
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
  const navigate = useNavigate();

  const [loanData, setLoanData] = useState(null);
  const [loanEditData, setLoanEditData] = useState(null);

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const {
    items,
    currentSchedule,
    emiSummary,
    status: loanStatus,
  } = useSelector((s) => s.loans);

  // Expire session if fetch fails
  const expire = useCallback(() => {
    dispatch(signOut());
    navigate("/");
  }, [dispatch, navigate]);

  // Fetch loans on mount
  useEffect(() => {
    if (!items.length) dispatch(fetchLoans());
  }, [dispatch, items.length]);

  // Handle failed fetch
  useEffect(() => {
    if (loanStatus === "failed") expire();
  }, [loanStatus, expire]);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => {
    setOpen(false);
    dispatch(removeSummery());
  };

  const onEditOpenModal = () => setEditOpen(true);
  const onEditCloseModal = () => {
    setEditOpen(false);
    dispatch(removeSummery());
  };

  // Delete Loan
  const deleteLoanById = useCallback(
    (id, lname) => {
      dispatch(deleteLoan(id))
        .unwrap()
        .then(() => {
          custMessage.success(`${lname} Loan deleted successfully`);
        })
        .catch((err) => {
          custMessage.error(err.message || "Failed to delete loan");
        });
    },
    [dispatch]
  );

  // Loan Details (view/edit)
  const getLoanDetails = useCallback(
    async (id, type) => {
      try {
        const fetchLoan = await dispatch(loanDetails(id)).unwrap();
        if (type === "click") {
          setLoanData(fetchLoan);
        } else {
          setLoanEditData(fetchLoan);
          onEditOpenModal();
        }
      } catch (err) {
        custMessage.error("Unable to fetch loan details");
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (!loanData) return;
    dispatch(computeScheduleFor({ data: loanData, type: "loanDetails" }));
  }, [loanData, dispatch]);

  // Render loan list
  const renderLoans = () => {
    if (loanStatus === "loading") return <>Loading...</>;
    if (loanStatus === "failed")
      return <h1>Error loading loans. Please try again.</h1>;
    if (items?.length > 0) {
      return items.map((item) => (
        <LoanCard
          key={item.id}
          item={item}
          remaningEmi={item.remaningEmi}
          deleteLoanById={deleteLoanById}
          getLoanDetails={getLoanDetails}
        />
      ));
    }
    return (
      <h1>
        No Loans available.{" "}
        <button className="btn btn-primary" onClick={onOpenModal}>
          Add Loan
        </button>
      </h1>
    );
  };

  return (
    <>
      {currentSchedule ? (
        <LoanDetails />
      ) : (
        <>
          <div className="loan-card-wrapper">{renderLoans()}</div>

          {/* Add Loan Modal */}
          <CustomModal open={open} onCloseModal={onCloseModal}>
            <AddLoan emiSummary={emiSummary} onCloseModal={onCloseModal} />
          </CustomModal>

          <button className="add-new-loan" onClick={onOpenModal}>
            +
          </button>

          {/* Edit Loan Modal */}
          <CustomModal open={editOpen} onCloseModal={onEditCloseModal}>
            <EditLoan
              loanEditData={loanEditData}
              onCloseModal={onEditCloseModal}
            />
          </CustomModal>
        </>
      )}
    </>
  );
};

export default LoansList;
