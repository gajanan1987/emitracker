import { addMonths, format } from "date-fns";
const round = (num) => Math.round(num);
export const calculateEMI = (op) => {
  const { emi_date, interest_rate, loan_amount, start_date, tenure_months } =
    op[0];

  const P = parseFloat(loan_amount);
  const annualRate = parseFloat(interest_rate);
  const n = parseInt(tenure_months);
  const r = annualRate / 12 / 100;

  if (!P || !annualRate || !n || !start_date || !emi_date) {
    alert("Please fill all fields correctly!");
    return;
  }

  const loanStart = new Date(start_date);
  const firstEmi = new Date(emi_date);

  // ✅ validation: first EMI date should be after loan start date
  if (firstEmi <= loanStart) {
    alert("First EMI Date must be greater than Loan Start Date!");
    return;
  }

  // EMI Formula
  const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

  let balance = P;
  let scheduleArr = [];
  let totalInterest = 0;
  let totalPrincipal = 0;

  let startDate = firstEmi;

  for (let i = 1; i <= n; i++) {
    const interestForMonth = balance * r;
    const principalForMonth = emi - interestForMonth;
    balance -= principalForMonth;

    totalInterest += interestForMonth;
    totalPrincipal += principalForMonth;

    const emiDueDate = addMonths(startDate, i - 1);

    scheduleArr.push({
      month: format(emiDueDate, "dd MMM yyyy"),
      emi: round(emi),
      principal: round(principalForMonth),
      interest: round(interestForMonth),
      balance: balance > 0 ? round(balance) : 0,
      date: emiDueDate,
    });
  }

  // Till date EMIs paid
  const today = new Date();
  const paid = scheduleArr.filter((row) => row.date <= today).length;
  const remaining = n - paid;

  const paidPrincipal = scheduleArr
    .slice(0, paid)
    .reduce((sum, row) => sum + row.principal, 0);

  const paidInterest = scheduleArr
    .slice(0, paid)
    .reduce((sum, row) => sum + row.interest, 0);

  const remainingPrincipal = round(P - paidPrincipal);
  const remainingInterest = round(totalInterest - paidInterest);

  // setSchedule(scheduleArr);
  const summery = {
    emi: round(emi),
    interest_rate,
    loan_amount,
    tenure_months,
    totalInterest: round(totalInterest),
    totalPayment: round(P + totalInterest),
    paid,
    remaining,
    paidPrincipal: paidPrincipal,
    paidInterest: paidInterest,
    remainingPrincipal,
    remainingInterest,
  };

  return [summery, scheduleArr];
};
