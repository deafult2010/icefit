const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const eventSchema = new mongoose.Schema({
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    backgroundColor: {
        type: String,
        required: true
    },
    borderColor: {
        type: String,
        required: true
    },
    user: {
        type: ObjectId,
        ref: "User"
    },
    winners: [{ type: ObjectId, ref: "User" }],
    losers: [{ type: ObjectId, ref: "User" }],
    attending: [{ type: ObjectId, ref: "User" }],
    eventCost: {
        type: Number,
        default: 1
    }
})

mongoose.model("Event", eventSchema)