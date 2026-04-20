import { mountNav } from "../components/nav";
import { login } from "../api/auth";
import { redirectIfLoggedIn } from "../utils/auth-guard";
import { getParam } from "../utils/url";
import { toast } from "../components/toast";
import { clearAllErrors, showError } from "../utils/validation";

mountNav();
redirectIfLoggedIn("/");

const form = document.getElementById("login-form") as HTMLFormElement | null;
const emailInput = document.getElementById("email") as HTMLInputElement | null;
const passwordInput = document.getElementById("password") as HTMLInputElement | null;
const submitBtn = document.getElementById("submit-btn") as HTMLButtonElement | null;
const errorBanner = document.getElementById("error-banner");

form?.addEventListener("submit", async (e: Event) => {
  e.preventDefault();
  if (!form || !emailInput || !passwordInput || !submitBtn) return;

  clearAllErrors(form);
  errorBanner?.classList.add("hidden");

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  let valid = true;
  if (!email) { showError(emailInput, "Email is required"); valid = false; }
  if (!password) { showError(passwordInput, "Password is required"); valid = false; }
  if (!valid) return;

  submitBtn.disabled = true;
  submitBtn.textContent = "Logging in...";

  try {
    await login({ email, password });
    toast("Welcome back!", "success", 1500);
    const redirect = getParam("redirect") ?? "/";
    setTimeout(() => (window.location.href = redirect), 500);
  } catch (err) {
    if (errorBanner) {
      errorBanner.textContent =
        err instanceof Error ? err.message : "Invalid credentials. Please try again.";
      errorBanner.classList.remove("hidden");
    }
    submitBtn.disabled = false;
    submitBtn.textContent = "Log In";
  }
});
