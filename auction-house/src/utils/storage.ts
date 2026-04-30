export function getToken() {
  return localStorage.getItem("token");
}

export function getApiKey() {
  return localStorage.getItem("apiKey");
}

export function getUserName() {
  return localStorage.getItem("userName");
}

export function getCredits() {
  const stored = localStorage.getItem("credits");
  return stored ? Number(stored) : 0;
}

export function saveAuth(token: string, userName: string, credits: number) {
  localStorage.setItem("token", token);
  localStorage.setItem("userName", userName);
  localStorage.setItem("credits", String(credits));
}

export function saveApiKey(key: string) {
  localStorage.setItem("apiKey", key);
}

export function saveCredits(credits: number) {
  localStorage.setItem("credits", String(credits));
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("apiKey");
  localStorage.removeItem("userName");
  localStorage.removeItem("credits");
}
