import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { getUserLoanDetailsbyId } from "../services/api";
import { calculateEMI } from "../utils/calculateEmi";

const LoanDetails = () => {
  const [data, setData] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const location = useLocation();
  const id = location.state.loanId;

  useEffect(() => {
    async function fetchData() {
      const data = await getUserLoanDetailsbyId(id);
      setData(data);
      const op = calculateEMI(data);
      setSchedule(op[1]);
    }
    fetchData();
  }, [id]);

  return (
    <div>
      {data.length > 0 && (
        <>
          <p>{data[0].emi_amount}</p>
          <p>{data[0].emi_date}</p>
          <p>{data[0].interest_rate}</p>
          <p>{data[0].loan_amount}</p>
          <p>{data[0].loan_name}</p>
          <p>{data[0].start_date}</p>
          <p>{data[0].tenure_months}</p>
        </>
      )}

      {schedule.length > 0 && (
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
            {schedule.map((row, index) => (
              <tr
                key={index}
                style={{
                  background:
                    row.date <= new Date() ? "#e0ffe0" : "transparent",
                }}
              >
                <td>{row.month}</td>
                <td>{row.emi}</td>
                <td>{row.principal}</td>
                <td>{row.interest}</td>
                <td>{row.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LoanDetails;
