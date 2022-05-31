import React from 'react'
import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './logs.module.css'
import Navbar from "../Navbar/navbar";
import Button from '../Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'



const Log = (props) => {

    const startref = useRef()
    const endref = useRef()
    const [logs, setLogs] = useState([])
    const navigate = useNavigate()

    const formSubmitHandler = (event) => {
        event.preventDefault()
        const startDate = startref.current.value
        const endDate = endref.current.value
        console.log(startDate)
        axios.post('http://localhost:3001/api/getLogs', {
            startDate,
            endDate
        }).then(res => {
            // console.log(res.data)
            setLogs(res.data)
            console.log(res)
        }).catch(e => console.log(e))
    }

    const loginChecker = () => {
        
    }

    useEffect(() => {
        axios.get('http://localhost:3001/api/login').then(res => {
            // console.log(res)
            if(!res.data.isLoggedIn)
                navigate('/')
        }).catch(e => console.log(e))
    }, [])

    return (
        <>
            <Navbar elements={[
                {
                    name: "Logout",
                    link: "logout",
                    click: false
                },
                {
                    name: "eMandate",
                    link: "eMandate",
                    click: false
                },
                {
                    name: "Logs",
                    link: "logs",
                    click: true
                }
            ]}></Navbar>
            <div className={styles.container}>
                <span className={styles.line}></span>
                <h2 className={styles.log}>Logs</h2>
                <form className={styles.filter} onSubmit={formSubmitHandler}>
                    <div className={styles.icont}>
                        <label className={styles.desc}>Start Date:</label>
                        <input className={styles.box} type='date' ref={startref}></input>
                    </div>
                    <div className={styles.icont}>
                        <label className={styles.desc}>End Date:</label>
                        <input className={styles.box} type='date' ref={endref}></input>
                    </div>
                    <Button className={styles.btn} type="submit">Search<FontAwesomeIcon icon={faSearch} className={styles.icon} /></Button>
                </form>

                {(logs.length == 0) && (
                    <>
                        <p>No Logs!</p>
                    </>
                )}

                {(logs.length > 0) && (
                    <div className={styles.logging}>
                        <div className={styles.columns}>
                            <div className={styles.id}>Id</div>
                            <div className={styles.msg}>Message</div>
                            <div className={styles.timestamp}>Timestamp</div>
                            <div className={styles.user}>User</div>
                            <div className={styles.ip}>User IP</div>
                        </div>

                        <div className={styles.underline}></div>
                        {logs && logs.map(log => {
                            const reqBy = JSON.parse(log.metadata).requestBy
                            const ip = JSON.parse(log.metadata).ip
                            const d = new Date(log.addDate)
                            return (
                                <>
                                    <div className={styles.rows}>
                                        <h1 className={`${styles['id']} ${styles['contents']}`}>{log.id}</h1>
                                        <h1 className={`${styles['msg']} ${styles['contents']}`}>{log.log}</h1>
                                        <h1 className={`${styles['timestamp']} ${styles['contents']}`}>{d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()}</h1>
                                        <h1 className={`${styles['user']} ${styles['contents']}`}>{reqBy || "-"}</h1>
                                        <h1 className={`${styles['ip']} ${styles['contents']}`}>{ip || "-"}</h1>
                                    </div>

                                    <div className={styles.underline}></div>
                                </>
                            )
                        })}

                    </div>
                )}


            </div>
        </>
    )
}

export default Log;