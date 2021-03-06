const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const axios = require('axios')
const cors = require('cors')
const aesEncryptor = require('../utils/aes256Encrypt')
const shaEncryptor = require('../utils/sha256Encrypt')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const twoFactor = require('node-2fa')
const winston = require('winston')
const mySQLTransport = require('winston-mysql')
const requestIp = require('request-ip')
require('dotenv').config()

// Logger
const options = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'logs',
    table: 'logs',
    fields: { level: 'mylevel', meta: 'metadata', message: 'log', timestamp: 'addDate' },
    level: 'info'
}

const newLogger = () => {
    return winston.createLogger({
        level: 'info',
        format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
        transports: [
            new winston.transports.File({ filename: 'error.log', level: 'error' }),
            new winston.transports.File({ filename: 'info.log', level: 'info' }),
            new mySQLTransport(options)
        ]
    })
}

const logger = newLogger()

// Database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "eNach",
})

const logDb = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "logs",
})

db.connect((err) => {
    if (err) {
        // console.log(err.message)
        logger.error(err.message)
        throw err
    }
    console.log({ message: "Connected to DB" })
    logger.info({ message: "Connected to DB", requestBy: "-" })
})

logDb.connect((err) => {
    if (err) {
        // console.log(err.message)
        logger.error((err.message))
        throw err
    }
    console.log("Connected to Log DB")
    logger.info({ message: "Connected to Log DB", requestBy: "-" })
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
        expires: 1000 * 60 * 60
    }
}))

app.get('/api/fetchBanks', async (req, res) => {
    const ip = requestIp.getClientIp(req)
    // console.log(req.session.user)
    try {
        const banks = await axios.get("https://enachuat.npci.org.in:8086/apiservices_new/getLiveBankDtls")
        logger.info(({ message: "Request to Fetch Bank Data", requestBy: (req.session.user.email), ip }))
        return res.send(banks.data.liveBankList)
    } catch (e) {
        logger.error((e))
        return res.status(401).send({ message: e.message })
    }
})

app.post('/api/aes256encrypt', (req, res) => {
    const ip = requestIp.getClientIp(req)
    logger.info(({ message: "Request for aes256 Encryption", requestBy: (req.session.user.email), data: req.body, ip }))
    return res.send(aesEncryptor(req.body))
})

app.post('/api/sha256encrypt', (req, res) => {
    const ip = requestIp.getClientIp(req)
    logger.info(({ message: "Request for sha256 Encryption", requestBy: (req.session.user.email), data: req.body, ip }))
    return res.send(shaEncryptor(req.body))
})

app.get('/api/login', (req, res) => {
    // console.log(req.session.user)
    if (req.session.user)
        res.send({ isLoggedIn: true, user: req.session.user })
    else
        res.send({ isLoggedIn: false, user: req.session.user })
})

app.post('/api/verifyUser', (req, res) => {
    console.log(req.body)
    // console.log(requestIp.getClientIp(req))
    const ip = requestIp.getClientIp(req)
    const q = `select * from admin where email = '${req.body.email}';`
    try {
        db.query(q, async (err, result) => {
            if (err) {
                logger.error((err.message))
                return res.send({ error: err })
            }

            if (result.length > 0) {
                console.log(result)
                const comparePassword = await bcrypt.compare(req.body.password, result[0].password)
                if (comparePassword) {
                    // console.log(req.body.name)
                    const newSecret = twoFactor.generateSecret({
                        name: "Swagatham Non Profit",
                        account: result[0].name
                    })

                    logger.info(({ message: "User has scanned QR", user: req.body.name, ip }))
                    // console.log(newSecret.secret)

                    return res.send({ isValidUser: true, qr: newSecret.qr, secret: newSecret.secret })

                } else {
                    logger.info(({ message: "Invalid Email and Password entered", email: req.body.email, ip }))
                    return res.status(401).send({ isValidUser: false, message: "Invalid User Credentials" })
                }
            } else {
                logger.info(({ message: "Invalid email and Password entered", email: req.body.email, ip }))
                return res.status(404).send({ isValidUser: false, message: "Invalid User Credentials" })
            }
        })
    } catch (E) {
        logger.error((E.message))
        return res.send({ error: E })
    }
})

