document.getElementById("sign-up-form").addEventListener("submit", async function (e) {
    e.preventDefault()
    const email = document.getElementById("email").value.trim()
    const username = document.getElementById("username").value.trim()
    const password = document.getElementById("password").value
    const confirmpassword = document.getElementById("confirm-password").value


    if (password != confirmpassword) {
        alert("Passwords do not match!")
        return;
    }

    try {
        const API_BASE_URL = window.location.hostname.includes("localhost")
            ? "http://localhost:3000"
            : "https://timeless-tales-n2qj.onrender.com"
        const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, username, password })
        })
        const data = await response.json()

        if (response.ok) {
            alert("Sign-up Successful! redirecting to the Sign-in page!")
            window.location.href="tt.sign-in.html"
        } else {
            alert(data.message || "Sign-up failed!")
        }
    } catch (error) {
        alert("Error connecting to the server!")
        console.error(error)
    }
})

document.getElementById("back-btn").addEventListener("click", function () {
    window.history.back()
})
