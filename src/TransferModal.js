import React, { Component } from 'react';
import "./TransferModal.css";

class TransferModal extends Component {
    constructor(props){
        super(props);

        this.state = {otp: ""}
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleClear = this.handleClear.bind(this);
    }

    handleChange(evt){
        this.setState({otp: evt.target.value})
    }
    handleSubmit(evt){
        evt.preventDefault()
        this.props.finalizeTransfer(this.state.otp)
    }
    handleClose(){
        this.props.closeModal()
    }
    handleClear(){
        this.props.clear()
    }
    render(){
        return(
            <div className="wrapper">
                    {(this.props.success) ?
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
                        </div> :
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
                        />
                        <div className="Modal-buttons">
                            <button id="Modal-cancel" onClick={this.handleClose}>Cancel</button>
                            <button onClick={this.handleSubmit}>Done</button>
                        </div>
                    </form>
                        </div>
                    }
            </div>
        )
    }
}

export default TransferModal;