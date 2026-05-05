// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation (min 6 characters)
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

// PIN validation (4 digits)
export const isValidPIN = (pin: string): boolean => {
  return /^\d{4}$/.test(pin);
};

// Name validation (not empty, only letters and spaces)
export const isValidName = (name: string): boolean => {
  return name.trim().length > 0 && /^[a-zA-Z\s]+$/.test(name.trim());
};

// Age validation (1-100)
export const isValidAge = (age: number): boolean => {
  return age >= 1 && age <= 100;
};
