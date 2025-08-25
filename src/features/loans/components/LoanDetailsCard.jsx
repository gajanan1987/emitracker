const LoanDetailsCard = ({ item, index }) => {
  return (
    <div className={item.date <= new Date() ? "emi-done" : "emi-pending"}>
      <span>Emi: {index + 1}</span>
      <p>{item.month}</p>
    </div>
  );
};

export default LoanDetailsCard;
