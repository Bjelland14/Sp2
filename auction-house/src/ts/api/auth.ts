export async function loginUser(email: string, password: string){ 
    const response = await fetch ("API_URL/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
        });

        return response.json();
}