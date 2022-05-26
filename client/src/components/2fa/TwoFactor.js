import axios from "axios";
import React from "react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Button/Button";
import ErrorModal from "../ErrorModal/ErrorModal";
import styles from './TwoFactor.module.css';

const TwoFactor = (props) => {
    const [isValidUser, setIsValidUser] = useState(false)
    const [token, setToken] = useState()
    const [username, setUserName] = useState()
    const [error, setError] = useState(null)
    const [qr, setQr] = useState("")
    const userNameInputRef = useRef()
    const passwordInputRef = useRef()
    const codeInputRef = useRef()
    const navigate = useNavigate()

    // const resetForm = () => {
    //     userNameInputRef.current.value = ""
    //     passwordInputRef.current.value = ""
    //     codeInputRef.current.value = ""
    // }

    const verifyFormHandler = (event) => {
        event.preventDefault()
        setUserName(userNameInputRef.current.value)
        const password = passwordInputRef.current.value
        const name = userNameInputRef.current.value
        axios.post("http://localhost:3001/api/verifyUser", {
            name,
            password
        }).then(async (res) => {
            // console.log(res.data.token)
            setIsValidUser(res.data.isValidUser)
            setToken(res.data.token)
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
        console.log(username)
        axios.post("http://localhost:3001/api/2FAregister", {
            username,
            code
        }).then(res => {
            if (res.data.registrationComplete) {
                navigate('/login')
            }
        }).catch(e => {
            setError({ msg: e.response.data || e.msg })
            console.log(e)
        })
        setIsValidUser(true)
    }

    return (
        <>
            {isValidUser && (
                <>
                    <h2>Set Up 2FA</h2>
                    <div>
                        <img src={qr} className={styles.qr}></img>
                        <form onSubmit={twoFactorSubmitHandler}>
                            {/* <label htmlFor="username">Username</label>
                            <input type="text" name="username" ref={userNameInputRef}></input> */}
                            <label htmlFor="2FACode">2FA Code</label>
                            <input type="text" name="2FACode" ref={codeInputRef}></input>
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                </>
            )}
            {!isValidUser && (
                <>
                    {error && (
                        <ErrorModal errorMsg={error.msg} onCancelError={() => setError(null)}></ErrorModal>
                    )}
                    <h2>Enter your company credentials</h2>
                    <form onSubmit={verifyFormHandler}>
                        <label htmlFor="username">Username</label>
                        <input type="text" name="username" ref={userNameInputRef}></input>
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" ref={passwordInputRef}></input>
                        <Button type="submit">Login</Button>
                    </form>
                </>
            )}
        </>
    )
}

export default TwoFactor