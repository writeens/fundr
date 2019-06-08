/**
 * This component handles a direct transfer being made to a recipient
 * who has already been registered.
 */

// Imports
import React, { Component } from 'react'
import axios from "axios"
import "./DirectForm.css"

/**
 * create instance of axios library with authentication
 */
let axios_pay = axios.create({
    baseURL: "https://api.paystack.co",
    headers: {"Authorization": `Bearer ${process.env.REACT_APP_SECRET_API_KEY}`}
})

// Component class
class DirectForm extends Component {
    constructor(props){
        super(props);
        /**
         * Initial state set and all methods used are bound
         */
        this.state = {recipients:[], recipient:{}, recipientCode:"", amount:"", reason:"", defaultSelect:"Select a Recipient"}
        this.handleSelect = this.handleSelect.bind(this);
        this.handleAmount = this.handleAmount.bind(this);
        this.handleReason = this.handleReason.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    /**
     * When component mounts,
     * retrieve all the previously stored recipients
     */
    componentDidMount(){
        axios_pay.get("/transferrecipient").then(res => {
            let allRecipients = res.data.data
            this.setState({recipients: allRecipients});
        })
    }
    /**
     * This handles the selection of a recipient,
     * it also stores all the recipient's details in an object for use
     */
    handleSelect(evt){
        this.setState({recipientCode: evt.target.value}, ()=>{
            if(this.state.recipientCode){
                let selectedRecipient = [this.state.recipients.filter(recipient => recipient.recipient_code === this.state.recipientCode)[0]][0]
                this.setState(st => ({
                    recipient: {recipientCode: selectedRecipient.recipient_code,
                                name: selectedRecipient.name,
                                bank: selectedRecipient.details.bank_name,
                                bank_code: selectedRecipient.details.bank_code,
                                accountNumber: selectedRecipient.details.account_number
                    }
                }))
            }
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
     * This handles the the submit button,
     * all the details retrieved from the form
     *  are sent to the Parent Component 
     */
    handleSubmit(evt){
        evt.preventDefault()
        this.props.update(this.state.amount, this.state.recipient, this.state.reason)
    }

    /**
     * Renders <DirectForm />
     */
    render(){
        return(
            <form onSubmit={this.handleSubmit} className="DirectForm">
                <div>
                    <label htmlFor="Recipient">Transfer To</label>
                    <select value={this.state.recipientCode} onChange={this.handleSelect}>
                        <option disabled value="">Select a Recipient</option>
                        {this.state.recipients.map(recipient => <option key={recipient.id} value={recipient.recipient_code}>{recipient.name}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="accountNo">Account No</label>
                        <input 
                            type="text"
                            name="accountNo"
                            id="accountNo"
                            defaultValue={this.state.recipient.accountNumber}
                            disabled
                            required
                        />
                </div>
                <div>
                    <label htmlFor="bank">Bank</label>
                        <input 
                            type="text"
                            name="bank"
                            id="bank"
                            defaultValue={this.state.recipient.bank}
                            disabled
                            required
                        />
                </div>
                <div>
                    <label htmlFor="amount">Amount</label>
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
                <div id="DirectForm-button">
                    <button>Continue</button>
                </div>
            </form>
        )
    }
}
export default DirectForm;