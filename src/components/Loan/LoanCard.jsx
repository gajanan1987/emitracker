import { useNavigate } from "react-router";

const LoanCard = ({ item }) => {
  const { loan_name, emi_amount, tenure_months, id } = item;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/loandetails", { state: { loanId: id } });
  };
  return (
    <div className="loan-card" onClick={handleClick}>
      <p>Loan Name : {loan_name}</p>
      <p>Loan EMI : ₹{emi_amount}</p>
      <p>Total Tenur : {tenure_months} Months</p>
    </div>
  );
};

export default LoanCard;