app.post('/api/2FAregister', async (req, res) => {
    // console.log(req.body.username)
    const ip = requestIp.getClientIp(req)
    const q = "update admin set secret = ? where email = ?;"

    db.query(q, [req.body.secret, req.body.email], (err, result) => {
        if (err) {
            // console.log(err)
            logger.error((err))
            return res.send(err)
        }
    })

    // console.log(result)
    const token = req.body.secret
    // console.log(result[0].secret)
    const match = await twoFactor.verifyToken(token.trim(), req.body.code)
    // console.log(match)
    if (!match) {
        logger.info(({ message: "Invalid Token Entered during 2FA Registration", requestBy: req.body.email, ip }))
        return res.status(401).send("Incorrect Token")
    }
    else {
        logger.info(({ message: "New User has registered for two factor authentication", email: req.body.email, ip }))
        return res.send({ registrationComplete: true })
    }
})


app.post('/api/login', (req, res) => {
    const ip = requestIp.getClientIp(req)
    const q = `select * from admin where email = '${req.body.email}';`
    console.log(req.body)
    db.query(q, async (err, result) => {
        if (err) {
            // console.log(err)
            logger.error((err.message))
            return res.send({ error: err })
        }
        console.log(result)
        if (result.length > 0) {
            const comparePassword = await bcrypt.compare(req.body.password, result[0].password)
            if (comparePassword) {
                // req.session.user = result
                logger.info(({ message: "Attempt to login. Valid Credentials", requestBy: req.body.email, ip }))
                res.send({
                    isUserValid: true,
                    user: result[0]
                })
            } else {
                logger.info(({ message: "Attempt to login. Invalid Credentials", requestBy: req.body.email, ip }))
                return res.status(401).send("Invalid Credentials")
            }
        } else {
            return res.status(404).send("No such User")
        }
    })
})

app.post('/api/2falogin', (req, res) => {
    const ip = requestIp.getClientIp(req)
    const q = "select secret from admin where email = ?;"
    db.query(q, req.body.user.email, (err, result) => {
        if (err) {
            logger.error((err.message))
            return res.send(err)
        }
        const secret = result[0]
        // console.log(secret)
        const match = twoFactor.verifyToken(secret.secret.trim(), req.body.twoFactorCode)
        if (match) {
            logger.info(({ message: "Attempt to login(2FA Code). Valid Code Entered. User Logged In", requestBy: req.body.user.email, ip }))
            const email = req.body.user.email
            const name = req.body.user.name
            req.session.user = { email, name }
            // console.log(req.session.user)
            return res.send(true)
        }
        logger.info(({ message: "Attempt to login(2FA Code). Invalid Code Entered. User Denied Access", requestBy: req.body.user.email, ip }))
        return res.status(401).send("Incorrect Token")
    })
})

app.get('/api/logout', (req, res) => {
    const ip = requestIp.getClientIp(req)
    // console.log(req.session.user)
    // const email = req.session.user.email
    // const name = req.session.user.name 
    logger.info(({ message: "User has logged out of the system", ip }))
    res.clearCookie("userToken")
    res.send("Successfully logged out")
})

app.get('/api/getCompanyCreds', (req, res) => {
    const ip = requestIp.getClientIp(req)
    const q = "select * from master;"
    db.query(q, (err, result) => {
        if (err) {
            logger.error((err.message))
            return res.send({ error: err })
        }
        // console.log(result)
        logger.info(({ message: "Company Creds Accessed", requestBy: (req.session.user.email), ip }))
        return res.send(result)
    })
})

app.post('/api/getLogs', (req, res) => {
    const ip = requestIp.getClientIp(req)
    const q = "select * from logs where addDate >= ? and addDate<= ?;"

    const start = req.body.startDate + ' 00:00:00'
    const end = req.body.endDate + ' 23:59:59'
    logDb.query(q, [start, end], (err, result) => {
        if (err) {
            logger.error((err.message))
            return res.send({ error: err })
        }
        logger.info(({ message: "Log DB was accessed", requestBy: (req.session.user.email), ip }))
        return res.send(result)
    })
})

app.get('/api/staff_status', (req, res) => {
    const ip = requestIp.getClientIp(req)
    const q = "select * from admin where email = ?"
    db.query(q, req.session.user.email, function (err, result) {
        if (err) {
            logger.error(err.message)
            return res.send({ error: err })
        }
        console.log(result)
        return res.send({ staff_status: result[0].staff_status })
    })
})

app.post('/api/sendRequest', (req, res) => {
    axios.post('https://emandateut.hdfcbank.com/Emandate.aspx', req.body).then(resp => {
        console.log("response recieved")
        console.log(resp)
    }).catch(e => console.log(e))
})

app.listen(3001, () => console.log("Server running!"))