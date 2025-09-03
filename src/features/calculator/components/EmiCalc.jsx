import React, { useActionState } from "react";

const EmiCalc = () => {
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
    <h1>ff</h1>
    // <>
    //   <h1>EMI Calculator</h1>
    //   <div className="form" action={formAction}>
    //     <div className="input-wrapper">
    //       <label>Enter Loan Amount</label>

    //       <input
    //         type="number"
    //         placeholder="Loan Amount"
    //         value={loanAmount}
    //         onChange={(e) => setLoanAmount(e.target.value)}
    //       />
    //     </div>
    //     <div className="input-wrapper">
    //       <label>Enter RIO</label>

    //       <input
    //         type="number"
    //         placeholder="Annual Interest Rate (%)"
    //         value={interestRate}
    //         onChange={(e) => setInterestRate(e.target.value)}
    //       />
    //     </div>
    //     <div className="input-wrapper">
    //       <label>Enter Tenure</label>
    //       <input
    //         type="number"
    //         placeholder="Tenure (Months)"
    //         value={tenure}
    //         onChange={(e) => setTenure(e.target.value)}
    //       />
    //     </div>

    //     {/* <input type="range" id="volume" name="volume" min="0" max="100" /> */}

    //     <div className="btn-wrapper">
    //       <button className="btn btn-primary" onClick={() => handleCalc()}>
    //         Calculate
    //       </button>

    //       <button className="btn btn-primary" type="submit">
    //         {isPending ? "Calculating..." : "Calculate"}
    //       </button>
    //     </div>
    //   </div>
    // </>
  );
};

export default EmiCalc;
