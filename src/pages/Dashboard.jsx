import { useEffect, useState } from "react";
import CustomModal from "../components/CustomModal";
import { getAllLoanDetails, getUserLoan } from "../services/api";
import AddLoan from "./AddLoan";
import LoanCard from "../components/Loan/LoanCard";
import { useAuth } from "../contex/Contex";
import { Link, useNavigate } from "react-router";
import VantaBirds from "../components/VantaBirds";

const Dashboard = () => {
  const [data, setData] = useState([]);
  console.log("🚀 ~ Dashboard ~ data:", data);
  //cust modal
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  //cust modal

  const { user, signOut } = useAuth();
  const navigatin = useNavigate();

  async function expire() {
    await signOut();
    navigatin("/");
  }

  useEffect(() => {
    if (!user) return;
    async function test() {
      // const data = await getAllLoanDetails();
      console.log("🚀 ~ test ~ user.id:", user.id);
      const data = await getUserLoan(user.id);

      if (data === "JWT expired") {
        expire();
        console.log("🚀 ~ test ~ data:", data);
      } else {
        setData(data);
      }
    }
    test();
  }, [user]);

  useEffect(() => {});
  return (
    <>
      {/* <div className="home-bg"></div> */}
      {!user ? (
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

          <Link className="btn btn-primary" to="/login">
            Track Emi
          </Link>
          <VantaBirds />
        </div>
      ) : (
        <>
          <div className="loan-card-wrapper">
            {data?.map((item) => {
              const targetDate = new Date(item.emi_date);
              const tenure = item.tenure_months;

              function getEmiCount(startDate, today = new Date()) {
                let years = today.getFullYear() - startDate.getFullYear();
                let months = today.getMonth() - startDate.getMonth();
                let totalMonths = years * 12 + months;

                if (today.getDate() < startDate.getDate()) {
                  totalMonths -= 1;
                }

                return tenure - (totalMonths + 1);
              }

              const remaningEmi = getEmiCount(targetDate);

              return (
                <LoanCard item={item} key={item.id} remaningEmi={remaningEmi} />
              );
            })}
          </div>
          <CustomModal
            open={open}
            setOpen={setOpen}
            onOpenModal={onOpenModal}
            onCloseModal={onCloseModal}
          >
            <AddLoan />
          </CustomModal>

          <button className="add-new-loan" onClick={() => onOpenModal()}>
            +
          </button>
        </>
      )}
    </>
  );
};

export default Dashboard;
