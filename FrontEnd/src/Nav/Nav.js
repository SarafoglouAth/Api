import {BrowserRouter, Link, Route, Routes, useNavigate} from "react-router-dom";
import NotFoundPage from "./NotFoundPage";
import UsersCRUD from "../Admin/UsersCRUD";
import CandidatesCRUD from "../Admin/CandidatesCRUD";
import ProductShowcase from "../Products/ProductShowcase"
import CertificateCRUD  from "../Admin/CertificateCRUD";
import {useEffect, useState} from "react";
import CertificatesShowcase from "../Certificates/CertificatesShowcase";
import "./Nav.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserGraduate} from "@fortawesome/free-solid-svg-icons";
import Purchases from "../MyPurchases/Purchases";
import MarkExams from "../Admin/MarkExams";
import Products from "../Admin/Products";
import Settings from "../Settings/Settings";
import {jwtDecode} from "jwt-decode";
import moment from "moment";
import {GetId} from "../GetId";


export default function Nav({FailSecurity}) {
    const [Role, setRole] = useState(null);
    const token = localStorage.getItem("token");
    const [name, setName] = useState("");
    const [data, setData] = useState({});


    useEffect( () => {
        checkToken();

    }, [Role,token]);

    function checkToken() {
        let validToken = false;
        if (!!token) {
            const userInfo = jwtDecode(token);

            const expirationDate = new moment.unix(userInfo.exp);

            if (expirationDate.isAfter(new Date())) {
                validToken = true;
                setRole(userInfo['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'])
                setName(userInfo["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"])

            }
        }

        if (!validToken ) {
            FailSecurity();
            localStorage.removeItem("token");
        }
    }

    function hanleLogout() {
        FailSecurity();
        setName("");
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        window.location.reload();
        window.location.href = "/";
    }

    useEffect(() => {
        if (name !== "") {
            async function fetchData() {
                const response =  await GetId(name);
                setData(response);
                console.log(data)
            }
            fetchData();
            console.log(data)

        }

    }, [name]);

    return (
        <div className="Application">
        <BrowserRouter>

            <nav >


                        <Link  to="/">{Role==="Marker"?"Exams to Mark" : "Products"}    </Link>
                {(Role==="Admin"|| Role==="QualityControl") && <>
                        <Link  to="/Candidates" >Candidates   </Link>
                        <Link  to="/Users">Users     </Link>
                        <Link  to="/Certificates" >Certificates    </Link>
                        <Link  to="/MarkExams">Exam Delegation   </Link>
                    {Role!=="QualityControl" && <Link to="/Purchases">Mark Exams </Link>}
                    </>
                }
                {
                    Role==="Candidate"&& <>
                        <Link  to="/Purchases">Purchases </Link>
                        <Link  to="/CertificatesAcquired">Certificates Acquired   </Link>

                    </>
                }

                <div className="dropdown">
     <span className="icon">
         <p className="SignedAs">{Role==="Candidate" && <FontAwesomeIcon icon={faUserGraduate}/>} {name}</p>
     </span>
                    <div className="dropdown-content">
                        {Role==="Candidate"&&  <Link to="/Settings">Settings</Link>}
                        <p className="SignedAs" onClick={hanleLogout} >Logout</p>
                    </div>

                </div>

            </nav>

            <Routes>
                <Route path="/"  element = {Role ==="Candidate"? <ProductShowcase data={data}/>: (Role==="QualityControl"|| Role ==="Admin" )? <Products  Role={Role}/>: <Purchases Role={Role} /> }/>

                {(Role==="Admin"|| Role==="QualityControl") && <>
                    <Route path="/Candidates"  element={<CandidatesCRUD Role={Role}/>} />
                    <Route path="/Users" element={<UsersCRUD Role={Role}/>} />
                    <Route path="/Certificates" element={<CertificateCRUD Role={Role}/>} />
                    <Route path="/MarkExams"  element={<MarkExams Role={Role} />} />
                    {Role !== "QualityControl"&& <Route path="/Purchases" element={<Purchases Role={Role} data={data}/>} />} </>}
                {Role==="Candidate" && <>
                    <Route path="/Purchases"  element={<Purchases Role={Role} data={data} />} />
                    <Route path="/CertificatesAcquired"  element={<CertificatesShowcase data={data}/>} />
                    <Route path="/Settings" element={<Settings Username={name}/>} />
                </>}
                {Role==="Marker" && <>
                    <Route path="/MarkExams"  element={<MarkExams Role={Role} />} /></>}
                <Route path="*" element={<NotFoundPage />} />

            </Routes>
        </BrowserRouter>
    </div>);
}