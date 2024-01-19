import Nav from "../src/Nav/Nav"
import "primereact/resources/primereact.css";                  //core css
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import React, {useEffect, useState} from "react";
import Footer from "./Footer/Footer";
import Login from "./Login&&SignUp/Login/Login.js";
import {jwtDecode} from "jwt-decode";
import moment from "moment/moment";

function  App() {
    const [passSecurity, setPassSecurity] = useState(false);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true); // Added loading state
    const [name, setName] = useState(null);

    useEffect(() => {
        checkToken();
        function checkToken() {
            let validToken = false;
            const storedToken = localStorage.getItem("token");

            if (!!storedToken) {
                const userInfo = jwtDecode(storedToken);
                const expirationDate = moment.unix(userInfo.exp);

                if (expirationDate.isAfter(new Date())) {
                    validToken = true;
                    setRole(userInfo['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);
                    setName(userInfo["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"])
                }
            }

            if (!validToken) {
                FailSecurity();
                localStorage.removeItem("token");
            } else {
                setPassSecurity(true);
            }
            setLoading(false);
        }
    }, []);


    const PassSecurity = () => {
        setPassSecurity(true);
    }
    const FailSecurity = () => {
        setPassSecurity(false);
    }
    useEffect(() => {
        setLoading(true)
    }, [role]);
    const loadingScreen = () => {
        return <div className="animated fadeIn pt-1 text-center">Loading...</div>;
    };
    const renderLogin = () => {
        return <Login PassSecurity={PassSecurity}  />;
    };
    const renderApp = () => {
        return (
            <>
                <Nav FailSecurity={FailSecurity}  />
                <Footer/>
            </>
        );
    };
    return (<>

        { !passSecurity ? renderLogin() : renderApp() }

    </>);
}



export default App;

