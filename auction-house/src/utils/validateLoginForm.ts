export function validateLoginForm(email: string, password: string) {
  const errors: Record<string, string> = {};

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!email.endsWith("@stud.noroff.no")) {
    errors.email = "Email must be a stud.noroff.no address";
  }

  if (!password.trim()) {
    errors.password = "Password is required";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  return errors;
}