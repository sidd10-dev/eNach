import axios from "axios";
import React from "react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Button/Button";
import ErrorModal from "../ErrorModal/ErrorModal";
import styles from './TwoFactor.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import Navbar from "../Navbar/navbar";

const TwoFactor = (props) => {
    const [isValidUser, setIsValidUser] = useState(false)
    const [secret, setSecret] = useState()
    const [email, setemail] = useState()
    const [error, setError] = useState(null)
    const [qr, setQr] = useState("")
    const emailInputRef = useRef()
    const passwordInputRef = useRef()
    const codeInputRef = useRef()
    const navigate = useNavigate()

    // const resetForm = () => {
    //     emailInputRef.current.value = ""
    //     passwordInputRef.current.value = ""
    //     codeInputRef.current.value = ""
    // }

    const verifyFormHandler = (event) => {
        event.preventDefault()
        setemail(emailInputRef.current.value)
        const password = passwordInputRef.current.value
        const email = emailInputRef.current.value
        axios.post("http://localhost:3001/api/verifyUser", {
            email,
            password
        }).then(async (res) => {
            // console.log(res.data.token)
            setIsValidUser(res.data.isValidUser)
            setSecret(res.data.secret)
            setQr(res.data.qr)
            // console.log(isValidUser)
        }).catch(e => {
            setError({ msg: e.response.data.msg })
            // console.log(e)
        })
    }

    const twoFactorSubmitHandler = (event) => {
        event.preventDefault()
        const code = codeInputRef.current.value
        console.log(email)
        axios.post("http://localhost:3001/api/2FAregister", {
            email,
            code,
            secret
        }).then(res => {
            if (res.data.registrationComplete) {
                navigate('/')
            }
        }).catch(e => {
            setError({ msg: e.response.data || e.msg })
            console.log(e)
        })
        setIsValidUser(true)
    }

    return (
        <>
            {error && (
                <ErrorModal errorMsg={error.msg} onCancelError={() => setError(null)}></ErrorModal>
            )}
            <Navbar elements = {[
                {
                    name: "Login",
                    link: "",
                    click: false
                },
                {
                    name: "2FA Registration",
                    link: "register2fa",
                    click: true
                }
            ]}></Navbar>
            {/* <h2>Two Factor Authentication Registration</h2> */}
            {isValidUser && (
                <>
                    <div className={styles.container2}>
                        <span className={styles.line}></span>
                        <h2 className={styles.head}>Set Up 2FA</h2>
                        <div className={styles.split}>
                            <img src={qr} className={styles.qr}></img>
                            <div className={styles.main}>
                                <div className={styles.tnc}>
                                    <h3 className={styles.inst}>Instructions: </h3>
                                    <p className={styles.instp}>
                                    1. Scan the QR Code with any Authenticator App <br />
                                    &nbsp;&nbsp;&nbsp;(for eg. Google Authenticator, Microsoft Authenticator).
                                    </p>
                                    <p className={styles.instp}>2. Enter the Code here To Finish Registration.</p>
                                    <p className={styles.instp}>Note: The Code is Refreshed Every Minute.</p>
                                </div>
                                <form onSubmit={twoFactorSubmitHandler} className = {styles.twoform}>
                                    {/* <label htmlFor="email">email</label>
                                    <input type="text" name="email" ref={emailInputRef}></input> */}
                                    <label className={styles.desc2} htmlFor="2FACode">2FA Code</label>
                                    <input className={styles.box2} type="text" name="2FACode" ref={codeInputRef}></input>
                                </form>
                                <button className={`${styles.btn} ${styles.btn2}`} type="submit">Submit<FontAwesomeIcon icon={faArrowRight} className={styles.arrow} /></button>
                            </div>
                        </div>
                    </div>
                </>
            )}
            {!isValidUser && (
                <>
                    <div className={styles.container}>
                        <span className={styles.line}></span>
                        <h2 className={styles.login}>2FA Registration</h2>
                        <form className={styles.login_form} onSubmit={verifyFormHandler}>
                            <div className={styles.elements}>
                                <label className={styles.desc} htmlFor="email">Email</label>
                                <input className={styles.box} type="text" name="email" ref={emailInputRef}></input>
                            </div>

                            <div className={styles.elements}>
                                <label className={styles.desc} htmlFor="password">Password</label>
                                <input className={styles.box} type="password" name="password" ref={passwordInputRef}></input>
                            </div>

                            <Button className={styles.btn} type="submit">Login<FontAwesomeIcon icon={faArrowRight} className={styles.arrow} /></Button>
                        </form>
                    </div>
                </>
            )}
        </>
    )
}

export default TwoFactor