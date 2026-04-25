import { isLoggedIn } from "./storage";

export function authGuard() {
  if (!isLoggedIn()) {
    window.location.href = "/login.html";
  }
}