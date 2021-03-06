const express = require('express')
const app = express()
const mongoose = require('mongoose')
const router = require('./auth')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post")
const User = mongoose.model("User")

router.get('/user/:id', requireLogin, (req, res) => {
    User.findOne({ _id: req.params.id })
        .select("-password")
        .then((user) => {
            Post.find({ postedBy: req.params.id })
                .populate("postedBy", "_id name")
                .exec((err, posts) => {
                    if (err) {
                        return res.status(422).json({ error: err })
                    }
                    res.json({ user, posts })
                })
        })
        .catch(err => {
            return res.status(404).json({ error: "User not found" })
        })
})

router.put('/follow', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.followId, {
        $push: { followers: req.user._id }
    }, {
        new: true
    }, (err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        }
        User.findByIdAndUpdate(req.user._id, {
            $push: { following: req.body.followId }
        }, { new: true }).select("-password").then(result => {
            res.json(result)
        }).catch(err => {
            return res.status(422).json({ error: err })
        })
    })
})

router.put('/unfollow', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.unfollowId, {
        $pull: { followers: req.user._id }
    }, {
        new: true
    }, (err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        }
        User.findByIdAndUpdate(req.user._id, {
            $pull: { following: req.body.unfollowId }
        }, { new: true }).select("-password").then(result => {
            res.json(result)
        }).catch(err => {
            return res.status(422).json({ error: err })
        })
    })
})

router.put('/updatepic', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.user._id, { $set: { pic: req.body.pic } }, { new: true }, (err, result) => {
        if (err) {
            return res.status(422).json({ error: "pic cannot post" })
        }
        res.json(result)
    })
})

router.put('/updateemail', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.user._id, { $set: { email: req.body.email } }, { new: true }, (err, result) => {
        if (err) {
            return res.status(422).json({ error: "email cannot update" })
        }
        res.json(result)
    })
})

router.post('/search-users', (req, res) => {
    let userPattern = new RegExp("^" + req.body.query, 'i')
    User.find({ email: { $regex: userPattern } })
        // .select("_id name email")
        .then(user => {
            res.json({ user })
        }).catch(err => {
            console.log(err)
        })
})

router.post('/search-names', (req, res) => {
    let userPattern = new RegExp("^" + req.body.query, 'i')
    User.find({ name: { $regex: userPattern } })
        // .select("_id name email")
        .sort([['name', 'desc']])
        .then(user => {
            res.json({ user })
        }).catch(err => {
            console.log(err)
        })
})

router.put('/add-credits', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.user._id, { $set: { credits: req.body.credits } }, { new: true }, (err, result) => {
        if (err) {
            return res.status(422).json({ error: "credits cannot update" })
        }
        res.json(result)
    })
})

router.put('/updateRating', requireLogin, (req, res) => {
    console.log(req.body.player)
    console.log(req.user)
    User.findByIdAndUpdate(req.body.player._id, {
        $set: {
            badmintonRating: req.body.player.badmintonRating,
            tennisRating: req.body.player.tennisRating,
            tableTennisRating: req.body.player.tableTennisRating,
            chessRating: req.body.player.chessRating,
        }
    }, { new: true }, (err, result) => {
        if (err) {
            return res.status(422).json({ error: "ratings cannot update" })
        }
        res.json(result)
    })
})

module.exports = router