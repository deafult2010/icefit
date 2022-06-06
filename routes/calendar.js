const express = require('express')
const app = express()
const mongoose = require('mongoose')
const moment = require('moment')
const router = require('./auth')
const requireLogin = require('../middleware/requireLogin')
const Event = mongoose.model("Event")

// router.post('/create-event', requireLogin, async (req, res) => {
// router.post('/create-event', async (req, res) => {
//     const event = Event(req.body)
//     await event.save();
//     res.sendStatus(201);
// })

router.post('/create-event', requireLogin, (req, res) => {
    const { title, start, end } = req.body
    if (!title || !start || !end) {
        return res.status(422).json({ error: "please add all the fields" })
    }
    const event = Event(req.body)
    event.save().then(() => {
        res.sendStatus(201);
    });
})

// router.get('/get-events', requireLogin, async (req, res) => {
// router.get('/get-events', async (req, res) => {
//     const events = await Event.find({
//         start: { $gte: moment(req.query.start).toDate() },
//         end: { $lte: moment(req.query.end).toDate() }
//     })
//     res.send(events)
// })

router.get('/get-events', requireLogin, (req, res) => {
    Event.find({
        start: { $gte: moment(req.query.start).toDate() },
        end: { $lte: moment(req.query.end).toDate() }
    }).then((events) => {
        res.send(events)
    })
})


module.exports = router