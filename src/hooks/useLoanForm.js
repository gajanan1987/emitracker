import React, { useState } from "react";

const useLoanForm = () => {
  const [formData, setFormData] = useState({
    loanAmount: 1234567,
    loanInterest: 12,
    loanTenure: 40,
    loanDate: "2025-09-01",
    loanEmiDate: "2025-09-05",
    loanName: "testing",
  });
  const [calculated, setCalculated] = useState(false);

  const isInvalid =
    !formData.loanName ||
    !formData.loanAmount ||
    !formData.loanInterest ||
    !formData.loanTenure ||
    !formData.loanDate ||
    !formData.loanEmiDate ||
    Number(formData.loanTenure) <= 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCalculated(false);
  };

  return {
    formData,
    calculated,
    handleChange,
    isInvalid,
    setCalculated,
  };
};

export default useLoanForm;
