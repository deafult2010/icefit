const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: String,
    expireToken: Date,
    pic: {
        type: String,
        default: "https://res.cloudinary.com/dmla0lcbu/image/upload/v1653315054/jhra2jgwiikt8guvdexs.jpg"
    },
    followers: [{ type: ObjectId, ref: "User" }],
    following: [{ type: ObjectId, ref: "User" }],
    badmintonRating: {
        type: Number,
        default: 1200
    },
    tennisRating: {
        type: Number,
        default: 1200
    },
    tableTennisRating: {
        type: Number,
        default: 1200
    },
    chessRating: {
        type: Number,
        default: 1200
    },
    credits: {
        type: Number,
        default: 1
    },
    admin: {
        type: Boolean,
        default: false
    }
})

mongoose.model("User", userSchema)