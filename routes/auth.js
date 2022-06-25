const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const { JWT_SECRET, SENDGRID_API, MYEMAIL, EMAIL_LINK } = require('../config/keys')
const requireLogin = require('../middleware/requireLogin')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')


const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: SENDGRID_API
    }
}))

router.get('/protected', requireLogin, (req, res) => {
    res.send("hello user")
})

router.post('/signup', (req, res) => {
    const { name, email, password, pic } = req.body
    if (!email || !password || !name) {
        return res.status(422).json({ error: "please add all the fields" })
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "user already exists with that email" })
            }
            bcrypt.hash(password, 12)
                .then(hashedpassword => {
                    const user = new User({
                        email: email,
                        password: hashedpassword,
                        name: name,
                        pic: pic
                    })
                    user.save()
                        .then(user => {
                            console.log("sending email")
                            transporter.sendMail({
                                to: user.email,
                                from: MYEMAIL,
                                subject: "ICE FIT Signup Success",
                                html: `<h1>Welcome to ICE FIT</h1> <p>click <a href="${EMAIL_LINK}/signin">here</a> to sign in</p>`
                                // html: `<h1>Welcome to ICE FIT</h1> <p>click <a href="icefit.herokuapp.com/signin">here</a> to sign in</p>`
                            })
                            res.json({ message: "saved successfully" })
                        })
                        .catch(err => {
                            console.log(err)
                        })
                })

        })
        .catch(err => {
            console.log(err)
        })

})

router.post('/signin', (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(422).json({ error: "please add email or password" })
    }
    User.findOne({ email: email })
        .then(savedUser => {
            if (!savedUser) {
                return res.status(422).json({ error: "Invalid email or password" })
            }
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if (doMatch) {
                        //res.json({ message: "sucessfully signed in" })
                        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
                        // const { _id, name, email, followers, following, pic } = savedUser
                        // res.json({ token: token, user: { _id, name, email, followers, following, pic } })
                        res.json({ token: token, user: savedUser })
                    }
                    else {
                        return res.status(422).json({ error: "Invalid email or password" })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        })
})

router.post('/reset-password', (req, res) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    return res.status(422).json({ error: "User does not exist with that email" })
                }
                user.resetToken = token
                user.expireToken = Date.now() + 3600000
                user.save().then((result) => {
                    transporter.sendMail({
                        to: user.email,
                        from: MYEMAIL,
                        subject: "ICE FIT Password Reset",
                        // html: `<h3>Reset Password ICE FIT</h3> <p>click <a href="icefit.herokuapp.com/reset/${token}">here</a> to reset your password</p>`
                        html: `<h3>Reset Password ICE FIT</h3> <p>click <a href="${EMAIL_LINK}/reset/${token}">here</a> to reset your password</p>`
                    })
                    res.json({ message: "check your email" })
                })
            })
    })
})

router.post('/new-password', (req, res) => {
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                return res.status(422).json({ error: "Try again session expired" })
            }
            bcrypt.hash(newPassword, 12).then(hashedpassword => {
                user.password = hashedpassword
                user.resetToken = undefined
                user.expireToken = undefined
                user.save().then((saveduser) => {
                    res.json({ message: "password updated success" })
                })
            })
        }).catch(err => {
            console.log(err)
        })
})

module.exports = router