import { registerUser } from "../api/register";
import { validateRegisterForm } from "../utils/validateRegisterForm";

const form = document.querySelector<HTMLFormElement>("#registerForm");
const messageContainer = document.querySelector<HTMLDivElement>("#message");

if (form && messageContainer) {
  form.noValidate = true;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    clearMessage();

    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const errors = validateRegisterForm(name, email, password);

    if (Object.keys(errors).length > 0) {
      showErrors(errors);
      return;
    }

    try {
      await registerUser({ name, email, password });

      showMessage("Registration successful! Redirecting to login...", "success");

      form.reset();

      setTimeout(() => {
        window.location.href = "/login.html";
      }, 1000);
    } catch (error) {
      showMessage(
        error instanceof Error ? error.message : "Registration failed",
        "error"
      );
    }
  });
}

function showMessage(message: string, type: "success" | "error") {
  if (!messageContainer) return;

  messageContainer.innerHTML = `
    <div class="alert alert-${type === "success" ? "success" : "danger"} mb-3">
      ${message}
    </div>
  `;
}

function clearMessage() {
  if (!messageContainer) return;
  messageContainer.innerHTML = "";
}

function showErrors(errors: Record<string, string>) {
  const messages = Object.values(errors).join("<br>");
  showMessage(messages, "error");
}