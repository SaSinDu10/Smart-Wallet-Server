"use strict";
async function login(username, password) {
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
        if (response.ok) {
            const token = jsonResponse.token;
            sessionStorage.setItem("AccessToken", token);
            window.location.href = "/html/dashboard.html";
        }
        else {
            console.error("Login failed:", jsonResponse.message);
        }
    }
    catch (error) {
        console.error("Network error:", error);
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    console.log("Login form:", loginForm);
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        console.log("Form submitted");
        const formData = new FormData(loginForm);
        const myUsername = formData.get("username");
        const myPassword = formData.get("password");
        console.log(formData);
        console.log("Username:", myUsername, "Password:", myPassword);
        await login(myUsername, myPassword);
    });
});
//# sourceMappingURL=login.js.map