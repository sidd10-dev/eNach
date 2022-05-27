import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './login.module.css';
import ErrorModal from '../ErrorModal/ErrorModal';
import Button from '../Button/Button';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faArrowRight} from '@fortawesome/free-solid-svg-icons'
// import logger from '../logger/logger';
const axios = require('axios')


const Login = (props) => {
    axios.defaults.withCredentials = true
    const userNameInputRef = useRef()
    const passwordInputRef = useRef()
    const codeInputRef = useRef()
    const [user, setUser] = useState(null)
    const [error, setError] = useState(null)
    // const [isLoggedIn, setIsLoggedIn] = useState(false)
    const navigate = useNavigate()

    const resetFormData = () => {
        userNameInputRef.current.value = ''
        passwordInputRef.current.value = ''
    }

    const validateForm = (username, password) => {
        if (username.length == 0)
            return { msg: "Username Can't be Empty!", valid: false }
        if (password.length == 0)
            return { msg: "Password Can't be Empty!", valid: false }
        return { valid: true }
    }

    const loginHandler = (e) => {
        e.preventDefault()
        const username = userNameInputRef.current.value
        const password = passwordInputRef.current.value
        const formValid = validateForm(username, password)

        if (formValid.valid) {
            resetFormData()
            axios.post("http://localhost:3001/api/login", {
                username,
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
            {!user && (
                <>
                    <div className={styles.container}>
                        <span className = {styles.line}></span>
                        <h2 className={styles.login}>Login</h2>
                        <form className={styles.login_form} onSubmit={loginHandler}>
                            <div className={styles.elements}>
                                <label className={styles.desc} htmlFor="username">Username</label>
                                <input className={styles.box} type="text" name="username" ref={userNameInputRef}></input>
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