import { useActionState } from "react";

const PrincipalCalc = () => {
  const initialstate = {
    data: null,
    error: null,
  };
  const [state, formAction, isPending] = useActionState(formData, initialstate);

  async function formData(prevState, formData) {
    const emi = formData.get("emi");
    const roi = formData.get("roi");
    const tenure = formData.get("tenure");
  }
  return (
    <>
      <h1>Calculate Loan Amount</h1>
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
    </>
  );
};

export default PrincipalCalc;
