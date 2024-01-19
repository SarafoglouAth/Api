import axios from "axios";
import { Button } from 'primereact/button';
import { Image } from "primereact/image";
import { InputText } from 'primereact/inputtext';
import { Password } from "primereact/password";
import { Toast } from 'primereact/toast';
import React, { useState } from "react";
import "./Login.css";
import Signup from "../SignUp/Signup";

function Login({ PassSecurity}) {
    const url = "https://localhost:7060/api/Authenticate/login";
    const [errorMessages, setErrorMessages] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false); // State to toggle between login and sign-up views
    const [showSuccess, setShowSuccess] = useState(false);
    const toast = React.useRef(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSignUpClick = () => {

        setShowSignUp(true); // Show the sign-up view when "Sign Up" button is clicked
    };

    const handleLogin = (e) => {
        setShowSignUp(false); // Show the sign-up view when "Sign Up" button is clicked
    };

    const handleSignUpSuccess = () => {
        setShowSuccess(true); // Show the success message when the user is created
        setShowSignUp(false); //
        toast.current.show({
            severity: 'success',
            summary: 'SignUp successful',
            detail: "Your account has been created",
        })
    }

    const handleSubmit = (event) => {
        //Prevent page reload
        event.preventDefault();
        let login = {username, password};
        axios.post(url, login)
            .then(successResponse => {
                localStorage.setItem("token", successResponse.data.token);
                toast.current.show({
                    severity: 'success',
                    summary: 'Login Successful',
                    detail: "Mr. " + username + " Please wait while we redirect you to the dashboard"
                })
                PassSecurity();
            })
            .catch(errorResponse =>
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: errorResponse.response?.data?.statusText ?? 'Login Failed',
                }) &&
                setErrorMessages(errorResponse.response?.data?.statusText ?? 'Could not login')
            );
    };


    // JSX code for login form
    const renderForm = (<>
        <form className="login-form">
            <img
                src="https://i.ibb.co/VWh5mkP/logo.png" alt="logo"
                className="fb-logo"
            />
            <div className="fb-login-header">
                <h1>Log in</h1>
            </div>
            <div className="field">
                <label htmlFor="username">Username</label>
                <InputText id="username" className="w-11" value={username} required
                           onChange={(e) => setUsername(e.target.value)}/>
            </div>
                <div className="field">
                <label htmlFor="password">Password</label>
                <Password toggleMask id="password" value={password} feedback={false} className="w-11"
                                                                    onChange={(e) => setPassword(e.target.value)}
                                                                    required/>
    </div>
    <Button label="Login" className="fb-login-button" onClick={handleSubmit}/>
    <div className={'text-red-500'}>{errorMessages}</div>
    <hr/>
    <Button onClick={handleSignUpClick} label="Create a new account" link/>

        </form>

        {showSuccess ? <p>Your account has been created</p> : ""}
    </>);

    const renderSignUp = (
        <div className="login-form">
            <img
                src="https://i.ibb.co/VWh5mkP/logo.png" alt="logo"
                className="fb-logo"
            />
            <div className="fb-login-header">
                <h1>Sign Up</h1>
            </div>
            <Signup handleSignUpSuccess={handleSignUpSuccess}/>
            <hr/>
            <Button onClick={handleLogin} label="Go back to Login" link/>
        </div>

    )

    return (<div className="Login">
        <Toast ref={toast}/>
        <div className="left-section">
            <Image src="https://i.ibb.co/bX9DRYX/Pngtree-log-in-login-interface-computer-3945571.png" alt="Login"
                   width="60%"/>
        </div>
        <div className="right-section">
            {!showSignUp ? renderForm : renderSignUp}
        </div>
    </div>);
}

export default Login;
