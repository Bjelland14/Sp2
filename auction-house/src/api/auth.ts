import { request } from "./httpClient";

export async function registerUser(name: string, email: string, password: string) {
  const result = await request("/auth/register", "POST", { name, email, password }, false);

  if (!result || !result.data) {
    throw new Error("Registration failed");
  }

  return result.data;
}

export async function loginUser(email: string, password: string) {
  const result = await request("/auth/login", "POST", { email, password }, false);

  if (!result || !result.data) {
    throw new Error("Login failed");
  }

  return result.data;
}

export async function createApiKey() {
  const result = await request("/auth/create-api-key", "POST", { name: "auctionhouse-app" }, true);

  if (!result || !result.data || !result.data.key) {
    throw new Error("API key creation failed");
  }

  return result.data.key;
}
