import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './login.module.css';
import ErrorModal from '../ErrorModal/ErrorModal';
import Button from '../Button/Button';
const axios = require('axios')

const Login = (props) => {
    axios.defaults.withCredentials = true
    const userNameInputRef = useRef()
    const passwordInputRef = useRef()
    const [error, setError] = useState(null)
    // const [isLoggedIn, setIsLoggedIn] = useState(false)
    const navigate = useNavigate()

    const resetFormData = () => {
        userNameInputRef.current.value = ''
        passwordInputRef.current.value = ''
    }

    const validateForm = (username, password) => {
        if(username.length == 0)
            return {msg: "Username Can't be Empty!", valid: false}
        if(password.length == 0)
            return {msg: "Password Can't be Empty!", valid: false}
        return {valid: true}
    }

    const loginHandler = (e) => {
        e.preventDefault()
        const username = userNameInputRef.current.value
        const password = passwordInputRef.current.value
        const formValid = validateForm(username, password)
        if (formValid.valid) {
            resetFormData()
            // console.log(username,password)
            axios.post("http://localhost:3001/api/login", {
                username,
                password
            }).then(res => {
                navigate('/eMandate')
            }).catch(er => {
                setError({ msg: er.response.data })
                // console.log(e)
            })
        } else {
            setError({msg: formValid.msg})
        }
    }

    useEffect(() => {
        axios.get('http://localhost:3001/api/login').then(res => {
            // console.log(res)
            if(res.data.isLoggedIn)
                navigate('/eMandate')
        }).catch(e => console.log(e))
    }, [])


    return (
        <>
            {error && (
                <ErrorModal errorMsg={error.msg} onCancelError={() => setError(null)}></ErrorModal>
            )}
            <h2 className='header'>Login</h2>
            <form onSubmit={loginHandler}>
                <label htmlFor="username">Username</label>
                <input type="text" name="username" ref={userNameInputRef}></input>
                <label htmlFor="password">Password</label>
                <input type="password" name="password" ref={passwordInputRef}></input>
                <Button type="submit">Login</Button>
            </form>
        </>
    )
}

export default Login