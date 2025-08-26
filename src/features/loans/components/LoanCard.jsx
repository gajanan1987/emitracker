import { useNavigate } from "react-router";
import { formatINR } from "../../../utils/number";

const LoanCard = ({ item, remaningEmi, deleteLoanById, getLoanDetails }) => {
  const { loan_name, emi_amount, tenure_months, id } = item;
  const navigate = useNavigate();

  const handleClick = () => {
    getLoanDetails(id);
    // navigate("/loandetails", { state: { loanId: id } });
  };

  const handleDelete = (e) => {
    deleteLoanById(id, loan_name);
    e.stopPropagation();
  };
  return (
    <div className="loan-card" onClick={handleClick}>
      <div className="left">
        <p className="loan-name" style={{ marginBottom: "3px" }}>
          {loan_name}
        </p>
        <p className="f14">
          EMI: <span className="font-bold">{formatINR(emi_amount, true)}</span>
        </p>
        <p className="f14 color-gray">
          <span className="font-bold">{remaningEmi}</span> months left
        </p>
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
