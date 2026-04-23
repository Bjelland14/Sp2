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
  console.log("Register response:", json); // 🔍 DEBUG

  if (!response.ok) {
    const message =
      json?.errors?.[0]?.message ||
      json?.message ||
      "Could not register user";

    throw new Error(message);
  }

  return json.data;
}