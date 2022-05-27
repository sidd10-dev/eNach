import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './login.module.css';
import ErrorModal from '../ErrorModal/ErrorModal';
import Button from '../Button/Button';
import Navbar from '../Navbar/navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import validator from 'validator'
// import logger from '../logger/logger';
const axios = require('axios')


const Login = (props) => {
    axios.defaults.withCredentials = true
    const emailInputRef = useRef()
    const passwordInputRef = useRef()
    const codeInputRef = useRef()
    const [user, setUser] = useState(null)
    const [error, setError] = useState(null)
    // const [isLoggedIn, setIsLoggedIn] = useState(false)
    const navigate = useNavigate()

    const resetFormData = () => {
        emailInputRef.current.value = ''
        passwordInputRef.current.value = ''
    }

    const validateForm = (email, password) => {
        if (email.length == 0)
            return { msg: "Email Id Can't be Empty!", valid: false }
        if(!validator.isEmail(email))
            return { msg: "Invalid Email Id", valid: false }
        if (password.length == 0)
            return { msg: "Password Can't be Empty!", valid: false }
        return { valid: true }
    }

    const loginHandler = (e) => {
        e.preventDefault()
        const email = emailInputRef.current.value
        const password = passwordInputRef.current.value
        const formValid = validateForm(email, password)

        if (formValid.valid) {
            resetFormData()
            axios.post("http://localhost:3001/api/login", {
                email,
                password
            }).then(res => {
                setUser(res.data.user)
            }).catch(er => {
                setError({ msg: er.response.data })
            })
        } else {
            setError({ msg: formValid.msg })
        }
    }

    const twoFactorHandler = (event) => {
        event.preventDefault()
        const twoFactorCode = codeInputRef.current.value

        axios.post("http://localhost:3001/api/2falogin", {
            twoFactorCode,
            user
        }).then(res => {
            if (res.data === true)
                navigate('/eMandate')
        }).catch(er => {
            setError({ msg: er.response.data })
        })
    }

    useEffect(() => {
        axios.get('http://localhost:3001/api/login').then(res => {
            // console.log(res)
            if (res.data.isLoggedIn)
                navigate('/eMandate')
        }).catch(e => console.log(e))
    }, [])


    return (
        <>
            {error && (
                <ErrorModal errorMsg={error.msg} onCancelError={() => setError(null)}></ErrorModal>
            )}
            <Navbar elements={[
                {
                    name: "Login",
                    link: "",
                    click: true
                },
                {
                    name: "2FA Registration",
                    link: "register2fa",
                    click: false
                }
            ]}></Navbar>
            {!user && (
                <>
                    <div className={styles.container}>
                        <span className={styles.line}></span>
                        <h2 className={styles.login}>Login</h2>
                        <form className={styles.login_form} onSubmit={loginHandler}>
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
            {user && (
                <>
                    <div className={styles.container}>
                        <span className={styles.line}></span>
                        <h2 className={styles.login}>Login</h2>
                        <form className={styles.login_form} onSubmit={twoFactorHandler}>
                            <div className={styles.elements}>
                                <label className={styles.desc} htmlFor="2FACode">2FACode</label>
                                <input className={styles.box} type="text" name="2FACode" ref={codeInputRef}></input>
                            </div>

                            <Button className={styles.btn} type="submit">Submit<FontAwesomeIcon icon={faArrowRight} className={styles.arrow} /></Button>
                        </form>
                    </div>
                </>
            )}
        </>
    )
}

export default Login