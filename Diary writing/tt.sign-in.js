
document.addEventListener("DOMContentLoaded", () => {
    const signinForm = document.getElementById("sign-in-form")

    signinForm.addEventListener("submit", async (event) => {
        event.preventDefault()
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value

        try {
            const response = await fetch("http://localhost:3000/api/auth/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            })
            const data = await response.json()
            if (response.ok) {
                alert('Sign-in successful!')
                localStorage.setItem("token", data.token)
                window.location.href = "tt.homepage2.html"
            }
            else {
                alert(data.message || "Sign-in failed. Please try again.")
            }
        } catch (error) {
            console.error("Error:", error)
            alert("An error occurred. Please try again later.")
        }
    })
    document.getElementById("back-btn").addEventListener("click", () => {
        window.location.href = "tt.homepage1.html"
    })
})