import { getToken, getApiKey } from "./storage";

export function requireLogin() {
  const token = getToken();
  const apiKey = getApiKey();

  if (!token || !apiKey) {
    window.location.replace("/login.html");
  }
}

export function redirectIfLoggedIn() {
  const token = getToken();
  const apiKey = getApiKey();

  if (token && apiKey) {
    window.location.replace("/index.html");
  }
}
