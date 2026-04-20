export function validateEmail(email: string): boolean {
  return email.endsWith("@stud.noroff.no");
}

export function validatePassword(password: string): boolean {
  return password.length >= 8;
}

export function validateUrl(url: string): boolean {
  if (!url) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function showError(input: HTMLElement, message: string): void {
  clearError(input);
  const el = document.createElement("p");
  el.className = "text-red-500 text-sm mt-1 field-error";
  el.textContent = message;
  input.classList.add("border-red-500");
  input.after(el);
}

export function clearError(input: HTMLElement): void {
  input.classList.remove("border-red-500");
  const parent = input.parentElement;
  parent?.querySelector(".field-error")?.remove();
}

export function clearAllErrors(form: HTMLFormElement): void {
  form.querySelectorAll(".field-error").forEach((el) => el.remove());
  form
    .querySelectorAll(".border-red-500")
    .forEach((el) => el.classList.remove("border-red-500"));
}
