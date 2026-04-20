import { api } from "../http";
import { setToken, setApiKey, setUser, clearAuth } from "../utils/storage";
import type { ApiResponse, User, Media } from "../types";

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  bio?: string;
  avatar?: Media;
  banner?: Media;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface ApiKeyResponse {
  data: { key: string };
}

export async function register(payload: RegisterPayload): Promise<ApiResponse<User>> {
  return api.post<ApiResponse<User>>("/auth/register", payload);
}

export async function login({ email, password }: LoginPayload): Promise<User> {
  const res = await api.post<ApiResponse<User>>("/auth/login", {
    email,
    password,
  });

  const user = res.data;
  if (!user.accessToken) throw new Error("No access token received");

  setToken(user.accessToken);
  setUser({
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    banner: user.banner,
    credits: user.credits,
    bio: user.bio,
  });

  await ensureApiKey(user.accessToken);
  return user;
}

async function ensureApiKey(token: string): Promise<void> {
  try {
    const res = await fetch("https://v2.api.noroff.dev/auth/create-api-key", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: "bidhub-key" }),
    });
    const data: ApiKeyResponse = await res.json();
    if (data?.data?.key) {
      setApiKey(data.data.key);
    }
  } catch {
    // Non-fatal — public endpoints still work without an API key
  }
}

export function logout(): void {
  clearAuth();
  window.location.href = "/";
}
