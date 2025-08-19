import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { getUserLoanDetailsbyId } from "../services/api";

const LoanDetails = () => {
  const [data, setData] = useState([]);
  console.log("🚀 ~ LoanDetails ~ data ddd:", data);
  const location = useLocation();
  const id = location.state.loanId;
  console.log("🚀 ~ LoanDetails ~ id:", id);

  useEffect(() => {
    async function fetchData() {
      const data = await getUserLoanDetailsbyId(id);
      setData(data);
    }
    fetchData();
  }, [id]);

  return <div>{data.length > 0 && <p>{data[0].loan_amount}</p>}</div>;
};

export default LoanDetails;
