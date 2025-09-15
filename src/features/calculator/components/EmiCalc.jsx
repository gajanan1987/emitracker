import { useState } from "react";
import { useDispatch } from "react-redux";
import { computeScheduleFor } from "../../../redux/loanSlice";

const EmiCalc = () => {
  const dispatch = useDispatch();

  const [loanAmount, setLoanAmount] = useState(3000000);
  const [interestRate, setInterestRate] = useState(12);
  const [tenure, setTenure] = useState(120);
  const [calculated, setCalculated] = useState(false); // only controls button

  const handleCalc = () => {
    const today = new Date();
    const formatDate = (date) => date.toISOString().split("T")[0];
    const loan_date = formatDate(today);
    const emi_date = formatDate(new Date(today.setDate(today.getDate() + 1)));

    const data = {
      loan_amount: Number(loanAmount),
      interest_rate: Number(interestRate),
      tenure_months: Number(tenure),
      loan_date,
      emi_date,
    };

    dispatch(computeScheduleFor({ data, type: "loanDetails" }));

    setCalculated(true); // disable button after calculation
  };

  // common validation: button disabled if any field empty/invalid
  const isInvalid =
    !loanAmount || !interestRate || !tenure || Number(tenure) <= 0;

  // when inputs change → update value & re-enable button
  const handleChange = (setter) => {
    console.log("🚀 ~ handleChange ~ setter:", setter);
    return (e) => {
      setter(e.target.value);
      setCalculated(false); // re-enable button
    };
  };

  return (
    <>
      <h1>EMI Calculator</h1>
      <div className="form">
        <div className="input-wrapper">
          <label>Enter Loan Amount</label>
          <input
            type="number"
            placeholder="Loan Amount"
            value={loanAmount}
            onChange={handleChange(setLoanAmount)}
          />
        </div>

        <div className="input-wrapper">
          <label>Enter ROI</label>
          <input
            type="number"
            placeholder="Annual Interest Rate (%)"
            value={interestRate}
            onChange={handleChange(setInterestRate)}
          />
        </div>

        <div className="input-wrapper">
          <label>Enter Tenure</label>
          <input
            type="number"
            placeholder="Tenure (Months)"
            value={tenure}
            onChange={handleChange(setTenure)}
          />
        </div>

        <div className="btn-wrapper">
          <button
            className="btn btn-primary"
            onClick={handleCalc}
            disabled={isInvalid || calculated}
          >
            Calculate
          </button>
        </div>
      </div>
    </>
  );
};

export default EmiCalc;
