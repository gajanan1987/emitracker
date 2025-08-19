// utils/number.ts or utils/number.js
export const formatIN = (value) => {
  const num = Number(value);
  if (!isFinite(num)) return value ?? "";
  return new Intl.NumberFormat("en-IN").format(num);
};

export const formatINR = (value, withSymbol = false) => {
  const num = Number(value);
  if (!isFinite(num)) return value ?? "";
  return new Intl.NumberFormat("en-IN", {
    style: withSymbol ? "currency" : undefined,
    currency: withSymbol ? "INR" : undefined,
    maximumFractionDigits: 0, // no paise
    minimumFractionDigits: 0,
  }).format(num);
};
