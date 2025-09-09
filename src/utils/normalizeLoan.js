// utils/normalizeLoan.js
import { isToday, isBefore } from "date-fns";
import { pendingEmi } from "./pendingEmi";

export const normalizeLoan = (item) => {
  const targetDate = new Date(item.emi_date);
  const today = new Date();
  const newDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    targetDate.getDate()
  );

  // Loan Status
  const emiStatus = isToday(newDate)
    ? "Today"
    : isBefore(newDate, today)
    ? "Done"
    : "Pending";

  // Remaining EMIs
  const remaningEmi = pendingEmi(targetDate, item.tenure_months);
  const loanStatus = remaningEmi > 0 ? "pending" : "fullypaid";

  return {
    ...item,
    emiStatus,
    loanStatus,
    remaningEmi,
    nextDueDate: newDate.toISOString(),
  };
};
