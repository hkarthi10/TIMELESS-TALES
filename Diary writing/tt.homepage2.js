document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token")

    if (!token) {
        window.location.href = "tt.sign-in.html"
        return
    }
    try {
        const API_BASE_URL = window.location.hostname.includes("localhost")
            ? "http://localhost:3000"
            : "https://timeless-tales-n2qj.onrender.com/";
        const response = await fetch(`${API_BASE_URL}/api/entries`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        })
        if (!response.ok) {
            throw new Error("Failed to fetch diary entries.")
        }
        const entries = await response.json()
        const diaryTableBody = document.getElementById("diary-table-body")
        diaryTableBody.innerHTML = ""

        entries.forEach(entry => {
            const row = document.createElement("tr")
            row.innerHTML = `
                <td>${new Date(entry.date).toISOString().split("T")[0]}</td>
                <td>${entry.title}</td>
                <td>${entry.content.substring(0, 30)}...</td>
                <td>
                    <button class="view-btn" data-id="${entry._id}">View</button>
                    <button class="delete-btn-table" data-id="${entry._id}">Delete</button>
                </td>
            `

            // View button functionality
            row.querySelector(".view-btn").addEventListener("click", (e) => {
                e.stopPropagation()
                window.location.href = `tt.view-entry.html?entryId=${entry._id}`
            })

            // Delete button functionality
            row.querySelector(".delete-btn-table").addEventListener("click", async (e) => {
                e.stopPropagation()
                if (confirm("Are you sure you want to delete this entry? This action cannot be undone.")) {
                    try {
                        const deleteResponse = await fetch(`${API_BASE_URL}/api/entries/${entry._id}`, {
                            method: "DELETE",
                            headers: { "Authorization": `Bearer ${token}` }
                        })

                        if (!deleteResponse.ok) {
                            throw new Error("Failed to delete the diary entry.")
                        }

                        alert("Entry deleted successfully!")
                        // Remove the row from the table
                        row.remove()
                    } catch (error) {
                        console.error("Error:", error)
                        alert("Could not delete the entry. Try again later.")
                    }
                }
            })

            diaryTableBody.appendChild(row)
        })

    } catch (error) {
        console.error("Error:", error)
    }

    // Handle Add Entry Button
    document.getElementById("add-entry-btn").addEventListener("click", () => {
        window.location.href = "tt.write-entry.html"
    })

    // Handle Logout
    document.getElementById("logout").addEventListener("click", () => {
        localStorage.removeItem("token")
        window.location.href = "tt.sign-in.html"
    })

})
