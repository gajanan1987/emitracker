import { useEffect, useState } from "react";
import CustomModal from "../components/CustomModal";
import { getAllLoanDetails, getUserLoan } from "../services/api";
import AddLoan from "./AddLoan";
import LoanCard from "../components/Loan/LoanCard";
import "./../style/Loan/addLoan.scss";
import { useAuth } from "../contex/Contex";
import { Link } from "react-router";

const Dashboard = () => {
  const [data, setData] = useState([]);
  //cust modal
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  //cust modal

  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    async function test() {
      // const data = await getAllLoanDetails();
      console.log("🚀 ~ test ~ user.id:", user.id);
      const data = await getUserLoan(user.id);
      console.log("🚀 ~ test ~ data:", data);
      setData(data);
    }
    test();
  }, [user]);
  return (
    <>
      <div className="home-bg"></div>
      <div className="home-banner">
        <h1 className="color-title">
          Simplifying Loan Management for Everyone
        </h1>

        <p>
          Managing loans doesn’t have to be complicated. Our platform makes it
          easy to:
        </p>
        <ul>
          <li>Track loan applications in real-time</li>
          <li>Automate EMI schedules and reminders</li>
          <li>Monitor payments and defaulters with accuracy</li>
          <li>Get insightful reports and dashboards</li>
        </ul>

        <CustomModal
          open={open}
          setOpen={setOpen}
          onOpenModal={onOpenModal}
          onCloseModal={onCloseModal}
        >
          <AddLoan />
        </CustomModal>

        <div className="loan-card-wrapper">
          {data?.map((item) => {
            return <LoanCard item={item} key={item.id} />;
          })}
        </div>
      </div>
      <button className="add-new-loan" onClick={() => onOpenModal()}>
        +
      </button>
    </>
  );
};

export default Dashboard;
