import React from "react";
import ReactDOM from "react-dom";
import styles from './ErrorModal.module.css'
import Button from "../Button/Button";

const ErrorModal = (props) => {
    return (
        <>
            {
                ReactDOM.createPortal(
                    <div className={styles.backdrop}>
                        <div className={styles.modal}>
                            <p className={styles.header}>
                                Error!
                            </p>
                            <p className={styles.content}>
                                {props.errorMsg}
                            </p>
                            <Button type="button" onClick={props.onCancelError} className = {styles.okButton}>Ok!</Button>
                        </div>
                    </div>,
                    document.getElementById('error-modal')
                )
            }
        </>
    )
}

export default ErrorModal;