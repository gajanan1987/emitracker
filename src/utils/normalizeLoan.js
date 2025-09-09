// utils/normalizeLoan.js
import { isToday, isBefore } from "date-fns";
import { pendingEmi } from "./pendingEmi";

// export const normalizeLoan = (item) => {
//   const targetDate = new Date(item.emi_date);
//   const today = new Date();
//   const newDate = new Date(
//     today.getFullYear(),
//     today.getMonth(),
//     targetDate.getDate()
//   );

//   // Loan Status
//   const emiStatus = isToday(newDate)
//     ? "Today"
//     : isBefore(newDate, today)
//     ? "Done"
//     : "Pending";

//   // Remaining EMIs
//   const remaningEmi = pendingEmi(targetDate, item.tenure_months);
//   const loanStatus = remaningEmi > 0 ? "pending" : "fullypaid";

//   return {
//     ...item,
//     emiStatus,
//     loanStatus,
//     remaningEmi,
//     nextDueDate: newDate.toISOString(),
//   };
// };

export const normalizeLoan = (item) => {
  const targetDate = item.emi_date ? new Date(item.emi_date) : null;
  const today = new Date();

  let newDate = null;
  if (targetDate instanceof Date && !isNaN(targetDate)) {
    newDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      targetDate.getDate()
    );
  }

  const emiStatus = newDate
    ? isToday(newDate)
      ? "Today"
      : isBefore(newDate, today)
      ? "Done"
      : "Pending"
    : "Unknown";

  const remaningEmi = targetDate
    ? pendingEmi(targetDate, item.tenure_months)
    : 0;

  const loanStatus = remaningEmi > 0 ? "pending" : "fullypaid";

  return {
    ...item,
    emiStatus,
    loanStatus,
    remaningEmi,
    nextDueDate: newDate ? newDate.toISOString() : null, // ✅ safe
  };
};
