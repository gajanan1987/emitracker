import React from "react";

const LoanTable = ({ currentSchedule }) => {
  const allYears = [
    ...new Set(
      currentSchedule?.map((item) => new Date(item.date).getFullYear())
    ),
  ];
  console.log("🚀 ~ LoanTable ~ allYears:", allYears);
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>EMI</th>
            <th>Principal</th>
            <th>Interest</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {allYears?.map((year) => (
            <div key={year}>
              <h3>{year}</h3>
              <ul>
                {currentSchedule
                  ?.filter((row) => new Date(row.date).getFullYear() === year) // ✅ only this year's rows
                  .map((row, index) => (
                    <li key={index}>
                      {new Date(row.date).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      - EMI: {row.emi}, Principal: {row.principal}, Interest:{" "}
                      {row.interest}, Balance: {row.balance}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default LoanTable;

// {
//   allYears?.map((year) => (
//     <div key={year}>
//       <h3>{year}</h3>
//       <ul>
//         {currentSchedule
//           ?.filter((row) => new Date(row.date).getFullYear() === year) // ✅ only this year's rows
//           .map((row, index) => (
//             <li key={index}>
//               {new Date(row.date).toLocaleDateString("en-US", {
//                 month: "short",
//                 year: "numeric",
//               })}{" "}
//               - EMI: {row.emi}, Principal: {row.principal}, Interest:{" "}
//               {row.interest}, Balance: {row.balance}
//             </li>
//           ))}
//       </ul>
//     </div>
//   ));
// }
