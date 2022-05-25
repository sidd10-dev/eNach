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
        expires: 60*60*24
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

app.get('/api/login', (req,res) => {
    if(req.session.user)
        res.send({isLoggedIn: true, user: req.session.user})
    else 
        res.send({isLoggedIn: false, user: req.session.user})
})

app.post('/api/login', (req, res) => {
    const q = `select * from admin where username = '${req.body.username}';`
    // console.log(req.body)
    try {
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
    } catch (E) {
        return res.send({ error: E })
    }
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

// app.get('/getData', (req, res) => {
//     const q = "select * from customer;"
//     db.query(q, (err, result) => {
//         if (err)
//             throw err
//         console.log(result)
//         res.send("Data Fetched")
//     })
// })

// ${req.body.Customer_Name},${req.body.Customer_Mobile},${req.body.Customer_Emailid},${req.body.Customer_AccountNo},${req.body.Customer_StartDate},${req.body.Customer_ExpiryDate},${req.body.Customer_DebitAmount},${req.body.Customer_Frequency},${req.body.Customer_IFSC},${req.body.Customer_PanNo},${req.body.Customer_AccountType},${req.body.Customer_Bank}

// app.post('/createcustomer', (req, res) => {
//     const q = `INSERT INTO customer (Customer_Name,Customer_Mobile,Customer_Emailid,Customer_AccoutNo, Customer_StartDate, Customer_ExpiryDate, Customer_DebitAmount,Customer_DebitFrequency,Customer_IFSC, Customer_PanNo, Customer_AccountType,Customer_Bank) VALUES (${req.body.Customer_Name},${req.body.Customer_Mobile},${req.body.Customer_Emailid},${req.body.Customer_Name},${req.body.Customer_StartDate},${req.body.Customer_ExpiryDate},${req.body.Customer_DebitAmount},${req.body.Customer_Frequency},${req.body.Customer_IFSC},${req.body.Customer_PanNo},${req.body.Customer_AccountType},${req.body.Customer_Bank})`
//     const x = req.body

//     db.query(q, (err, result) => {
//         if (err)
//             throw err
//         return res.send("User Created!")
//     })
//     // s
// })

app.listen(3001, () => console.log("Server running!"))