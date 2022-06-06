const sslRedirect = require('heroku-ssl-redirect').default
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 5000
const { MONGOURI } = require('./config/keys')

mongoose.connect(MONGOURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
mongoose.connection.on('connected', () => {
    console.log("connected to mongo yeah")
})
mongoose.connection.on('error', (err) => {
    console.log("err connecting", err)
})

require('./models/user')
require('./models/post')
require('./models/event')


app.use(sslRedirect())
app.use(bodyParser.json())
app.use(cors())
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))
app.use(require('./routes/calendar'))

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    );
}


app.listen(PORT, () => {
    console.log("server is running on", PORT)
})