import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from './formContainer.module.css'
import { v4 as uuid4 } from 'uuid'
import Button from '../Button/Button'
import Schedule from 'react-schedule-job'
import axios from 'axios'
import Navbar from "../Navbar/navbar";

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

    useEffect(() => {
        loginChecker()
        if(isLoggedIn)
            fetchBankScheduler()
    }, [])

    useEffect(() => {
        if(!isLoggedIn)
            navigate('/login')
    }, [isLoggedIn])

    const formSubmitHandler = async (event) => {
        event.preventDefault()
        
        let Merchant_Category_Code = ' '
        let Short_Code = ' '
        let UtilCode = ' '
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
        let Filler3 = filler1Ref.current.value
        let Filler4 = filler1Ref.current.value
        let Filler5 = filler1Ref.current.value
        let Filler6 = filler1Ref.current.value
        let Filler7 = filler1Ref.current.value
        let Filler8 = filler1Ref.current.value
        let Filler9 = filler1Ref.current.value
        let Filler10 = filler1Ref.current.value

        axios.get('http://localhost:3001/api/getCompanyCreds').then(res => {
            UtilCode = res.data.UtilCode
            Merchant_Category_Code = res.data.CategoryCode
            Short_Code = res.data.ShortCode
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
            console.log(res)
            CheckSum = res.data
        }).catch(e => console.log(e))

        const MsgId = uuid4()

        const reqBody = {
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
                    name: "logout",
                    link: "logout",
                    click: false
                },
                {
                    name: "eMandate Form",
                    link: "eMandate",
                    click: true
                }
            ]}></Navbar>
            <h2 className = "header">eMandate Form</h2>
            <div className={`${styles['container']}`}>
            <form className={`${styles['form-container']}`} onSubmit={formSubmitHandler}>
                <div className={`${styles['input-block-container']}`}>
                    <div className={`${styles['left-container']}`}>
                        <div className={`${styles['input-container']}`}>
                            <label htmlFor="Customer_Name" className={`${styles['label']}`}>Customer Name*</label>
                            <input type="text" id="Customer_Name" name="Customer_Name" required ref={customerNameRef}></input>
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
                            <label htmlFor="Customer_EmailId" className={`${styles['label']}`}>Customer Email Id*</label>
                            <input type="text" id="Customer_EmailId" name="Customer_EmailId" ref={customerEmailIdRef} required></input>
                        </div>

                        <div className={`${styles['input-container']}`}>
                            <label htmlFor="Customer_StartDate" className={`${styles['label']}`}>Start Date*</label>
                            <input type="date" id="Customer_StartDate" name="Customer_StartDate" required ref={customerStartDateRef}></input>
                        </div>

                        <div className={`${styles['input-container']}`}>
                            <label htmlFor="Customer_DebitAmount" className={`${styles['label']}`}>Amount to be Debitted*</label>
                            <input type="number" id="Customer_DebitAmount" name="Customer_DebitAmount" required ref={customerDebitAmountRef}></input>
                        </div>


                        <div className={`${styles['input-container']}`}>
                            <label htmlFor="Customer_MaxAmount" className={`${styles['label']}`}>Max Amount</label>
                            <input type="text" id="Customer_MaxAmount" name="Customer_MaxAmount" ref={customerMaxAmountRef}></input>
                        </div>

                        <div className={`${styles['input-container']}`}>
                            <label htmlFor="Customer_InstructedMemberId" className={`${styles['label']}`}>IFSC Code*</label>
                            <input type="text" id="Customer_InstructedMemberId" name="Customer_InstructedMemberId" required ref={customerIFSCRef}></input>
                        </div>

                        <div className={`${styles['input-container']}`}>
                            <label htmlFor="Customer_Reference1" className={`${styles['label']}`}>Customer Reference 1</label>
                            <input type="text" id="Customer_Reference1" name="Customer_Reference1" ref={customerReference1Ref}></input>
                        </div>

                        <div className={`${styles['input-container']}`}>
                            <label htmlFor="Filler1" className={`${styles['label']}`}>Filler 1</label>
                            <input type="text" id="Filler1" name="Filler1" placeholder="Filler1" ref={filler1Ref}></input>
                        </div>

                        <div className={`${styles['input-container']}`}>
                            <label htmlFor="Filler3" className={`${styles['label']}`}>Filler 3</label>

                            <input type="text" id="Filler3" name="Filler3" placeholder="Filler3" ref={filler3Ref}></input>
                        </div>

                        <div className={`${styles['input-container']}`}>
                            <label htmlFor="Filler5" className={`${styles['label']}`}>Filler 5 - Account Type*</label>
                            <select id="Filler5" name="Filler5" ref={filler5Ref}>
                                <option value="S">Savings</option>
                                <option value="C">Current</option>
                                <option value="O">Other</option>
                            </select>
                        </div>

                        <div className={`${styles['input-container']}`}>
                            <label htmlFor="Filler7" className={`${styles['label']}`}>Filler 7</label>
                            <input type="text" id="Filler7" name="Filler7" placeholder="Filler7" ref={filler7Ref}></input>
                        </div>

                        <div className={`${styles['input-container']}`}>
                            <label htmlFor="Filler9" className={`${styles['label']}`}>Filler 9 - To be left blank</label>
                            <input type="text" id="Filler9" name="Filler9" ref={filler9Ref}></input>
                        </div>

                    </div>

                    <div className={`${styles['right-container']}`}>

                        {/* <div className={`${styles['input-container']}`}>
                            <label htmlFor="Short_Code" className={`${styles['label']}`}>Short Code*</label>
                            <input type="text" id="Short_Code" name="Short_Code" required ref={shortCodeRef}></input>
                        </div> */}

                        {/* <div className={`${styles['input-container']}`}>
                            <label htmlFor="CheckSum" className={`${styles['label']}`}>Checksum*</label>
                            <input type="text" id="CheckSum" name="CheckSum" required ref={checkSumRef}></input>
                        </div> */}

                        <div className={`${styles['input-container']}`}>
                            <label htmlFor="Customer_Mobile" className={`${styles['label']}`}>Customer MobileNo*</label>
                            <input type="number" id="Customer_Mobile" name="Customer_Mobile" ref={customerMobileRef} required></input>
                        </div>

                        <div className={`${styles['input-container']}`}>
                            <label htmlFor="Customer_TelphoneNo" className={`${styles['label']}`}>Customer TelphoneNo</label>
                            <input type="number" id="Customer_TelphoneNo" name="Customer_TelphoneNo" ref={customerTelephoneRef}></input>
                        </div>

                        <div className={`${styles['input-container']}`}>
                            <label htmlFor="Customer_ExpiryDate" className={`${styles['label']}`}>Expiry Date</label>
                            <input type="date" id="Customer_ExpiryDate" name="Customer_ExpiryDate" ref={customerExpiryDateRef}></input>
                        </div>

                        <div className={`${styles['input-container']}`}>
                            <label htmlFor="Customer_AccountNo" className={`${styles['label']}`}>Customer Account No*</label>
                            <input type="text" id="Customer_AccountNo" name="Customer_AccountNo" required ref={customerAccountNoRef}></input>
                        </div>

                        <div className={`${styles['input-container']}`}>
                            <label htmlFor="Customer_DebitFrequency" className={`${styles['label']}`}>Debit Frequency*</label>
                            <select id="Customer_DebitFrequency" name="Customer_DebitFrequency" ref={customerDebitFrequencyRef}>
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
                            <label htmlFor="Customer_SequenceType" className={`${styles['label']}`}>Customer Sequence Type*</label>
                            <select id="Customer_SequenceType" name="Customer_SequenceType" ref={customerSequenceTypeRef}>
                                <option value="RCUR">Recurring</option>
                                <option value="OOFF">One Off</option>
                            </select>
                        </div>

                        <div className={`${styles['input-container']}`}>
                            <label htmlFor="Customer_Reference2" className={`${styles['label']}`}>Customer Reference 2</label>
                            <input type="text" id="Customer_Reference2" name="Customer_Reference2" ref={customerReference2Ref}></input>
                        </div>

                        <div className={`${styles['input-container']}`}>
                            <label htmlFor="Channel" className={`${styles['label']}`}>Channel - Netbanking/Debit card</label>
                            <select id="Channel" name="Channel" ref={channelRef}>
                                <option value="Net">Netbanking</option>
                                <option value="Debit">Debit Card</option>
                            </select>
                        </div>

                        <div className={`${styles['input-container']}`}>
                            <label htmlFor="Filler2" className={`${styles['label']}`}>Filler 2</label>
                            <input type="text" id="Filler2" name="Filler2" placeholder="Filler2" ref={filler2Ref}></input>
                        </div>

                        <div className={`${styles['input-container']}`}>
                            <label htmlFor="Filler4" className={`${styles['label']}`}>Filler 4 - PAN Number*</label>
                            <input type="text" id="Filler4" name="Filler4" ref={filler4Ref}></input>
                        </div>

                        <div className={`${styles['input-container']}`}>
                            <label htmlFor="Filler6" className={`${styles['label']}`}>Filler 6 - Customer Bank*</label>
                            <select id="Filler6" name="Filler6" ref={filler6Ref}>
                                {banks && banks.map(bank => (
                                    <option value={bank.bankID}>
                                        {bank.bankName}
                                    </option>
                                ))}
                            </select>
                        </div>


                        <div className={`${styles['input-container']}`}>
                            <label htmlFor="Filler8" className={`${styles['label']}`}>Filler 8</label>
                            <input type="text" id="Filler8" name="Filler8" placeholder="Filler8" className={`${styles['input']}`} ref={filler8Ref}></input>
                        </div>

                        <div className={`${styles['input-container']}`}>
                            <label htmlFor="Filler10" className={`${styles['label']}`}>Filler 10 - To be left blank</label>
                            <input type="text" id="Filler10" name="Filler10" placeholder="" className={`${styles['input']}`} ref={filler10Ref}></input>
                        </div>
                    </div>
                </div>
                <Button type="submit">Submit</Button>
            </form>
            {/* <button type="button" onClick={buttonChangeHandler}>trigger</button> */}
            <Schedule jobs={jobs} timeZone='UTC' dashboard={{ hidden: true }} />
        </div>
        </>
    )
}

export default FormContainer