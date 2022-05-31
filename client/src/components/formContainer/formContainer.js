import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from './formContainer.module.css'
import { v4 as uuid4 } from 'uuid'
import Button from '../Button/Button'
import Schedule from 'react-schedule-job'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import Navbar from "../Navbar/navbar";
import { sha256 } from 'js-sha256';

const FormContainer = (props) => {

    axios.defaults.withCredentials = true
    // UseRef Hooks
    const customerNameRef = useRef()
    const customerTelephoneRef = useRef()
    const customerEmailIdRef = useRef()
    const customerMobileRef = useRef()
    const customerAccountNoRef = useRef()
    const customerStartDateRef = useRef()
    const customerExpiryDateRef = useRef()
    const customerDebitAmountRef = useRef()
    const customerMaxAmountRef = useRef()
    const customerDebitFrequencyRef = useRef()
    const customerSequenceTypeRef = useRef()
    const customerIFSCRef = useRef()
    const customerReference1Ref = useRef()
    const customerReference2Ref = useRef()
    const channelRef = useRef()
    const filler1Ref = useRef()
    const filler2Ref = useRef()
    const filler3Ref = useRef()
    const filler4Ref = useRef()
    const filler5Ref = useRef()
    const filler6Ref = useRef()
    const filler7Ref = useRef()
    const filler8Ref = useRef()
    const filler9Ref = useRef()
    const filler10Ref = useRef()

    // useState Hooks
    const [banks, setBanks] = useState()
    const [isLoggedIn, setIsLoggedIn] = useState(true)

    const navigate = useNavigate()

    const fetchBankScheduler = () => {
        axios.get('http://localhost:3001/api/fetchBanks').then(res => {
            // console.log(res.data)
            setBanks(res.data)
        }).catch(e => console.log(e))
    }

    const loginChecker = () => {
        axios.get('http://localhost:3001/api/login').then(res => {
            // console.log(res)
            setIsLoggedIn(res.data.isLoggedIn)
        }).catch(e => console.log(e))
    }

    const checkSumGenerate = () => {

    }

    useEffect(() => {
        loginChecker()
        if (isLoggedIn)
            fetchBankScheduler()
    }, [])

    useEffect(() => {
        if (!isLoggedIn)
            navigate('/')
    }, [isLoggedIn])



    const formSubmitHandler = async (event) => {
        event.preventDefault()

        let Merchant_Category_Code = ''
        let Short_Code = ''
        let UtilCode = ''
        let CheckSum = ''
        let Customer_Name = customerNameRef.current.value
        let Customer_TelphoneNo = customerTelephoneRef.current.value
        let Customer_EmailId = customerEmailIdRef.current.value
        let Customer_Mobile = customerMobileRef.current.value
        let Customer_AccountNo = customerAccountNoRef.current.value
        let Customer_StartDate = customerStartDateRef.current.value
        let Customer_ExpiryDate = customerExpiryDateRef.current.value
        let Customer_DebitAmount = customerDebitAmountRef.current.value
        let Customer_MaxAmount = customerMaxAmountRef.current.value
        let Customer_DebitFrequency = customerDebitFrequencyRef.current.value
        let Customer_SequenceType = customerSequenceTypeRef.current.value
        let Customer_InstructedMemberId = customerIFSCRef.current.value
        let Customer_Reference1 = customerReference1Ref.current.value
        let Customer_Reference2 = customerReference2Ref.current.value
        let Channel = channelRef.current.value
        let Filler1 = filler1Ref.current.value
        let Filler2 = filler2Ref.current.value
        let Filler3 = filler3Ref.current.value
        let Filler4 = filler4Ref.current.value
        let Filler5 = filler5Ref.current.value
        let Filler6 = filler6Ref.current.value
        let Filler7 = filler7Ref.current.value
        let Filler8 = filler8Ref.current.value
        let Filler9 = filler9Ref.current.value
        let Filler10 = filler10Ref.current.value

        // const valid = isFormValid(Customer_Mobile, Customer_TelphoneNo, Customer_EmailId,Customer_AccountNo, Customer_ExpiryDate, Customer_StartDate, Customer_DebitAmount, Customer_MaxAmount, )

        axios.get('http://localhost:3001/api/getCompanyCreds').then(res => {
            // console.log(res)
            UtilCode += res.data[0].UtilCode
            Merchant_Category_Code += res.data[0].CategoryCode
            Short_Code += res.data[0].ShortCode
            // console.log(res.data[0].UtilCode)
        })

        axios.post('http://localhost:3001/api/aes256encrypt', {
            Customer_Name,
            Customer_Mobile,
            Customer_EmailId,
            Customer_AccountNo,
            Short_Code,
            Customer_Reference1,
            Customer_Reference2,
            UtilCode
        }).then(res => {
            console.log(res)
        }).catch(e => console.log(e))
    
        axios.post('http://localhost:3001/api/sha256encrypt', {
            Customer_AccountNo,
            Customer_StartDate,
            Customer_ExpiryDate,
            Customer_DebitAmount,
            Customer_MaxAmount
        }).then(res => {
            CheckSum = res.data
        }).catch(e => console.log(e))

        const MsgId = uuid4()
        let reqBody = {}

        setTimeout(function () {
            reqBody = {
                UtilCode,
                Short_Code,
                Merchant_Category_Code,
                CheckSum,
                MsgId,
                Customer_Name,
                Customer_TelphoneNo,
                Customer_EmailId,
                Customer_Mobile,
                Customer_AccountNo,
                Customer_StartDate,
                Customer_ExpiryDate,
                Customer_DebitAmount,
                Customer_MaxAmount,
                Customer_DebitFrequency,
                Customer_SequenceType,
                Customer_InstructedMemberId,
                Customer_Reference1,
                Customer_Reference2,
                Channel,
                Filler1,
                Filler2,
                Filler3,
                Filler4,
                Filler5,
                Filler6,
                Filler7,
                Filler8,
                Filler9,
                Filler10,
            }
    
            console.log(reqBody)
        }, 500);
    }

    // const buttonChangeHandler = () => {
    //     console.log(banks)
    // }

    const jobs = [
        {
            fn: fetchBankScheduler,
            id: '1',
            schedule: '30 9,21 * * *'
        }
    ]

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
                    click: true
                }
            ]}></Navbar>
            <div className={styles.container}>
                <form className={styles.formContainer} onSubmit={formSubmitHandler}>
                    <span className={styles.line}></span>
                    <h2 className={styles.heading}>eMandate Form</h2>
                    <div className={`${styles['input-block-container']}`}>
                        <div className={`${styles['left-container']}`}>
                            <div className={`${styles['input-container']}`}>
                                <label htmlFor="Customer_Name" className={styles.desc}>Customer Name<span className={styles.req}>*</span></label>
                                <input className={styles.box} type="text" id="Customer_Name" name="Customer_Name" required ref={customerNameRef}></input>
                            </div>
                            {/* <div className={`${styles['input-container']}`}>
                                <label htmlFor="UtilCode" className={`${styles['label']}`}>Utility Code*</label>
                                <input type="text" id="UtilCode" name="UtilCode" required ref={utilCodeRef}></input>
                            </div>

                            <div className={`${styles['input-container']}`}>
                                <label htmlFor="Merchant_Category_Code" className={`${styles['label']}`}>Category Code*</label>
                                <input type="text" id="Merchant_Category_Code" name="Merchant_Category_Code" required ref={merchantCategoryCodeRef}></input>
                            </div> */}

                            {/* <div className={`${styles['input-container']}`}>
                                <label htmlFor="MsgID" className={`${styles['label']}`}>MsgId*</label>
                                <input type="text" id="MsgID" name="MsgID" required ref={msgIdRef}></input>
                            </div> */}



                            <div className={`${styles['input-container']}`}>
                                <label htmlFor="Customer_EmailId" className={styles.desc}>Customer Email Id<span className={styles.req}>*</span></label>
                                <input className={styles.box} type="text" id="Customer_EmailId" name="Customer_EmailId" ref={customerEmailIdRef} required></input>
                            </div>

                            <div className={`${styles['input-container']}`}>
                                <label htmlFor="Customer_StartDate" className={styles.desc}>Start Date<span className={styles.req}>*</span></label>
                                <input className={styles.box} type="date" id="Customer_StartDate" name="Customer_StartDate" required ref={customerStartDateRef}></input>
                            </div>

                            <div className={`${styles['input-container']}`}>
                                <label htmlFor="Customer_DebitAmount" className={styles.desc}>Amount to be Debitted<span className={styles.req}>*</span></label>
                                <input className={styles.box} type="number" id="Customer_DebitAmount" name="Customer_DebitAmount" required ref={customerDebitAmountRef}></input>
                            </div>


                            <div className={`${styles['input-container']}`}>
                                <label htmlFor="Customer_MaxAmount" className={styles.desc}>Max Amount</label>
                                <input className={styles.box} type="text" id="Customer_MaxAmount" name="Customer_MaxAmount" ref={customerMaxAmountRef}></input>
                            </div>

                            <div className={`${styles['input-container']}`}>
                                <label htmlFor="Customer_InstructedMemberId" className={styles.desc}>IFSC Code<span className={styles.req}>*</span></label>
                                <input className={styles.box} type="text" id="Customer_InstructedMemberId" name="Customer_InstructedMemberId" required ref={customerIFSCRef}></input>
                            </div>

                            <div className={`${styles['input-container']}`}>
                                <label htmlFor="Customer_Reference1" className={styles.desc}>Customer Reference 1</label>
                                <input className={styles.box} type="text" id="Customer_Reference1" name="Customer_Reference1" ref={customerReference1Ref}></input>
                            </div>

                            <div className={`${styles['input-container']}`}>
                                <label htmlFor="Filler1" className={styles.desc}>Filler 1</label>
                                <input className={styles.box} type="text" id="Filler1" name="Filler1" placeholder="Filler1" ref={filler1Ref}></input>
                            </div>

                            <div className={`${styles['input-container']}`}>
                                <label htmlFor="Filler3" className={styles.desc}>Filler 3</label>

                                <input className={styles.box} type="text" id="Filler3" name="Filler3" placeholder="Filler3" ref={filler3Ref}></input>
                            </div>

                            <div className={`${styles['input-container']}`}>
                                <label htmlFor="Filler5" className={styles.desc}>Filler 5 - Account Type<span className={styles.req}>*</span></label>
                                <select className={styles.selectbox} id="Filler5" name="Filler5" ref={filler5Ref}>
                                    <option value="S">Savings</option>
                                    <option value="C">Current</option>
                                    <option value="O">Other</option>
                                </select>
                            </div>

                            <div className={`${styles['input-container']}`}>
                                <label htmlFor="Filler7" className={styles.desc}>Filler 7</label>
                                <input className={styles.box} type="text" id="Filler7" name="Filler7" placeholder="Filler7" ref={filler7Ref}></input>
                            </div>

                            <div className={`${styles['input-container']}`}>
                                <label htmlFor="Filler9" className={styles.desc}>Filler 9 - To be left blank</label>
                                <input className={styles.box} type="text" id="Filler9" name="Filler9" ref={filler9Ref}></input>
                            </div>

                        </div>

                        <div className={`${styles['right-container']}`}>

                            {/* <div className={`${styles['input-container']}`}>
                                <label htmlFor="Short_Code" className={`${styles['label']}`}>Short Code*</label>
                                <input className={styles.box} type="text" id="Short_Code" name="Short_Code" required ref={shortCodeRef}></input>
                            </div> */}

                            {/* <div className={`${styles['input-container']}`}>
                                <label htmlFor="CheckSum" className={`${styles['label']}`}>Checksum*</label>
                                <input className={styles.box} type="text" id="CheckSum" name="CheckSum" required ref={checkSumRef}></input>
                            </div> */}

                            <div className={`${styles['input-container']}`}>
                                <label htmlFor="Customer_Mobile" className={styles.desc}>Customer MobileNo<span className={styles.req}>*</span></label>
                                <input className={styles.box} type="number" id="Customer_Mobile" name="Customer_Mobile" ref={customerMobileRef} required></input>
                            </div>

                            <div className={`${styles['input-container']}`}>
                                <label htmlFor="Customer_TelphoneNo" className={styles.desc}>Customer TelphoneNo</label>
                                <input className={styles.box} type="number" id="Customer_TelphoneNo" name="Customer_TelphoneNo" ref={customerTelephoneRef}></input>
                            </div>

                            <div className={`${styles['input-container']}`}>
                                <label htmlFor="Customer_ExpiryDate" className={styles.desc}>Expiry Date</label>
                                <input className={styles.box} type="date" id="Customer_ExpiryDate" name="Customer_ExpiryDate" ref={customerExpiryDateRef}></input>
                            </div>

                            <div className={`${styles['input-container']}`}>
                                <label htmlFor="Customer_AccountNo" className={styles.desc}>Customer Account No<span className={styles.req}>*</span></label>
                                <input className={styles.box} type="text" id="Customer_AccountNo" name="Customer_AccountNo" required ref={customerAccountNoRef}></input>
                            </div>

                            <div className={`${styles['input-container']}`}>
                                <label htmlFor="Customer_DebitFrequency" className={styles.desc}>Debit Frequency<span className={styles.req}>*</span></label>
                                <select className={styles.selectbox} id="Customer_DebitFrequency" name="Customer_DebitFrequency" ref={customerDebitFrequencyRef}>
                                    <option value="ADHO">As and when presented</option>
                                    <option value="INDA">Intra-day</option>
                                    <option value="DAIl">Daily</option>
                                    <option value="WEEK">Weekly</option>
                                    <option value="MNTH">Monthly</option>
                                    <option value="BIMN">Bi-Monthly</option>
                                    <option value="QURT">Quarterly</option>
                                    <option value="MIAN">Half - Yearly</option>
                                    <option value="YEAR">Yearly</option>
                                    <option value="">One Off Payment</option>
                                </select>
                            </div>

                            <div className={`${styles['input-container']}`}>
                                <label htmlFor="Customer_SequenceType" className={styles.desc}>Customer Sequence Type<span className={styles.req}>*</span></label>
                                <select className={styles.selectbox} id="Customer_SequenceType" name="Customer_SequenceType" ref={customerSequenceTypeRef}>
                                    <option value="RCUR">Recurring</option>
                                    <option value="OOFF">One Off</option>
                                </select>
                            </div>

                            <div className={`${styles['input-container']}`}>
                                <label htmlFor="Customer_Reference2" className={styles.desc}>Customer Reference 2</label>
                                <input className={styles.box} type="text" id="Customer_Reference2" name="Customer_Reference2" ref={customerReference2Ref}></input>
                            </div>

                            <div className={`${styles['input-container']}`}>
                                <label htmlFor="Channel" className={styles.desc}>Channel - Netbanking/Debit card</label>
                                <select className={styles.selectbox} id="Channel" name="Channel" ref={channelRef}>
                                    <option value="Net">Netbanking</option>
                                    <option value="Debit">Debit Card</option>
                                </select>
                            </div>

                            <div className={`${styles['input-container']}`}>
                                <label htmlFor="Filler2" className={styles.desc}>Filler 2</label>
                                <input className={styles.box} type="text" id="Filler2" name="Filler2" placeholder="Filler2" ref={filler2Ref}></input>
                            </div>

                            <div className={`${styles['input-container']}`}>
                                <label htmlFor="Filler4" className={styles.desc}>Filler 4 - PAN Number<span className={styles.req}>*</span></label>
                                <input className={styles.box} type="text" id="Filler4" name="Filler4" ref={filler4Ref}></input>
                            </div>

                            <div className={`${styles['input-container']}`}>
                                <label htmlFor="Filler6" className={styles.desc}>Filler 6 - Customer Bank<span className={styles.req}>*</span></label>
                                <select className={styles.selectbox} id="Filler6" name="Filler6" ref={filler6Ref}>
                                    {banks && banks.map(bank => (
                                        <option value={bank.bankID}>
                                            {bank.bankName}
                                        </option>
                                    ))}
                                </select>
                            </div>


                            <div className={`${styles['input-container']}`}>
                                <label htmlFor="Filler8" className={styles.desc}>Filler 8</label>
                                <input className={styles.box} type="text" id="Filler8" name="Filler8" placeholder="Filler8" ref={filler8Ref}></input>
                            </div>

                            <div className={`${styles['input-container']}`}>
                                <label htmlFor="Filler10" className={styles.desc}>Filler 10 - To be left blank</label>
                                <input className={styles.box} type="text" id="Filler10" name="Filler10" placeholder="" ref={filler10Ref}></input>
                            </div>
                        </div>
                    </div>
                    <Button type="submit" className={styles.btn}>Submit<FontAwesomeIcon icon={faArrowRight} className={styles.arrow} /></Button>
                </form>
                {/* <button type="button" onClick={buttonChangeHandler}>trigger</button> */}
                <Schedule jobs={jobs} timeZone='UTC' dashboard={{ hidden: true }} />
            </div>
        </>
    )
}

export default FormContainer