import { loginUser } from "../api/auth";

export async function handleLogin() {
  const email = "test@stud.noroff.no";
  const password = "1234";

  const data = await loginUser(email, password);

  localStorage.setItem("token", data.accessToken);
}