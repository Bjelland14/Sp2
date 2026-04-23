const API_AUTH_LOGIN = "https://v2.api.noroff.dev/auth/login";

export type LoginBody = {
  email: string;
  password: string;
};

export type LoginResponse = {
  name: string;
  email: string;
  accessToken: string;
  credits?: number;
  avatar?: {
    url?: string;
    alt?: string;
  };
  banner?: {
    url?: string;
    alt?: string;
  };
};

export async function loginUser(body: LoginBody): Promise<LoginResponse> {
  const response = await fetch(API_AUTH_LOGIN, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json?.errors?.[0]?.message || "Could not log in");
  }

  return json.data;
}