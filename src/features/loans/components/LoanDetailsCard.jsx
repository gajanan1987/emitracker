import { formatINR } from "../../../utils/number";

const LoanDetailsCard = ({ item, index }) => {
  // console.log("🚀 ~ LoanDetailsCard ~ item:", item);
  return (
    <div
      className={new Date(item.date) <= new Date() ? "emi-done" : "emi-pending"}
    >
      <span className="emi-no">EMI {index + 1}</span>
      <p>{item.month}</p>
      <p>Emi: {formatINR(item.emi, true)}</p>
      <p>Principal: {formatINR(item.principal, true)}</p>
      <p>Interest: {formatINR(item.interest, true)}</p>
      <p>Rem. Principal: {formatINR(item.balance, true)}</p>
    </div>
  );
};

export default LoanDetailsCard;
