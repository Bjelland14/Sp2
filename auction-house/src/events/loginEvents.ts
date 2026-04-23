import { loginUser } from "../api/login";
import { validateLoginForm } from "../utils/validateLoginForm";
import { saveAuth } from "../utils/storage";

export function initLoginPage() {
  const form = document.querySelector<HTMLFormElement>("#loginForm");
  const messageContainer = document.querySelector<HTMLDivElement>("#message");

  if (!form || !messageContainer) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Get form values
    const formData = new FormData(form);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    // Validate input
    const errors = validateLoginForm(email, password);

    if (Object.keys(errors).length > 0) {
      showMessage(Object.values(errors).join("<br>"), "error", messageContainer);
      return;
    }

    try {
      // Call API
      const user = await loginUser({ email, password });

      // Save token + user in localStorage
      saveAuth(user.accessToken, user);

      // Show success message
      showMessage("Login successful!", "success", messageContainer);

      form.reset();

      // Redirect to homepage
      setTimeout(() => {
        window.location.href = "/index.html";
      }, 1500);

    } catch (error) {
      // Show error from API
      showMessage(
        error instanceof Error ? error.message : "Login failed",
        "error",
        messageContainer
      );
    }
  });
}

// Helper function for messages
function showMessage(
  message: string,
  type: "success" | "error",
  container: HTMLDivElement
) {
  container.innerHTML = `
    <div class="alert alert-${type === "success" ? "success" : "danger"}">
      ${message}
    </div>
  `;
}