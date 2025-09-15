import { useState } from "react";
import { formatINR } from "../../utils/number";
import LoanTable from "../loans/components/LoanTable";
import { useDispatch, useSelector } from "react-redux";
import { removeSummery, selectScheduleState } from "../../redux/loanSlice";
import RoiCalc from "./components/RoiCalc";
import PrincipalCalc from "./components/PrincipalCalc";
import EmiCalc from "./components/EmiCalc";
import EmiSummery from "./components/EmiSummery";

export default function LoanCalculator() {
  const dispatch = useDispatch();
  const menu = ["Calculate EMI", "Calculate ROI", "Calculate Principal"];
  const { emiSummary } = useSelector((state) => state.loans);
  console.log("🚀 ~ LoanCalculator ~ emiSummary:", emiSummary);
  const currentSchedule = useSelector(selectScheduleState);

  const [btn, setBtn] = useState("Calculate EMI");

  const [summary, setSummary] = useState(null);

  const handleChange = (item) => {
    setBtn(item);
    if (currentSchedule) {
      dispatch(removeSummery());
    }
  };

  return (
    <div className="loan-tracker">
      <div className="cust-btn-group">
        <ul>
          {menu.map((item) => {
            return (
              <li key={item} className={` ${btn === item ? "active" : ""}`}>
                <button className="cust-btn" onClick={() => handleChange(item)}>
                  {item}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {btn === "Calculate EMI" && <EmiCalc />}
      {btn === "Calculate ROI" && <RoiCalc />}
      {btn === "Calculate Principal" && <PrincipalCalc />}

      {emiSummary && <EmiSummery emiSummary={emiSummary} />}

      {currentSchedule?.length > 0 && (
        <LoanTable currentSchedule={currentSchedule} />
      )}
    </div>
  );
}
