import { registerUser } from "../api/auth";
import { showError, showSuccess, hideMessage } from "../ui/showMessage";

export function setupRegisterForm() {
  // Get form and input elements from the DOM
  const form = document.getElementById("register-form");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmInput = document.getElementById("confirm-password");

  // Exit early if any required element is missing
  if (!form || !nameInput || !emailInput || !passwordInput || !confirmInput) return;

  // Handle form submission
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Hide any previous messages
    hideMessage("form-message");

    // Get user input values
    const name = (nameInput as HTMLInputElement).value.trim();
    const email = (emailInput as HTMLInputElement).value.trim();
    const password = (passwordInput as HTMLInputElement).value;
    const confirm = (confirmInput as HTMLInputElement).value;

    const btn = form.querySelector("button[type=submit]");
    if (!btn) return;

    // Validate username
    if (!name) {
      showError("form-message", "Please enter a username.");
      return;
    }

    // Validate email domain (must be a Noroff student email)
    if (!email.endsWith("@stud.noroff.no")) {
      showError("form-message", "Please use a @stud.noroff.no email address.");
      return;
    }

    // Validate password length
    if (password.length < 8) {
      showError("form-message", "Password must be at least 8 characters.");
      return;
    }

    // Validate password confirmation
    if (password !== confirm) {
      showError("form-message", "Passwords do not match.");
      return;
    }

    // Disable button and show loading state
    (btn as HTMLButtonElement).disabled = true;
    btn.textContent = "Creating account...";

    try {
      // Call API to register the user
      await registerUser(name, email, password);

      // Show success message and reset form
      showSuccess("form-message", "Account created! Taking you to login...");
      (form as HTMLFormElement).reset();

      // Redirect to login page after a short delay
      setTimeout(function () {
        window.location.href = "./login.html";
      }, 2000);

    } catch (err) {
      // Handle API or network errors
      let message = "Registration failed. Please try again.";
      if (err instanceof Error) {
        message = err.message;
      }

      showError("form-message", message);

      // Re-enable button and restore text
      (btn as HTMLButtonElement).disabled = false;
      btn.textContent = "Create account";
    }
  });
}