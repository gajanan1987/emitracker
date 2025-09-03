import { useState } from "react";
import { calculateLoanAmount } from "../../../utils/calculateEmi";
import { formatINR } from "../../../utils/number";
import custMessage from "../../../utils/toast";

const PrincipalCalc = () => {
  const [princ, setPrinc] = useState(null);
  const [formdata, setFormdata] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    const data = { ...formdata, [name]: value };
    setFormdata(data);
  };

  const handleSubmit = () => {
    const { emi, roi, tenure } = formdata;

    if (!emi || !roi || !tenure) {
      custMessage.warning("Please fill all fields");
      return;
    }

    const op = calculateLoanAmount(emi, roi, tenure);
    if (!op) setPrinc(op);
  };

  return (
    <>
      <h1>Calculate Principal</h1>
      <div className="form">
        <div className="input-wrapper">
          <label>Enter EMI</label>
          <input
            type="number"
            name="emi"
            placeholder="EMI Amount"
            onChange={(e) => handleChange(e)}
            value={formdata.emi}
          />
        </div>

        <div className="input-wrapper">
          <label>Enter RIO</label>
          <input
            type="number"
            placeholder="Annual Interest Rate (%)"
            step="any"
            name="roi"
            onChange={(e) => handleChange(e)}
            value={formdata.roi}
          />
        </div>

        <div className="input-wrapper">
          <label>Enter Remaning Tenure</label>
          <input
            type="number"
            placeholder="Tenure (Months)"
            name="tenure"
            onChange={(e) => handleChange(e)}
            value={formdata.tenure}
          />
        </div>

        <div className="btn-wrapper">
          <button className="btn btn-primary" onClick={() => handleSubmit()}>
            Calculate
          </button>
        </div>
      </div>

      {princ && (
        <h1>
          Remaning Principal : <span>{formatINR(princ, true)}</span>
        </h1>
      )}
    </>
  );
};

export default PrincipalCalc;
