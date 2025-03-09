document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token")
    if (!token) {
        window.location.href = "tt.sign-in.html"
        return
    }
    const urlParams = new URLSearchParams(window.location.search)
    const entryId = urlParams.get("entryId")
    if (!entryId) {
        alert('Invalid entry ID')
        window.location.href = "tt.homepage2.html"
        return
    }
    try {
        const response = await fetch(`http://localhost:3000/api/entries/${entryId}`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        })

        if (!response.ok) {
            throw new Error("Failed to fetch the diary entry.")
        }

        const entry = await response.json()

        // Display entry details
        document.getElementById("entry-title").textContent = entry.title
        document.getElementById("entry-date").textContent = formatDate(entry.date)
        document.getElementById("diary-content").textContent = entry.content

    } catch (error) {
        console.error("Error:", error)
        alert("Could not load the entry. Try again later.")
        window.location.href = "tt.homepage2.html"
    }
})

// Function to format the date properly
function formatDate(dateString) {
    if (!dateString) return "Unknown Date"

    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "Invalid Date"

    return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    })
}