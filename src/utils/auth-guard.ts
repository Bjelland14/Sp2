import { isLoggedIn } from "./storage";

export function requireAuth(): boolean {
  if (!isLoggedIn()) {
    const redirect = encodeURIComponent(
      window.location.pathname + window.location.search
    );
    window.location.href = `/auth/login.html?redirect=${redirect}`;
    return false;
  }
  return true;
}

export function redirectIfLoggedIn(to = "/"): boolean {
  if (isLoggedIn()) {
    window.location.href = to;
    return true;
  }
  return false;
}
