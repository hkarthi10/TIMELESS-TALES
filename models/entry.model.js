const mongoose = require('mongoose')

const entrySchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    title:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    }
})


const entry = mongoose.model('entry', entrySchema)
module.exports = entry