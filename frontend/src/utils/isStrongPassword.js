import toast from "react-hot-toast";

export function isStrongPassword(password) {
  const errors = [];

  if (password.length < 6) errors.push("Password must be at least 6 characters long");
  if (!/[A-Z]/.test(password)) errors.push("Password must contain at least one uppercase letter");
  if (!/[a-z]/.test(password)) errors.push("Password must contain at least one lowercase letter");
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push("Password must contain at least one special character");

  if (errors.length > 0) {
    toast.error(errors[0]);
    return false;
  }

  return true;
}
