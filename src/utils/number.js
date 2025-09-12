export const formatIN = (value) => {
  const num = Number(value);
  if (!isFinite(num)) return value ?? "";
  return new Intl.NumberFormat("en-IN").format(num);
};

// export const formatINR = (value, withSymbol = false) => {
//   const num = Number(value);
//   if (!isFinite(num)) return value ?? "";
//   return new Intl.NumberFormat("en-IN", {
//     style: withSymbol ? "currency" : undefined,
//     currency: withSymbol ? "INR" : undefined,
//     maximumFractionDigits: 2, // no paise
//     minimumFractionDigits: 2,
//   }).format(num);
// };

// export const formatINR = (value, withSymbol = false) => {
//   const num = Number(value);
//   if (!isFinite(num)) return value ?? "";

//   const formattedValue = new Intl.NumberFormat("en-IN", {
//     style: withSymbol ? "currency" : undefined,
//     currency: withSymbol ? "INR" : undefined,
//     maximumFractionDigits: 2, // no paise
//     minimumFractionDigits: 0,
//   }).format(num);

//   if (withSymbol) {
//     return formattedValue.replace("₹", "₹ ");
//   }

//   return formattedValue;
// };

export const formatINR = (value, withSymbol = false) => {
  let num = Number(value);
  if (!isFinite(num)) return value ?? "";

  // 🔑 Convert -0 to 0
  if (Object.is(num, -0)) num = 0;

  const formattedValue = new Intl.NumberFormat("en-IN", {
    style: withSymbol ? "currency" : undefined,
    currency: withSymbol ? "INR" : undefined,
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(num);

  if (withSymbol) {
    return formattedValue.replace("₹", "₹ ");
  }

  return formattedValue;
};
