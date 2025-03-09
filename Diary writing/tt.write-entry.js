document.addEventListener("DOMContentLoaded", () => {
    const dairyForm = document.getElementById('diary-form')
    const entryDate = document.getElementById('entry-date')
    const clearbutton = document.getElementById('clear-btn')
    const homeButton = document.getElementById('homebutton')

    const today = new Date().toISOString().split("T")[0]
    entryDate.value = today

    dairyForm.addEventListener('submit', async (event) => {
        event.preventDefault()
        const title = document.getElementById('entry-title').value
        const content = document.getElementById('diary-content').value
        const token = localStorage.getItem('token')

        try {
            const response = await fetch('http://localhost:3000/api/entries/new', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ title, content, today }),
            })
            const data = await response.json()

            if (response.ok) {
                alert('Entry saved successfully')
                window.location.href = 'tt.homepage2.html'
            } else {
                alert(data.message || "Failed to save entry.")
            }


        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again.")
        }
    })
    clearbutton.addEventListener("click", () => {
        document.getElementById("entry-title").value = "";
        document.getElementById("diary-content").value = "";
    })

    // Redirect to homepage
    homeButton.addEventListener("click", () => {
        window.location.href = "tt.homepage2.html";
    })
})