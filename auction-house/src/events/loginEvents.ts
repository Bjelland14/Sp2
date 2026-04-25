import { loginUser } from "../api/login";
import { getProfile } from "../api/profile";
import { createApiKey } from "../api/apiKey";
import { validateLoginForm } from "../utils/validateLoginForm";
import { saveAuth, setApiKey } from "../utils/storage";

export function initLoginPage() {
  const form = document.querySelector<HTMLFormElement>("#loginForm");
  const messageContainer = document.querySelector<HTMLDivElement>("#message");

  if (!form || !messageContainer) return;

  form.noValidate = true;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const errors = validateLoginForm(email, password);

    if (Object.keys(errors).length > 0) {
      showMessage(Object.values(errors).join("<br>"), "error", messageContainer);
      return;
    }

    try {
      // 1. Login
      const loginData = await loginUser({ email, password });

      // 2. Create API key
      const apiKey = await createApiKey(loginData.accessToken);
      setApiKey(apiKey);

      // 3. Fetch full profile (credits)
      const profile = await getProfile(
        loginData.name,
        loginData.accessToken,
        apiKey
      );

      // 4. Save auth
      saveAuth(loginData.accessToken, profile);

      showMessage("Login successful! Redirecting...", "success", messageContainer);

      form.reset();

      setTimeout(() => {
        window.location.href = "/index.html";
      }, 1200);

    } catch (error) {
      console.error("Login error:", error);

      showMessage(
        error instanceof Error ? error.message : "Login failed",
        "error",
        messageContainer
      );
    }
  });
}

function showMessage(
  message: string,
  type: "success" | "error",
  container: HTMLDivElement
) {
  container.innerHTML = `
    <div class="alert alert-${type === "success" ? "success" : "danger"} mb-3">
      ${message}
    </div>
  `;
}