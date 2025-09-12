import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatINR } from "../../utils/number";
import { computeOutstanding } from "../../redux/loanSlice";

const Remaining = () => {
  const dispatch = useDispatch();
  const { items, outstanding } = useSelector((state) => state.loans);
  console.log("🚀 ~ Remaining ~ outstanding:", outstanding);

  const handleSort = (key) => {};

  useEffect(() => {
    dispatch(computeOutstanding(items));
  }, [dispatch]);

  const {
    totalLoanAmount,
    totalEmi,
    paidPrincipal,
    remainPrincipal,
    paidInterest,
    remainInterest,
  } = useMemo(() => {
    const filterData = outstanding?.filter((item) => {
      return item.loanStatus !== "fullypaid";
    });

    const totalLoanAmount = filterData?.reduce((sum, item) => {
      return sum + item.loan_amount;
    }, 0);

    const totalEmi = filterData?.reduce((sum, item) => {
      return sum + item.emi;
    }, 0);

    const paidPrincipal = filterData?.reduce((sum, item) => {
      return sum + item.paidPrincipal;
    }, 0);
    const remainPrincipal = filterData?.reduce((sum, item) => {
      return sum + item.remainingPrincipal;
    }, 0);

    const paidInterest = filterData?.reduce((sum, item) => {
      return sum + item.paidInterest;
    }, 0);
    const remainInterest = filterData?.reduce((sum, item) => {
      return sum + item.remainingInterest;
    }, 0);

    return {
      totalLoanAmount,
      totalEmi,
      paidPrincipal,
      remainPrincipal,
      paidInterest,
      remainInterest,
    };
  }, [outstanding]);

  return (
    <div>
      <h1>Outstanding Loan Details</h1>
      <table className="table-reponsive common-table outstanding-table">
        <thead>
          <tr>
            <th onClick={() => handleSort("loan_name")}>Loan</th>
            <th onClick={() => handleSort("loan_amount")}>Loan Amount</th>
            <th onClick={() => handleSort("emi_amount")}>EMI</th>
            <td colSpan={2} className="principle">
              <table>
                <thead>
                  <tr>
                    <th style={{ backgroundColor: "#8dc08d" }} colSpan={2}>
                      Principal
                    </th>
                  </tr>
                  <tr>
                    <th className="green">Paid</th>
                    <th className="red">Remaining</th>
                  </tr>
                </thead>
              </table>
            </td>

            <td colSpan={2} className="principle">
              <table>
                <thead>
                  <tr>
                    <th style={{ backgroundColor: "#e99999" }} colSpan={2}>
                      Interest
                    </th>
                  </tr>
                  <tr>
                    <th className="green">Paid</th>
                    <th className="red">Remaining</th>
                  </tr>
                </thead>
              </table>
            </td>
            {/* <th onClick={() => handleSort("nextDueDate")}>P Principal</th> */}
            {/* <th onClick={() => handleSort("nextDueDate")}>R Principal</th> */}
            {/* <th onClick={() => handleSort("nextDueDate")}>P Interest</th>
            <th onClick={() => handleSort("nextDueDate")}>R Interest</th> */}
            <th onClick={() => handleSort("remaningEmi")}>Remaining</th>
            {/* <th onClick={() => handleSort("emiStatus")}>Loan Status</th> */}
          </tr>
        </thead>

        <tbody>
          {outstanding.map((item) => (
            <tr className="tr-year" key={item.id}>
              <td>{item.loan_name}</td>
              <td>{formatINR(item.loan_amount, true)}</td>
              <td>{formatINR(item.emi, true)}</td>
              <td>{formatINR(item.paidPrincipal, true)}</td>
              <td>{formatINR(item.remainingPrincipal, true)}</td>

              <td>{formatINR(item.paidInterest, true)}</td>
              <td>{formatINR(item.remainingInterest, true)}</td>

              <td>{item.remaining} months</td>
              {/* <td className={item.loanStatus}>{item.loanStatus}</td> */}
            </tr>
          ))}

          {/* ✅ Summary row */}
          <tr className="summary-row">
            <td>Total</td>
            <td>{formatINR(totalLoanAmount, true)}</td>
            <td>{formatINR(totalEmi, true)}</td>
            <td>{formatINR(paidPrincipal, true)}</td>
            <td>{formatINR(remainPrincipal, true)}</td>
            <td>{formatINR(paidInterest, true)}</td>
            <td>{formatINR(remainInterest, true)}</td>
            <td></td>

            {/* <td colSpan="3">
              <div>
                <div className="paid">
                  <span>Paid Monthaly EMI:</span> {formatINR(paidMonth, true)}
                </div>
                <div className="rem">
                  <span>Remaning Monthaly EMI:</span>{" "}
                  {formatINR(remaningMonth, true)}
                </div>
              </div>
            </td> */}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Remaining;
