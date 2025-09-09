// export const pendingEmi = (startDate, tenure, today = new Date()) => {
//   let years = today.getFullYear() - startDate.getFullYear();
//   let months = today.getMonth() - startDate.getMonth();
//   let totalMonths = years * 12 + months;

//   if (today.getDate() < startDate.getDate()) {
//     totalMonths -= 1;
//   }

//   return tenure - (totalMonths + 1);
// };

export const pendingEmi = (startDate, tenure, today = new Date()) => {
  let years = today.getFullYear() - startDate.getFullYear();
  let months = today.getMonth() - startDate.getMonth();
  let totalMonths = years * 12 + months;

  if (today.getDate() < startDate.getDate()) {
    totalMonths -= 1;
  }

  // remaining = total tenure - months passed (including current month)
  const remaining = tenure - (totalMonths + 1);

  // ✅ clamp so it never goes negative
  return remaining > 0 ? remaining : 0;
};
