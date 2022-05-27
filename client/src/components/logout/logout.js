import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Logout = (props) => {
    const navigate = useNavigate()
    useEffect(() => {
        axios.get('http://localhost:3001/api/logout').then(res => {
            navigate('/')
        })
    }, [])
    return (
        <>
            <h2> Logging Out User ! </h2>
        </>
    )
}

export default Logout;