export function validateRegisterForm(
  name: string,
  email: string,
  password: string
) {
  const errors: Record<string, string> = {};

  if (!name.trim()) {
    errors.name = "Name is required";
  }

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!email.toLowerCase().endsWith("@stud.noroff.no")) {
    errors.email = "Email must end with @stud.noroff.no";
  }

  if (!password.trim()) {
    errors.password = "Password is required";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  return errors;
}