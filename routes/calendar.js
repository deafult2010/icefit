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
    const { title, start, end, borderColor, backgroundColor } = req.body
    if (!title || !start || !end || !borderColor || !backgroundColor) {
        return res.status(422).json({ error: "please add all the fields" })
    }
    req.body.user = req.user._id
    req.body.attending = req.body.extendedProps.attending
    const event = Event(req.body)
    event.save().then(() => {
        Event.findById(event._id)
            .populate({ path: 'attending', select: 'name' })
            .populate({ path: 'user', select: 'name' })
            .then(result => {
                res.json({ event: result });
            })
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
    })
        .populate('attending', 'name')
        .populate('user', 'name')
        .then((events) => {
            res.send(events)
        })
})

router.delete('/delete-event/:id', requireLogin, async (req, res) => {
    try {
        let event = await Event.findById(req.params.id);

        if (!event) return res.status(404).json({ msg: 'Event not found' });

        // Make sure user owns event
        if (event.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ msg: 'Not Authorised' });
        }

        await Event.findByIdAndRemove(req.params.id);

        res.json({ msg: 'Event removed', id: req.params.id });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.put('/attend-event', requireLogin, async (req, res) => {
    console.log(req.user._id)
    console.log(req.body.eventId)
    await Event.findByIdAndUpdate(req.body.eventId, {
        $push: { attending: req.user._id }
    }, {
        new: true
    })
        .populate('attending', 'name')
        .populate('user', 'name')
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            } else {
                console.log(result)
                res.json(result)
            }
        }
        )
})

router.put('/unattend-event', requireLogin, (req, res) => {
    Event.findByIdAndUpdate(req.body.eventId, {
        $pull: { attending: req.user._id }
    }, {
        new: true
    })
        .populate('attending', 'name')
        .populate('user', 'name')
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            } else {
                res.json(result)
            }
        }
        )
})


module.exports = router