const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const axios = require('axios')
const cors = require('cors')
const aesEncryptor = require('./aes256Encrypt')
const shaEncryptor = require('./sha256Encrypt')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const jwt = require('jsonwebtoken')
const twoFactor = require('node-2fa')

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "*sidd1005ha_2003",
    database: "master_schema",
})

db.connect((err) => {
    if (err) {
        throw err
    }
    console.log("Connected to DB")
})

app = express()
app.use(bodyParser.json())
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
}))
app.use(cookieParser())
app.use(session({
    key: "userToken",
    secret: "testSecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60 * 60 * 24
    }
}))

app.get('/api/fetchBanks', async (req, res) => {
    try {
        const banks = await axios.get("https://enachuat.npci.org.in:8086/apiservices_new/getLiveBankDtls")
        return res.send(banks.data.liveBankList)
    } catch (e) {
        console.log(e)
    }
})

app.post('/api/aes256encrypt', (req, res) => res.send(aesEncryptor(req.body)))

app.post('/api/sha256encrypt', (req, res) => res.send(shaEncryptor(req.body)))

app.get('/api/login', (req, res) => {
    if (req.session.user)
        res.send({ isLoggedIn: true, user: req.session.user })
    else
        res.send({ isLoggedIn: false, user: req.session.user })
})

app.post('/api/verifyUser', (req, res) => {
    console.log(req.body)
    const q = `select * from admin where username = '${req.body.name}';`
    try {
        db.query(q, async (err, result) => {
            if (err) {
                return res.send({ error: err })
            }

            if (result.length > 0) {
                const comparePassword = await bcrypt.compare(req.body.password, result[0].password)
                if (comparePassword) {

                    const token = jwt.sign({ name: req.body.username }, "swagatham")

                    const newSecret = twoFactor.generateSecret({
                        name: "Swagatham Non Profit",
                        account: req.body.username
                    })

                    // console.log(newSecret.secret)

                    const q = "update admin set secret = ? where username = ?;"

                    db.query(q, [newSecret.secret, req.body.name], (err, result) => {
                        if (err) {
                            console.log(err)
                            return res.send(err)
                        }
                        else
                            console.log("Secret Stored")
                    })

                    return res.send({ isValidUser: true, token, qr: newSecret.qr })

                } else {
                    return res.status(401).send({ isValidUser: false, msg: "Invalid User Credentials" })
                }
            } else {
                return res.status(404).send({ isValidUser: false, msg: "Invalid User Credentials" })
            }
        })
    } catch (E) {
        return res.send({ error: E })
    }
})

app.post('/api/2FAregister', (req, res) => {
    // console.log(req.body.username)
    const q = 'select * from admin where username = ?;'
    db.query(q, req.body.username, async (err, result) => {
        if (err) {
            // console.log(err)
            return res.send({ error: err })
        }
        console.log(result)
        const token = result[0].secret
        console.log(result[0].secret)
        const match = await twoFactor.verifyToken(token.trim(), req.body.code)
        console.log(match)
        if (!match)
            return res.status(401).send("Incorrect Token")
        else {
            return res.send({ registrationComplete: true })
        }
    }
    )
})


app.post('/api/login', (req, res) => {
    const q = `select * from admin where username = '${req.body.username}';`
    // console.log(req.body)
    db.query(q, async (err, result) => {
        if (err) {
            // console.log(err)
            return res.send({ error: err })
        }
        // console.log(result)
        if (result.length > 0) {
            const comparePassword = await bcrypt.compare(req.body.password, result[0].password)
            if (comparePassword) {
                req.session.user = result
                res.send(result)
            } else {
                return res.status(401).send("Invalid Credentials")
            }
        } else {
            return res.status(404).send("No such User")
        }
    })
})

app.get('/api/getCompanyCreds', (req, res) => {
    const q = "select * from master;"
    db.query(q, (err, result) => {
        if (err) {
            console.log(err)
            return res.send({ error: err })
        }
        console.log(result)
        return res.send(result)
    })
})

app.listen(3001, () => console.log("Server running!"))