"use strict";
async function login(username, password) {
    try {
        const response = await fetch("http://155.248.246.152:8081/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MDlkZTQyZGMyYjI3Y2Q4ZjE0MDE3OTEiLCJpYXQiOjE3MDU5MjgxMjN9.k_vS11NYSfhaHHOl7jjUl2t7UCfdTGeythCsk0Hr89g",
            },
            body: JSON.stringify({
                query: `
                    mutation SignIn($username: String!, $password: String!) {
                        SignIn(username: $username, password: $password)
                    }`,
                variables: { username, password },
            }),
        });
        const jsonResponse = await response.json();
        console.log("Received data:", jsonResponse);
        if (jsonResponse.data && jsonResponse.data.SignIn) {
            const token = jsonResponse.data.SignIn;
            sessionStorage.setItem("AccessToken", token);
            window.location.href = "/dashboard.html";
        }
        else {
            console.error("Login failed: Response data does not contain SignIn token", jsonResponse);
        }
    }
    catch (error) {
        console.error("Login error:", error);
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    console.log("Login form:", loginForm);
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        console.log("Form submitted");
        const formData = new FormData(loginForm);
        const myUsername = formData.get("myUsername");
        const myPassword = formData.get("myPassword");
        console.log("Username:", myUsername, "Password:", myPassword);
        await login(myUsername, myPassword);
    });
});
//# sourceMappingURL=login.js.map