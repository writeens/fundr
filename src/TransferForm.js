/**
 * This component handles a new transfer being made to a recipient
 * who is yet to be registered.
 */

 // Imports
import React, { Component } from 'react'
import axios from "axios";
import "./TransferForm.css";

/**
 * create instance of axios library with authentication
 */
let axios_pay = axios.create({
    baseURL: "https://api.paystack.co",
    headers: {"Authorization": `Bearer ${process.env.REACT_APP_SECRET_API_KEY}`}
})

// Component class 
class TransferForm extends Component {
    constructor(props){
        super(props);

        /**
         * Initial state set and all methods used are bound
         */
        this.state={accountNo:"", banks:[], bankCode:"", amount:"", accountName:"", reason:"", isVerifying:false}
        this.handleAccount = this.handleAccount.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleAmount = this.handleAmount.bind(this);
        this.handleReason = this.handleReason.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /**
     * Upon mounting,
     * Retrieve the list of banks and their associated bank codes
     */
    componentDidMount(){
        //Using the Banks API
        axios_pay.get("/bank").then(banks => {
            this.setState({isLoading: true})
            if(banks.status === 200){
                let allBanks = banks.data.data.map(bank => {
                    return {code: bank.code, name: bank.name, id: bank.id, type: bank.type}
                })
                this.setState({banks : allBanks})
            }
        })
    }
    /**
     * This handles the selection of a bank from the list,
     * it updates state accordingly
     */
    handleSelect(evt){
        this.setState({
            bankCode: evt.target.value,
            accountNo: "",
            accountName:""
        })
    }
    /**
     * Update Amount and Reason for Transfer
     * 
     */
    handleAmount(evt){
        this.setState({amount: evt.target.value})
    }
    handleReason(evt){
        this.setState({reason: evt.target.value})
    }

    /**
     *  Get Account Number from User and Verify using the Paystack Resolve Phone Number API 
     *  Retrieve the account name and update state accordingly
     * 
     */
    handleAccount(evt){
        this.setState({
            [evt.target.name]: evt.target.value
        }, ()=> {
            if(this.state.accountNo.length === 10){
                this.setState({isVerifying: true}, () => {
                    axios_pay.get("/bank/resolve", {
                        params: {account_number: this.state.accountNo, 
                            bank_code: this.state.bankCode }
                    }).then(res => {
                        let name = res.data.data.account_name
                        this.setState({isVerifying: false}, () =>{
                            this.setState({accountName: name})
                        })
                    }).catch(err => {
                        if(err){
                            alert("Please ensure you are transferring to the proper bank")
                            this.setState({bankCode:"", accountNo:"", isVerifying:false})
                        }
                    })
                })
            }
        })
    }

    /**
     * This handles the form submit event and sends all details to the parent Component 
     *  
     */
    handleSubmit(evt){
        evt.preventDefault();
        const {bankCode, accountName, accountNo, amount, reason} = this.state
        this.props.createRecipient(bankCode, accountName, accountNo, amount, reason)
    }

    clear(){
        this.setState({
            accountNo:"", 
                bankCode:"", 
                amount:"", 
                accountName:"", 
                reason:"", 
                isVerifying:false
            })
    }

    /**
     * Renders <TransferForm /> 
     */
    render(){
        return(
            <form onSubmit={this.handleSubmit} className="TransferForm">
                <div>
                    <label htmlFor="bankInfo">Bank: </label>
                    <select value={this.state.bankCode} onChange={this.handleSelect}>
                        <option disabled value="">Select a Bank</option>
                        {this.state.banks.map(bank => <option key={bank.id} value={bank.code}>{bank.name}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="accountNo">Account No: </label>
                    <input 
                        type="text"
                        name="accountNo"
                        id="accountNo"
                        value={(this.state.success) ? "" : this.state.accountNo}
                        onChange={this.handleAccount}
                        required
                        maxLength={10}
                    />
                </div>
                <div>
                    <label htmlFor="accountName">Account Name: </label>
                    <input 
                        type="text"
                        id="accountName"
                        name="accountName"
                        defaultValue={this.state.accountName}
                        disabled
                    />
                    {(this.state.isVerifying) ? 
                    <div className="TransferForm-ac-loader">
                        <i className="fas fa-spinner fa-spin"></i>
                    </div> : null}
                </div>
                <div>
                    <label htmlFor="amount">Amount: </label>
                    <input 
                        type="text"
                        name="amount"
                        id="amount"
                        value={this.state.amount}
                        onChange={this.handleAmount}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="reason">Description</label>
                    <input 
                        type="text"
                        id="reason"
                        name="reason"
                        value={this.state.reason}
                        onChange={this.handleReason}
                        required
                        maxLength={30}
                    />
                </div>
                <div id="TransferForm-button">
                    <button>Continue</button>
                </div>
            </form>
        )
    }
}

export default TransferForm;