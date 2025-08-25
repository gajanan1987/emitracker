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
    maximumFractionDigits: 2, // no paise
    minimumFractionDigits: 2,
  }).format(num);
};
