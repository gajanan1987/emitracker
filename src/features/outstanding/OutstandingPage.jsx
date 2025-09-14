import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLoans, selectLoanItems } from "../../redux/loanSlice";
import OutstandingTable from "./component/OutstandingTable";

const Remaining = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.loans);

  const summary = useSelector(selectLoanItems);

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchLoans());
    }
  }, [dispatch, items]);

  return (
    <div>
      <h1>Outstanding Loan Details</h1>
      <OutstandingTable summary={summary} items={items} />
    </div>
  );
};

export default Remaining;
