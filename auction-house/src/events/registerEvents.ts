import { registerUser } from "../api/auth";
import { showError, showSuccess, hideMessage } from "../ui/showMessage";

export function setupRegisterForm() {
  const form = document.getElementById("register-form");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmInput = document.getElementById("confirm-password");

  if (!form || !nameInput || !emailInput || !passwordInput || !confirmInput) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    hideMessage("form-message");

    const name = (nameInput as HTMLInputElement).value.trim();
    const email = (emailInput as HTMLInputElement).value.trim();
    const password = (passwordInput as HTMLInputElement).value;
    const confirm = (confirmInput as HTMLInputElement).value;
    const btn = form.querySelector("button[type=submit]");

    if (!btn) return;

    if (!name) {
      showError("form-message", "Please enter a username.");
      return;
    }

    if (!email.endsWith("@stud.noroff.no")) {
      showError("form-message", "Only @stud.noroff.no email addresses are allowed.");
      return;
    }

    if (password.length < 8) {
      showError("form-message", "Password must be at least 8 characters.");
      return;
    }

    if (password !== confirm) {
      showError("form-message", "Passwords do not match.");
      return;
    }

    (btn as HTMLButtonElement).disabled = true;
    btn.textContent = "Creating account...";

    try {
      await registerUser(name, email, password);

      showSuccess("form-message", "Account created! Taking you to login...");
      (form as HTMLFormElement).reset();

      setTimeout(function () {
        window.location.href = "/login.html";
      }, 2000);
    } catch (err) {
      let message = "Registration failed. Please try again.";
      if (err instanceof Error) {
        message = err.message;
      }

      showError("form-message", message);
      (btn as HTMLButtonElement).disabled = false;
      btn.textContent = "Create account";
    }
  });
}
