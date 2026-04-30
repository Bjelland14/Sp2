import { API_BASE } from "../config";
import { getToken, getApiKey } from "../utils/storage";

export async function request(
  path: string,
  method: string,
  body: any,
  needsAuth: boolean
) {
  const headers: any = {
    "Content-Type": "application/json",
  };

  const apiKey = getApiKey();

  if (apiKey) {
    headers["X-Noroff-API-Key"] = apiKey;
  }

  if (needsAuth) {
    const token = getToken();

    if (!token) {
      throw new Error("You must be logged in to do this.");
    }

    headers["Authorization"] = "Bearer " + token;
  }

  const options: any = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(API_BASE + path, options);

  if (!response.ok) {
    let message = "Something went wrong";

    try {
      const errorData = await response.json();

      if (errorData.errors && errorData.errors[0] && errorData.errors[0].message) {
        message = errorData.errors[0].message;
      }
    } catch {
      // Keep default message if the API does not return JSON
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
