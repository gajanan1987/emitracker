import { useEffect, useState } from "react";
import AddNewLoan from "./AddNewLoan";
import CustomModal from "../components/CustomModal";
import { getAllLoanDetails, getUserLoan } from "../services/api";
import AddLoan from "./AddLoan";
import LoanCard from "../components/Loan/LoanCard";
import "./../style/Loan/loan-card.scss";
import { useAuth } from "../contex/Contex";

const Dashboard = () => {
  const [data, setData] = useState([]);
  console.log("🚀 ~ Dashboard ~ data:", data);
  //cust modal
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  //cust modal

  const { user } = useAuth();
  console.log("🚀 ~ Dashboard ~ user:", user);

  useEffect(() => {
    if (!user) return;
    async function test() {
      // const data = await getAllLoanDetails();
      const data = await getUserLoan(user.id);
      setData(data);
      // console.log("🚀 ~ Account ~ data:", data);
    }
    test();
  }, [user]);
  return (
    <div>
      <h1>Loan</h1>
      <div></div>
      <button onClick={() => onOpenModal()}>Add New Loan</button>
      <CustomModal
        open={open}
        setOpen={setOpen}
        onOpenModal={onOpenModal}
        onCloseModal={onCloseModal}
      >
        {/* <AddNewLoan /> */}
        <AddLoan />
      </CustomModal>

      <div className="loan-card-wrapper">
        {data?.map((item) => {
          return <LoanCard item={item} key={item.id} />;
        })}
      </div>
    </div>
  );
};

export default Dashboard;
