import { useState } from "react";
import { calculateROI } from "../../../utils/calculateEmi";
import custMessage from "../../../utils/toast";

const RoiCalc = () => {
  const [roi, setRoi] = useState(null);
  const [formdata, setFormdata] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    const data = { ...formdata, [name]: value };
    setFormdata(data);
  };

  const handleSubmit = () => {
    const { emi, loanAmount, tenure } = formdata;
    if (!emi || !loanAmount || !tenure) {
      custMessage.warning("Please fill all fields");
      return;
    }

    const op = calculateROI(loanAmount, emi, tenure);
    setRoi(op);
  };
  return (
    <>
      <h1>Calculate ROI</h1>
      <div className="form">
        <div className="input-wrapper">
          <label>Enter EMI</label>
          <input
            type="number"
            value={formdata.emi}
            name="emi"
            placeholder="EMI Amount"
            onChange={(e) => handleChange(e)}
          />
        </div>

        <div className="input-wrapper">
          <label>Enter Outstanding Amount</label>
          <input
            type="number"
            value={formdata.loanAmount}
            placeholder="Outstanding Amount"
            name="loanAmount"
            onChange={(e) => handleChange(e)}
          />
        </div>

        <div className="input-wrapper">
          <label>Enter Tenure</label>
          <input
            type="number"
            value={formdata.tenure}
            placeholder="Tenure (Months)"
            name="tenure"
            onChange={(e) => handleChange(e)}
          />
        </div>

        <div className="btn-wrapper">
          <button className="btn btn-primary" onClick={() => handleSubmit()}>
            Calculate
          </button>
        </div>
      </div>
      {roi && (
        <h1>
          ROI is : <span>{roi} %</span>
        </h1>
      )}
    </>
  );
};

export default RoiCalc;
