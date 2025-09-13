import { useMemo } from "react";

export const useOutstandingSummary = (outstanding) => {
  return useMemo(() => {
    const filterData =
      outstanding?.filter((item) => item.loanStatus !== "fullypaid") || [];

    return {
      totalLoanAmount: filterData.reduce(
        (sum, item) => sum + item.loan_amount,
        0
      ),
      totalEmi: filterData.reduce((sum, item) => sum + item.emi, 0),
      paidPrincipal: filterData.reduce(
        (sum, item) => sum + item.paidPrincipal,
        0
      ),
      remainPrincipal: filterData.reduce(
        (sum, item) => sum + item.remainingPrincipal,
        0
      ),
      paidInterest: filterData.reduce(
        (sum, item) => sum + item.paidInterest,
        0
      ),
      remainInterest: filterData.reduce(
        (sum, item) => sum + item.remainingInterest,
        0
      ),
    };
  }, [outstanding]);
};
