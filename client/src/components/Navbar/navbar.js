import styles from './navbar.module.css'
import React from 'react'
import logo from './img/img1.jpg'

const Navbar = (props) => {
    const elements = props.elements
    return (
        <>
            <div className={styles.navbar}>
                <a href='/'><img src={logo} className={styles.pic}></img></a>
                <div className={styles['line-container']}>
                    <div className={`${styles['line']} ${styles['line-1']}`}></div>
                    <div className={`${styles['line']} ${styles['line-2']}`}></div>
                    <div className={`${styles['line']} ${styles['line-3']}`}></div>
                </div>

                <div>
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