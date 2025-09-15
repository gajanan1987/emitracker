import { useEffect, useRef } from "react";
import { computeScheduleFor } from "../../../redux/loanSlice";
import { useDispatch } from "react-redux";
import Input from "../../../components/Input";
import useLoanForm from "../../../hooks/useLoanForm";
import Summary from "./Summary";

const AddLoan = ({ emiSummary, onCloseModal }) => {
  const dispatch = useDispatch();
  const summaryRef = useRef(null);

  const { formData, handleChange, isInvalid, setCalculated, calculated } =
    useLoanForm();

  const handleCalculate = () => {
    if (isInvalid) return;

    const data = {
      loan_amount: formData.loanAmount,
      interest_rate: formData.loanInterest,
      tenure_months: formData.loanTenure,
      loan_date: formData.loanDate,
      emi_date: formData.loanEmiDate,
    };

    dispatch(computeScheduleFor({ data, type: "addLoan" }));
    setCalculated(true);
  };

  // Auto-scroll to summary
  useEffect(() => {
    if (calculated && emiSummary) {
      summaryRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [calculated, emiSummary]);

  return (
    <div className="add-loan-form">
      <h2>Add New Loan EMI</h2>

      <div className="form">
        <div className="input-wrapper">
          <Input
            type="text"
            label="Enter Bank Name / Loan Number Account"
            name="loanName"
            value={formData.loanName}
            onChange={handleChange}
            placeholder="Bank Name / Acc. Number"
            required
          />
        </div>

        <div className="input-wrapper">
          <Input
            label="Enter Loan Amount"
            name="loanAmount"
            type="number"
            value={formData.loanAmount}
            onChange={handleChange}
            placeholder="Loan Amount"
            required
          />
        </div>

        <div className="input-wrapper">
          <Input
            label="Enter Interest Rate (%)"
            name="loanInterest"
            type="number"
            value={formData.loanInterest}
            onChange={handleChange}
            placeholder="Annual Interest Rate (%)"
            required
          />
        </div>

        <div className="input-wrapper">
          <Input
            label="Enter Tenure (Months)"
            name="loanTenure"
            type="number"
            value={formData.loanTenure}
            onChange={handleChange}
            placeholder="Tenure (Months)"
            required
          />
        </div>

        <div className="input-wrapper">
          <Input
            label="Loan Start Date"
            name="loanDate"
            type="date"
            value={formData.loanDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-wrapper">
          <Input
            label="First EMI Date"
            name="loanEmiDate"
            type="date"
            value={formData.loanEmiDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="btn-wrapper">
          <button
            className="btn btn-primary-hallow"
            onClick={handleCalculate}
            disabled={isInvalid || calculated}
          >
            Calculate
          </button>
        </div>
      </div>

      {calculated && emiSummary && (
        <div ref={summaryRef}>
          <Summary
            emiSummary={emiSummary}
            formData={formData}
            onCloseModal={onCloseModal}
          />
        </div>
      )}
    </div>
  );
};

export default AddLoan;
