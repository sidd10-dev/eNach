import styles from './index.module.css'
import React from 'react'
import logo from './img/img1.jpg'

export default function Index() {
    console.log("JO")
  return (
      <>
        <div className={styles.navbar}>
            <a href='/'><img src={logo} className={styles.pic}></img></a>
            
            <div>
                <a href="/login" className={styles.ele}>Login</a>
                <a href="#" className={styles.ele}>SignUp</a>
            </div>
        </div>
      </>
  )
}