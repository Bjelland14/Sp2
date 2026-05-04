import { loginUser, createApiKey } from "../api/auth";
import { getProfile } from "../api/profile";
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

    if (!email.endsWith("@stud.noroff.no")) {
      showError("form-message", "Please use a @stud.noroff.no email address.");
      return;
    }

    (btn as HTMLButtonElement).disabled = true;
    btn.textContent = "Logging in...";

    try {
      // 1. Login user
      const user = await loginUser(email, password);

      // 2. Save token FIRST (required for authenticated requests)
      saveAuth(user.accessToken, user.name, 0);

      // 3. Now we can create API key
      const apiKey = await createApiKey();
      saveApiKey(apiKey);

      // 4. Fetch real credits from profile
      const profile = await getProfile(user.name);

      // 5. Save correct credits
      saveAuth(user.accessToken, user.name, profile.credits);

      // 6. Redirect
      window.location.href = "./index.html";

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