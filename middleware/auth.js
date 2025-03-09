const jwt = require('jsonwebtoken')
const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. No token provided.' })
    }

    const token = authHeader.split(' ')[1] // Extract the token part

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next() // Move to the next middleware or route handler
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token.' })
        console.error(error)
    }
}

module.exports = authMiddleware