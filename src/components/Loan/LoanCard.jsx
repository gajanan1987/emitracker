import { useNavigate } from "react-router";

const LoanCard = ({ item, remaningEmi }) => {
  const { loan_name, emi_amount, tenure_months, id } = item;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/loandetails", { state: { loanId: id } });
  };
  return (
    <div className="loan-card" onClick={handleClick}>
      <p className="font-bold">{loan_name}</p>
      <p className="f14">EMI : ₹{emi_amount}</p>
      {/* <p>Total Tenur : {tenure_months} Months</p> */}
      <p className="f14">{remaningEmi} months left</p>
    </div>
  );
};

export default LoanCard;
