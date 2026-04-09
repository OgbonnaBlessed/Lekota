// utils/phone.ts

export const UK_PREFIX = "+44";
export const UK_MAX_DIGITS = 10; // after +44

export const formatUKPhone = (value: string): string => {
  if (!value) return UK_PREFIX;

  // Ensure prefix
  if (!value.startsWith(UK_PREFIX)) {
    value = UK_PREFIX;
  }

  // Remove non-digits after +44
  const digits = value.slice(3).replace(/\D/g, "");

  // Limit to 10 digits
  const limited = digits.slice(0, UK_MAX_DIGITS);

  return UK_PREFIX + limited;
};
