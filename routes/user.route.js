const express = require("express")
const router = express.Router()
const Entry = require("../models/entry.model")
const User = require("../models/user.model")
const authMiddleware = require("../middleware/auth")

router.post("/new", authMiddleware, async (req, res) => {
    try {
        const { date, title, content } = req.body

        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required." })
        }

        const newEntry = new Entry({
            userId: req.user.id,
            title,
            content,
            date
        })

        await newEntry.save()
        res.status(201).json({ message: "Diary entry saved successfully!" })

    } catch (error) {
        console.error("Error saving entry:", error)
        res.status(500).json({ message: "Internal server error." })
    }
});

router.get('/:entryId', authMiddleware, async (req, res) => {
    try {
        const entry = await Entry.findById(req.params.entryId)
        if (!entry) {
            return res.status(404).json({ message: "Entry not found" })
        }
        res.json(entry)
    } catch (error) {
        console.error("Error fetching entry:", error)
        res.status(500).json({ message: "Server error" })
    }
})

module.exports = router
