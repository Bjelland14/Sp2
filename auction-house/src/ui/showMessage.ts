export function showError(elementId: string, message: string) {
  const el = document.getElementById(elementId);
  if (!el) return;

  el.textContent = message;
  el.classList.remove("alert-success");
  el.classList.add("alert", "alert-danger");
  el.removeAttribute("hidden");
}

export function showSuccess(elementId: string, message: string) {
  const el = document.getElementById(elementId);
  if (!el) return;

  el.textContent = message;
  el.classList.remove("alert-danger");
  el.classList.add("alert", "alert-success");
  el.removeAttribute("hidden");
}

export function hideMessage(elementId: string) {
  const el = document.getElementById(elementId);
  if (!el) return;

  el.setAttribute("hidden", "true");
  el.textContent = "";
}
