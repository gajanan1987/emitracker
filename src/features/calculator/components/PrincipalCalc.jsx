import { useActionState, useState } from "react";
import { calculateLoanAmount } from "../../../utils/calculateEmi";
import { formatINR } from "../../../utils/number";

const PrincipalCalc = () => {
  const [princ, setPrinc] = useState(null);
  const initialstate = {
    data: null,
    error: null,
  };
  const [state, formAction, isPending] = useActionState(formData, initialstate);

  async function formData(prevState, formData) {
    const emi = formData.get("emi");
    const roi = formData.get("roi");
    const tenure = formData.get("tenure");

    if (!emi || !roi || !tenure) return;

    const op = calculateLoanAmount(emi, roi, tenure);
    setPrinc(op);

    // return {
    //   ...prevState,
    //   data: op,
    //   error: null,
    // };
  }
  return (
    <>
      <h1>Calculate Principal</h1>
      <form className="form" action={formAction}>
        <div className="input-wrapper">
          <label>Enter EMI</label>
          <input type="number" name="emi" placeholder="EMI Amount" />
        </div>

        <div className="input-wrapper">
          <label>Enter RIO</label>
          <input
            type="number"
            placeholder="Annual Interest Rate (%)"
            step="any"
            name="roi"
          />
        </div>

        <div className="input-wrapper">
          <label>Enter Remaning Tenure</label>
          <input type="number" placeholder="Tenure (Months)" name="tenure" />
        </div>

        <div className="btn-wrapper">
          <button className="btn btn-primary" type="submit">
            {isPending ? "Calculating..." : "Calculate"}
          </button>
        </div>
      </form>

      {princ && (
        <h1>
          Remaning Principal : <span>{formatINR(princ, true)}</span>
        </h1>
      )}
    </>
  );
};

export default PrincipalCalc;
