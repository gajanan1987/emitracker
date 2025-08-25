import { useNavigate } from "react-router";

const LoanCard = ({ item, remaningEmi, deleteLoanById, getLoanDetails }) => {
  const { loan_name, emi_amount, tenure_months, id } = item;
  const navigate = useNavigate();

  const handleClick = () => {
    getLoanDetails(id);
    // navigate("/loandetails", { state: { loanId: id } });
  };

  const handleDelete = (e) => {
    deleteLoanById(id);
    e.stopPropagation();
  };
  return (
    <div className="loan-card" onClick={handleClick}>
      <div className="left">
        <p className="font-bold">{loan_name}</p>
        <p className="f14">EMI : ₹{emi_amount}</p>
        <p className="f14">{remaningEmi} months left</p>
      </div>
      <div className="right">
        <button className="btn btn-danger" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default LoanCard;
