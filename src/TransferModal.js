/**
 * This Component handles the modal upon transfer.
 */
import React, { Component } from 'react';
import "./TransferModal.css";

// Component class
class TransferModal extends Component {
    constructor(props){
        super(props);

        /**
         * Initial state set and all methods used are bound
         */
        this.state = {otp: ""}
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.renderModal = this.renderModal.bind(this);
    }

    /**
     * 
     * It also validates the otp and ensures it is made up of numbers only
     */
    handleChange(evt){
        let regex = /^[0-9]*$/g
        if(regex.test(evt.target.value)){
            this.setState({otp: evt.target.value})
        } else {
            this.setState({otp: this.state.otp})
        }
        
    }
    /**
     * This handles the submitting of the otp to the Parent Component
     */
    handleSubmit(evt){
        evt.preventDefault();
        this.props.finalizeTransfer(this.state.otp)
    }
    /**
     * Closes modal
     */
    handleClose(){
        this.props.closeModal()
    }
    handleClear(){
        this.props.clear()
    }
    renderModal(){
        if(this.props.success){
            return(
                <div className="Modal">
                            <div className="Modal-success">Success</div>
                            <div className="Modal-success-details">
                                <svg
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="40"
                                    height="50"
                                    viewBox="0 0 80 80">
                                    <title>tick-mark</title>
                                    <path
                                    className="path-circle"
                                    stroke="#0c243b"
                                    strokeWidth="3"
                                    fill="none"
                                    strokeLinecap="butt"
                                    strokeLinejoin="butt"
                                    d="M 75,40 A 35,35   0 0 1 40,75  M40,75 A 35,35   0 0 1 5,40  M5,40 A 35,35   0 0 1 40,5  M40,5 A 35,35   0 0 1 75,40"/>
                                    <path
                                    className="path-tick"
                                    stroke="#0c243b"
                                    strokeWidth="3"
                                    fill="none"
                                    strokeLinecap="butt"
                                    strokeLinejoin="butt"
                                    d="M 25,45 35,55 60,30"/>
                                </svg>
                                <button className="Modal-cancel" onClick={this.handleClear}>Close</button>
                            </div>
                        </div>
            )
        } else if(this.props.finalize || this.props.loading){
            return(
                <div className="TransferModal-loader">
                    <i className="fas fa-spinner fa-spin"></i>
                </div>
            )
        } else {
            return (
                <div className="Modal">
                            <div className="Modal-text">
                        {`You are about to transfer
                        NGN ${this.props.amount}
                        from Fundr
                        to ${this.props.recipient.name}
                        of ${this.props.recipient.bank}`}
                    </div>
                    <form className="Modal-form">
                        <label htmlFor="otp">Enter OTP</label>
                        <input
                        type="text"
                        id="otp"
                        name="otp"
                        value={this.state.otp}
                        placeholder="Enter OTP"
                        onChange={this.handleChange}
                        required
                        maxLength={6}
                        />
                        <div className="Modal-buttons">
                            <button id="Modal-cancel" onClick={this.handleClose}>Cancel</button>
                            <button onClick={this.handleSubmit}>Done</button>
                        </div>
                    </form>
                        </div>
            )
        }
    }
    /**
     * Renders <TransferModal />
     */
    render(){
        return(
            <div className="wrapper">
                   {this.renderModal()}
            </div>
        )
    }
}

export default TransferModal;