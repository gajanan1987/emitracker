import { addMonths, format, isBefore } from "date-fns";
// Utility: normalize dates (avoid time issues)
const normalizeDate = (date) => new Date(date.setHours(0, 0, 0, 0));
const round = (n) => Math.round(n);

// ----------------------------
// 1) Generate EMI Schedule
// ----------------------------
const generateSchedule = (op) => {
  const { emi_date, interest_rate, loan_amount, loan_date, tenure_months } = op;

  const P = parseFloat(loan_amount);
  const annualRate = parseFloat(interest_rate);
  const n = parseInt(tenure_months);
  const r = annualRate / 12 / 100;

  if (!P || !annualRate || !n || !loan_date || !emi_date) return [];

  const loanStart = new Date(loan_date);
  const firstEmi = new Date(emi_date);
  if (firstEmi <= loanStart) return [];

  // EMI Formula
  const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

  let balance = P;
  let scheduleArr = [];
  let startDate = firstEmi;

  for (let i = 1; i <= n; i++) {
    const interestForMonth = balance * r;
    const principalForMonth = emi - interestForMonth;
    balance -= principalForMonth;

    const emiDueDate = addMonths(startDate, i - 1);

    const normalizedEmiDueDate = normalizeDate(new Date(emiDueDate));
    const normalizedToday = normalizeDate(new Date());

    const emiStatus = isBefore(normalizedEmiDueDate, normalizedToday)
      ? "Done"
      : "Pending";

    scheduleArr.push({
      emi: round(emi),
      principal: round(principalForMonth),
      interest: round(interestForMonth),
      balance: balance > 0 ? round(balance) : 0,
      date: emiDueDate.toISOString(),
      emiStatus,
    });
  }

  return scheduleArr;
};

// ----------------------------
// 2) Generate Summary
// ----------------------------
const generateSummary = (scheduleArr, op) => {
  const { loan_amount, interest_rate, tenure_months, loan_name } = op;
  const P = parseFloat(loan_amount);

  const totalInterest = scheduleArr.reduce((sum, r) => sum + r.interest, 0);
  const totalPrincipal = scheduleArr.reduce((sum, r) => sum + r.principal, 0);

  const today = new Date();
  const paidRows = scheduleArr.filter((row) => new Date(row.date) <= today);

  const paid = paidRows.length;
  const remaining = scheduleArr.length - paid;

  const paidPrincipal = paidRows.reduce((sum, row) => sum + row.principal, 0);
  const paidInterest = paidRows.reduce((sum, row) => sum + row.interest, 0);

  const remainingPrincipal = round(P - paidPrincipal);
  const remainingInterest = round(totalInterest - paidInterest);

  return {
    emi: scheduleArr[0]?.emi || 0,
    interest_rate,
    loan_amount,
    tenure_months,
    totalInterest: round(totalInterest),
    totalPayment: round(P + totalInterest),
    paid,
    remaining,
    paidPrincipal,
    paidInterest,
    remainingPrincipal,
    remainingInterest,
    loan_name,
    loanStatus: op.loanStatus || "",
    id: op.id || "",
  };
};

// ----------------------------
// 3) Combined Function (Optional)
// ----------------------------
export const genrateEmi = (op) => {
  const scheduleArr = generateSchedule(op);
  const summery = generateSummary(scheduleArr, op);
  return { scheduleArr, summery };
};
