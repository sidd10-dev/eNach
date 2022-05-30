import {useState} from 'react'
import styles from './navbar.module.css'
import React from 'react'
import logo from './img/img1.jpg'

const Navbar = (props) => {
    const elements = props.elements

    const [toggle, setToggle]= useState(false) 

    function togglebutton (){
        if(toggle)
            setToggle(false)
        else    
            setToggle(true)
    }

    return (
        <>
            <div className={styles.navbar}>
                <div>
                    <a href='/'><img src={logo} className={styles.pic}></img></a>
                    <div className={styles['line-container']} onClick= {togglebutton}>
                        <div className={`${styles['line']} ${styles['line-1']} ${toggle ? styles.change: ''}`}></div>
                        <div className={`${styles['line']} ${styles['line-2']} ${toggle ? styles.change: ''}`}></div>
                    </div>
                </div>

                <div className= {`${styles.navbarele} ${toggle ? styles.change: ''}`}>
                    {elements && elements.map(element => {
                        if (!element.click) {
                            return (
                                <>
                                    <a href={`/${element.link}`} className={styles.ele}>{element.name}</a>
                                </>
                            )
                        } else {
                            return (
                                <>
                                    <a href="" className={styles.eleClick}>{element.name}</a>
                                </>
                            )
                        }
                    })}
                </div>
            </div>
        </>
    )
}

export default Navbar