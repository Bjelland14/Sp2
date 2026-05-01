import { loginUser, createApiKey } from "../api/auth";
import { saveAuth, saveApiKey } from "../utils/storage";
import { showError, hideMessage } from "../ui/showMessage";

export function setupLoginForm() {
  // Get form and input elements
  const form = document.getElementById("login-form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  if (!form || !emailInput || !passwordInput) return;

  // Handle form submit
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Clear previous messages
    hideMessage("form-message");

    const email = (emailInput as HTMLInputElement).value.trim();
    const password = (passwordInput as HTMLInputElement).value;

    const btn = form.querySelector("button[type=submit]");
    if (!btn) return;

    // Basic validation
    if (!email || !password) {
      showError("form-message", "Please enter both email and password.");
      return;
    }

    // Loading state
    (btn as HTMLButtonElement).disabled = true;
    btn.textContent = "Logging in...";

    try {
      // Login request
      const user = await loginUser(email, password);
      console.log(user); // Debug: see what API returns

      // Save auth (fallback to 1000 credits if missing)
      saveAuth(
        user.accessToken,
        user.name,
        user.credits ?? 1000
      );

      // Create and store API key
      const apiKey = await createApiKey();
      saveApiKey(apiKey);

      // Redirect to homepage
      window.location.href = "./index.html";

    } catch (err) {
      // Error handling
      let message = "Login failed. Check your email and password.";
      if (err instanceof Error) {
        message = err.message;
      }

      showError("form-message", message);

      // Reset button
      (btn as HTMLButtonElement).disabled = false;
      btn.textContent = "Log in";
    }
  });
}