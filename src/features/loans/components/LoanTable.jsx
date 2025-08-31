import React, { useState } from "react";
import { formatINR } from "../../../utils/number";

const LoanTable = ({ currentSchedule }) => {
  // State to track which year's details are expanded
  const [expandedYear, setExpandedYear] = useState(null);

  const allYears = [
    ...new Set(
      currentSchedule?.map((item) => new Date(item.date).getFullYear())
    ),
  ];

  const yearSummary = allYears.map((year) => {
    // Filter items for the current year
    const itemsForYear = currentSchedule?.filter(
      (item) => new Date(item.date).getFullYear() === year
    );

    if (!itemsForYear || itemsForYear.length === 0) {
      return { year, principal: 0, interest: 0, emi: 0, balance: 0 };
    }

    // Aggregate principal, interest, and emi for the year
    const yearAggregates = itemsForYear.reduce(
      (accu, curr) => {
        accu.principal += curr.principal;
        accu.interest += curr.interest;
        accu.emi += curr.emi;
        return accu;
      },
      { principal: 0, interest: 0, emi: 0 }
    );

    // Find the record with the latest date in that year
    const lastRecord = itemsForYear.reduce((latest, curr) => {
      return new Date(curr.date) > new Date(latest.date) ? curr : latest;
    });

    return {
      year,
      principal: yearAggregates.principal,
      interest: yearAggregates.interest,
      emi: yearAggregates.emi,
      balance: lastRecord.balance, // Last month's balance
    };
  });

  // Function to toggle visibility of the details for the clicked year
  const toggleYearDetails = (year) => {
    setExpandedYear((prevYear) => (prevYear === year ? null : year));
  };

  return (
    <>
      <table className="table-reponsive loan-table">
        <thead>
          <tr>
            <th>Year</th>
            <th>Principal (A)</th>
            <th>Interest (B)</th>
            <th>EMI (A + B)</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {allYears?.map((year) => {
            const summary = yearSummary.find((item) => item.year === year);
            return (
              <React.Fragment key={year}>
                <tr className="tr-year">
                  <td onClick={() => toggleYearDetails(year)}>
                    <span>+</span> {year}
                  </td>
                  <td>{formatINR(summary?.principal, true)}</td>
                  <td>{formatINR(summary?.interest, true)}</td>
                  <td>{formatINR(summary?.emi, true)}</td>
                  <td>{formatINR(summary?.balance, true)}</td>
                </tr>

                {/* Toggleable details row */}
                <tr
                  className={`tr-details ${
                    expandedYear === year ? "open" : ""
                  }`}
                >
                  <td colSpan={5}>
                    <div>
                      <table>
                        <tbody>
                          {currentSchedule
                            ?.filter(
                              (row) => new Date(row.date).getFullYear() === year
                            ) // ✅ only this year's rows
                            .map((row, index) => (
                              <tr key={index}>
                                <td>
                                  {new Date(row.date).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )}
                                </td>
                                <td>{formatINR(row.principal, true)}</td>
                                <td>{formatINR(row.interest, true)}</td>
                                <td>{formatINR(row.emi, true)}</td>
                                <td>{formatINR(row.balance, true)}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default LoanTable;
