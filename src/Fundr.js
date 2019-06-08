/**
 * This Parent Component handles all transfers.
 */

 // Imports
import React, { Component } from 'react'
import axios from "axios";
import TransferForm from "./TransferForm";
import TransferModal from "./TransferModal";
import DirectForm from "./DirectForm";
import "./Fundr.css"

/**
 * create instance of axios library with authentication
 */
let axios_pay = axios.create({
    baseURL: "https://api.paystack.co",
    headers: {"Authorization": `Bearer ${process.env.SECRET_API}`}
})

// Component class
class Fundr extends Component {
    constructor(props){
        super(props);

        /**
         * Initial state set and all methods used are bound
         */
        this.state={amount:"", recipient:{}, directTransfer:true, isTransferring:false, transferCode:"", success:false}
        this.createRecipient = this.createRecipient.bind(this);
        this.initiateTransfer = this.initiateTransfer.bind(this);
        this.handleDirectTransfer = this.handleDirectTransfer.bind(this);
        this.handleNewTransfer = this.handleNewTransfer.bind(this);
        this.finalizeTransfer = this.finalizeTransfer.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.updateFundr = this.updateFundr.bind(this);
        this.clear = this.clear.bind(this);
    }

    /**
     * This method uses the Paystack API to create a recipient based on
     * the details being passed from <TransferForm /> component.
     * It also initiates a transfer once recipient has been created
     */
    createRecipient(bankCode, accountName, accountNumber, amount, reason){
        axios_pay.post("/transferrecipient", {
            type: accountNumber,
            name: accountName,
            account_number: accountNumber,
            bank_code: bankCode
        }).then(res => {
            if(res.status === 200 || res.status === 201){
                let data = res.data.data
                this.setState({
                    recipient: 
                        {recipientCode: data.recipient_code, 
                        name: data.name, 
                        bank: data.details.bank_name, 
                        bank_code: data.details.bank_code},
                    amount: amount
                }, this.initiateTransfer(amount, reason, data.recipient_code))
            }
        }).catch(err => {
            alert(err);
        })
    }
    /**
     * This method updates the state with the details being passed from <DirectForm /> component.
     * It also initiates a transfer 
     */
    updateFundr(amount, recipient, reason){
        this.setState({
            amount:amount,
            reason: reason,
            recipient: recipient
        }, this.initiateTransfer(amount, reason, recipient.recipientCode))
    }

    /**
     * This method initiates a transfer based on the amount, reason and recipient code
     * It uses the Paystack Initiate Transfer endpoint
     * It updates the state with the transferCode returned. 
     */
    initiateTransfer(amount, reason, rc_code){
        axios_pay.post("/transfer", {
            source: "balance",
            amount: amount * 100,
            reason: reason,
            recipient: rc_code
        }).then(res => {
            let tf_code = res.data.data.transfer_code
            this.setState(st => ({
                isTransferring:true,
                transferCode: tf_code
            }))
        })
    }
    /**
     * This method finalizes a transfer with the help of the Paystack
     * Finalize Transfer endpoint. It uses the otp retrieved from the
     * <TransferModal /> and the transfer code already in the state.
     * 
     */
    finalizeTransfer(otp){
        axios_pay.post("/transfer/finalize_transfer", {
            transfer_code: this.state.transferCode,
            otp:otp
        }).then(res => {
            if(res.status === 200){
                this.setState({success: true}, ()=>{
                    this.setState({
                        amount:"",
                        recipient:"",
                        transferCode:""
                    })
                })
            }
        }).catch(err => {
            alert(err);
            this.closeModal();
        })
    }
    /**
     * This method restores the <Fundr /> component state to its initial values;
     */
    clear(){
        if (this.state.directTransfer) {
            this.handleDirectTransfer();
        } else {
            this.handleNewTransfer();
        }
    }
    handleDirectTransfer(){
        this.setState({
            directTransfer: true,
            amount:"",
            recipient:"",
            isTransferring: false,
            transferCode:"",
            success:false
        })
    }
    handleNewTransfer(){
        this.setState({
            directTransfer: false,
            amount:"",
            recipient:"",
            isTransferring: false,
            transferCode:"",
            success:false
        })
    }
    /**
     * This removes the <TransferModal /> component from the view
     */
    closeModal(){
        this.setState({isTransferring:false})
    }

    /**
     * Renders <Fundr />
     */
    render(){
        return(
            <div className="Fundr">
                <div className="Fundr-sidebar">
                    <i className="fas fa-infinity"></i>
                    <h1 className="Fundr-sidebar-title">Fund<span>r</span></h1>
                </div>
                <div className="Fundr-main">
                    <div className="Fundr-main-switch">
                        <button style={(this.state.directTransfer) ? {backgroundColor:"#0c243b", color:"white"}: null} onClick={this.handleDirectTransfer}>Direct</button>
                        <button style={(!this.state.directTransfer) ? {backgroundColor:"#0c243b", color:"white"}: null} onClick={this.handleNewTransfer}>New Transfer</button>
                    </div>
                    <div>
                        {(this.state.directTransfer) ? <DirectForm update={this.updateFundr} initiateTransfer={this.initiateTransfer}></DirectForm> : <TransferForm createRecipient={this.createRecipient} />}
                    </div>
                    {(this.state.isTransferring) ? <TransferModal 
                                                amount={this.state.amount} 
                                                recipient={this.state.recipient}
                                                closeModal={this.closeModal}
                                                clear={this.clear}
                                                finalizeTransfer={this.finalizeTransfer}
                                                success={this.state.success}
                                                >
                                                
                                                </TransferModal> : null}
                </div>
            </div>
        )
    }
}

export default Fundr;