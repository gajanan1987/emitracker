import { formatINR } from "../../../utils/number";

const LoanCard = ({ item, remaningEmi, deleteLoanById, getLoanDetails }) => {
  const { loan_name, emi_amount, id } = item;
  const remEmi = remaningEmi === 0;

  const handleClick = () => {
    getLoanDetails(id, "click");
  };

  const handleDelete = (e) => {
    deleteLoanById(id, loan_name);
    e.stopPropagation();
  };
  const handleEdit = async (e) => {
    e.stopPropagation();
    getLoanDetails(id, "edit");
  };
  return (
    <div
      className={`loan-card ${remEmi ? "loan-done" : ""}`}
      onClick={handleClick}
    >
      <div className="left">
        <p className="loan-name" style={{ marginBottom: "3px" }}>
          {loan_name}
        </p>
        <p className="f14">
          EMI: <span className="font-bold">{formatINR(emi_amount, true)}</span>
        </p>

        <p className="f14 color-gray">
          {remEmi ? (
            <span className="font-bold">Loan fully paid 🎉</span>
          ) : (
            <>
              <span className="font-bold">{remaningEmi}</span> months left
            </>
          )}
        </p>
      </div>
      <div className="right">
        <button className="btn btn-danger" onClick={handleDelete}>
          Delete
        </button>
        {!remEmi && (
          <button className="btn btn-green" onClick={handleEdit}>
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default LoanCard;
