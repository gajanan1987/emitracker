export const pendingEmi = (startDate, tenure, today = new Date()) => {
  let years = today.getFullYear() - startDate.getFullYear();
  let months = today.getMonth() - startDate.getMonth();
  let totalMonths = years * 12 + months;

  if (today.getDate() < startDate.getDate()) {
    totalMonths -= 1;
  }

  return tenure - (totalMonths + 1);
};
