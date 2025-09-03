import { useActionState, useState } from "react";
import { calculateROI } from "../../../utils/calculateEmi";

const RoiCalc = () => {
  const [roi, setRoi] = useState(null);
  const initialstate = {
    data: null,
    error: null,
  };
  const [state, formAction, isPending] = useActionState(formData, initialstate);

  async function formData(prevState, formData) {
    const emi = formData.get("emi");
    const loanAmount = formData.get("loanAmount");
    const tenure = formData.get("tenure");

    const op = calculateROI(loanAmount, emi, tenure);
    console.log("🚀 ~ formData ~ op:", op);
    setRoi(op);
  }
  return (
    <>
      <h1>Calculate ROI</h1>
      <form className="form" action={formAction}>
        <div className="input-wrapper">
          <label>Enter EMI</label>
          <input type="number" name="emi" placeholder="EMI Amount" />
        </div>

        <div className="input-wrapper">
          <label>Enter Outstanding Amount</label>
          <input
            type="number"
            placeholder="Outstanding Amount"
            name="loanAmount"
          />
        </div>

        <div className="input-wrapper">
          <label>Enter Tenure</label>
          <input type="number" placeholder="Tenure (Months)" name="tenure" />
        </div>

        <div className="btn-wrapper">
          <button className="btn btn-primary" type="submit">
            {isPending ? "Calculating..." : "Calculate"}
          </button>
        </div>
      </form>
      {roi && (
        <h1>
          Remaning Principal : <span>{roi} %</span>
        </h1>
      )}
    </>
  );
};

export default RoiCalc;
