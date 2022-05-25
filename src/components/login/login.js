import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './login.module.css';
import ErrorModal from '../ErrorModal/ErrorModal';
import Button from '../Button/Button';
const axios = require('axios')

const Login = (props) => {
    axios.defaults.withCredentials = true
    const userNameInputRef = useRef()
    const passwordInputRef = useRef()
    const [error,setError] = useState(null)
    const navigate = useNavigate()

    const resetFormData = () => {
        userNameInputRef.current.value = ''
        passwordInputRef.current.value = ''
    }

    const loginHandler = (e) => {
        e.preventDefault()
        const username = userNameInputRef.current.value
        const password = passwordInputRef.current.value
        resetFormData()
        // console.log(username,password)
        axios.post("http://localhost:3001/api/login", {
            username,
            password
        }).then(res => {
            navigate('/eMandate')
        }).catch(er => {
            setError({msg: er.response.data})
            // console.log(e)
        })
    }


    return (
        <>  
            {error && (
                <ErrorModal errorMsg = {error.msg} onCancelError = {() => setError(null)}></ErrorModal>
            )}
            <h2 className = 'header'>Login</h2>
            <form onSubmit={loginHandler}>
            <label htmlFor="username">Username</label>
            <input type="text" name="username" ref={userNameInputRef}></input>
            <label htmlFor="password">Password</label>
            <input type="password" name="password" ref={passwordInputRef}></input>
            <Button type = "submit">Login</Button>
        </form>
        </>
    )
}

export default Login