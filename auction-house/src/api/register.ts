const API_AUTH_REGISTER = "https://v2.api.noroff.dev/auth/register";

export type RegisterBody = {
  name: string;
  email: string;
  password: string;
};

export async function registerUser(body: RegisterBody) {
  const response = await fetch(API_AUTH_REGISTER, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json?.errors?.[0]?.message || "Could not register user");
  }

  return json.data;
}