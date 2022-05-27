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
const jwt = require('jsonwebtoken')
const twoFactor = require('node-2fa')
const winston = require('winston')
const mySQLTransport = require('winston-mysql')

// Logger
const options = {
    host: 'localhost',
    user: 'root',
    password: '*sidd1005ha_2003',
    database: 'logs',
    table: 'logs',
    fields: {level: 'mylevel', meta: 'metadata', message: 'log', timestamp: 'addDate'}
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
    host: "localhost",
    user: "root",
    password: "*sidd1005ha_2003",
    database: "master_schema",
})

db.connect((err) => {
    if (err) {
        logger.error(err)
        throw err
    }
    console.log("Connected to DB")
    logger.info("Connected to DB")
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
        expires: 1000 * 60 * 5
    }
}))

app.get('/api/fetchBanks', async (req, res) => {
    try {
        const banks = await axios.get("https://enachuat.npci.org.in:8086/apiservices_new/getLiveBankDtls")
        logger.info("Fetched bank Data")
        return res.send(banks.data.liveBankList)
    } catch (e) {
        logger.log(e)
        console.log(e)
    }
})

app.post('/api/aes256encrypt', (req, res) => {
    logger.info(JSON.stringify({msg: "Request for aes256 Encryption", requestBy: req.session.user, data: req.body}))
    return res.send(aesEncryptor(req.body))
})

app.post('/api/sha256encrypt', (req, res) => {
    logger.info(JSON.stringify({msg: "Request for sha256 Encryption", requestBy: req.session.user, data: req.body}))
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
    // console.log(req.body)
    const q = `select * from admin where username = '${req.body.name}';`
    try {
        db.query(q, async (err, result) => {
            if (err) {
                logger.error(err)
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
                    
                    logger.log(JSON.stringify({msg: "User has scanned QR", user: req.body.username}))
                    // console.log(newSecret.secret)

                    const q = "update admin set secret = ? where username = ?;"

                    db.query(q, [newSecret.secret, req.body.name], (err, result) => {
                        if (err) {
                            console.log(err)
                            logger.log(err)
                            return res.send(err)
                        }
                        // else
                            // console.log("Secret Stored")
                    })

                    return res.send({ isValidUser: true, token, qr: newSecret.qr })

                } else {
                    logger.info(JSON.stringify({ msg: "Invalid Username and Password entered", username: req.body.username }))
                    return res.status(401).send({ isValidUser: false, msg: "Invalid User Credentials" })
                }
            } else {
                logger.info(JSON.stringify({ msg: "Invalid Username and Password entered", username: req.body.username }))
                return res.status(404).send({ isValidUser: false, msg: "Invalid User Credentials" })
            }
        })
    } catch (E) {
        logger.error(E)
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
        // console.log(match)
        if (!match){
            logger.info(JSON.stringify({msg: "Invalid Token Entered during 2FA Registration", requestBy: req.body.username}))
            return res.status(401).send("Incorrect Token")
        }
        else {
            logger.info(JSON.stringify({msg: "New User has registered for two factor authentication", username: req.body.username}))
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
            logger.error(err)
            return res.send({ error: err })
        }
        // console.log(result)
        if (result.length > 0) {
            const comparePassword = await bcrypt.compare(req.body.password, result[0].password)
            if (comparePassword) {
                // req.session.user = result
                logger.info(JSON.stringify({ msg: "Attempt to login. Valid Credentials", requestBy: req.body.username}))
                res.send({
                    isUserValid: true,
                    user: result[0]
                })
            } else {
                logger.info(JSON.stringify({ msg: "Attempt to login. Invalid Credentials", requestBy: req.body.username}))
                return res.status(401).send("Invalid Credentials")
            }
        } else {
            return res.status(404).send("No such User")
        }
    })
})

app.post('/api/2falogin', (req, res) => {
    const q = "select secret from admin where username = ?;"
    db.query(q, req.body.user.username, (err, result) => {
        if (err) {
            return res.send(err)
            logger.error(err)
        }
        const secret = result[0]
        console.log(secret)
        const match = twoFactor.verifyToken(secret.secret.trim(), req.body.twoFactorCode)
        if (match) {
            logger.info(JSON.stringify({ msg: "Attempt to login(2FA Code). Valid Code Entered. User Logged In", requestBy: req.body.user.username}))
            req.session.user = req.body.user.username
            console.log(req.session.user)
            return res.send(true)
        }
        logger.info(JSON.stringify({ msg: "Attempt to login(2FA Code). Invalid Code Entered. User Denied Access", requestBy: req.body.username}))
        return res.status(401).send("Incorrect Token")
    })
})

app.get('/api/getCompanyCreds', (req, res) => {
    const q = "select * from master;"
    db.query(q, (err, result) => {
        if (err) {
            logger.error(err)
            return res.send({ error: err })
        }
        // console.log(result)
        logger.info(JSON.stringify({ msg: "Company Creds Accessed", requestBy: req.session.user }))
        return res.send(result)
    })
})

app.listen(3001, () => console.log("Server running!"))