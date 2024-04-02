async function login(username: string, password: string): Promise<void> {
    try {
        const response = await fetch("/rest/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password
            }),
        });

        const jsonResponse = await response.json();
        console.log("Received data:", jsonResponse);

        if (jsonResponse.success) { 
            const token = jsonResponse.token;
            sessionStorage.setItem("AccessToken", token);
            window.location.href = "/dashboard.html";
        } else {
            console.error("Login failed:", jsonResponse.message);
        }
    } catch (error) {
        console.error("Login error:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm") as HTMLFormElement;
    console.log("Login form:", loginForm);
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault(); 
        console.log("Form submitted"); 
        const formData = new FormData(loginForm);
        const myUsername = formData.get("username") as string;
        const myPassword = formData.get("password") as string;
        console.log(formData);
        
        console.log("Username:", myUsername, "Password:", myPassword); 
        await login(myUsername, myPassword);
    });
});
