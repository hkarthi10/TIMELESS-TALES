const mongoose = require('mongoose')
const express = require('express')
const app = express()
const cors = require('cors')
const User = require('./models/user.model')
const Entry = require('./models/entry.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authMiddleware = require('./middleware/auth')
const routes = require('./routes/user.route')
const morgan = require("morgan")
const path = require("path");
app.use(morgan("dev"))
require('dotenv').config()
const jwtSecret = process.env.JWT_SECRET
const mongourl = process.env.MONGO_URI


app.use(express.static("Diary writing"))


//middleware
app.use(express.json())
app.use(cors())
app.use("/api/entries", routes)

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "Diary writing", "tt.homepage1.html"))})


app.get('/api/protected-route', authMiddleware, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user })
})


const PORT = process.env.PORT || 3000;
mongoose.connect(mongourl)
    .then(() => {
        console.log('Connected to database')
        app.listen(PORT, () => {
            console.log('Server is running on port 3000.')
        })
    })
    .catch((error) => {
        console.error("Failed to connect ", error)
    })



//signup-endpoint
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body
        const existingUser = await User.findOne({ $or: [{ email: email }, { username: username }] })
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email is already exist' })
        }
        const hashedpassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email: email, username: username, password: hashedpassword })
        await newUser.save()

        res.status(201).json({ message: "User registered successfully" })
    } catch (error) {
        res.status(500).json({ message: "server error ", error })
        console.error(error)
    }


})


//signin endpoint
app.post('/api/auth/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email })
        if (!existingUser) {
            return res.status(400).json({ message: "Invalid email or password" })
        }
        const isMatch = await bcrypt.compare(password, existingUser.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" })
        }


        const token = jwt.sign(
            { id: existingUser._id, email: existingUser.email },
            jwtSecret,
            { expiresIn: "1h" }

        )
        res.status(200).json({ message: 'Login successful', token, user: { id: existingUser._id, username: existingUser.username, email: existingUser.email } })
    } catch (error) {
        res.status(400).json({ message: "Server error ", error })
        console.error(error)
    }

})

//fetching entries
app.get('/api/entries', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id
        const entries = await Entry.find({ userId }).sort({ createdAt: -1 })

        res.status(200).json(entries)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server error ", error })
    }

})