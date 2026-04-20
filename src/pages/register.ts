import { mountNav } from "../components/nav";
import { register, login } from "../api/auth";
import { redirectIfLoggedIn } from "../utils/auth-guard";
import { validateEmail, validatePassword, showError, clearAllErrors } from "../utils/validation";
import { toast } from "../components/toast";

mountNav();
redirectIfLoggedIn("/");

const form = document.getElementById("register-form") as HTMLFormElement | null;
const submitBtn = document.getElementById("submit-btn") as HTMLButtonElement | null;
const errorBanner = document.getElementById("error-banner");

form?.addEventListener("submit", async (e: Event) => {
  e.preventDefault();
  if (!form || !submitBtn) return;

  clearAllErrors(form);
  errorBanner?.classList.add("hidden");

  const nameInput = form.elements.namedItem("name") as HTMLInputElement;
  const emailInput = form.elements.namedItem("email") as HTMLInputElement;
  const passwordInput = form.elements.namedItem("password") as HTMLInputElement;
  const confirmInput = form.elements.namedItem("confirmPassword") as HTMLInputElement;
  const bioInput = form.elements.namedItem("bio") as HTMLTextAreaElement | null;
  const avatarInput = form.elements.namedItem("avatarUrl") as HTMLInputElement | null;

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmInput.value;
  const bio = bioInput?.value.trim() ?? "";
  const avatarUrl = avatarInput?.value.trim() ?? "";

  let valid = true;

  if (!name || !/^[a-zA-Z0-9_]+$/.test(name)) {
    showError(nameInput, "Name must only contain letters, numbers and underscores");
    valid = false;
  }
  if (!email || !validateEmail(email)) {
    showError(emailInput, "Must be a @stud.noroff.no email address");
    valid = false;
  }
  if (!validatePassword(password)) {
    showError(passwordInput, "Password must be at least 8 characters");
    valid = false;
  }
  if (password !== confirmPassword) {
    showError(confirmInput, "Passwords do not match");
    valid = false;
  }
  if (!valid) return;

  submitBtn.disabled = true;
  submitBtn.textContent = "Creating account...";

  try {
    await register({
      name,
      email,
      password,
      bio: bio || undefined,
      avatar: avatarUrl ? { url: avatarUrl, alt: `${name}'s avatar` } : undefined,
    });
    toast("Account created! Logging you in...", "success", 2000);
    await login({ email, password });
    setTimeout(() => (window.location.href = "/"), 800);
  } catch (err) {
    if (errorBanner) {
      errorBanner.textContent =
        err instanceof Error ? err.message : "Registration failed. Please try again.";
      errorBanner.classList.remove("hidden");
    }
    submitBtn.disabled = false;
    submitBtn.textContent = "Create Account";
  }
});
