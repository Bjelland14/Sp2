import { loginUser, createApiKey } from "../api/auth";
import { saveAuth, saveApiKey } from "../utils/storage";
import { showError, hideMessage } from "../ui/showMessage";

export function setupLoginForm() {
  const form = document.getElementById("login-form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  if (!form || !emailInput || !passwordInput) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    hideMessage("form-message");

    const email = (emailInput as HTMLInputElement).value.trim();
    const password = (passwordInput as HTMLInputElement).value;
    const btn = form.querySelector("button[type=submit]");

    if (!btn) return;

    if (!email || !password) {
      showError("form-message", "Please enter both email and password.");
      return;
    }

    (btn as HTMLButtonElement).disabled = true;
    btn.textContent = "Logging in...";

    try {
      const user = await loginUser(email, password);
      saveAuth(user.accessToken, user.name, user.credits);

      const apiKey = await createApiKey();
      saveApiKey(apiKey);

      window.location.href = "/index.html";
    } catch (err) {
      let message = "Login failed. Check your email and password.";
      if (err instanceof Error) {
        message = err.message;
      }

      showError("form-message", message);
      (btn as HTMLButtonElement).disabled = false;
      btn.textContent = "Log in";
    }
  });
}
