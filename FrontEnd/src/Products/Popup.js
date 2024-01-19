import React, {useRef, useState} from 'react';
import './Popup.css';
import 'bootstrap/dist/css/bootstrap.min.css';
const  ReactPic="https://i.ibb.co/w6jL8Bp/ReactPic.webp";
const  NodeJSPic="https://i.ibb.co/FY4LXg4/Node-JSPic.webp";
const  AngularPic="https://i.ibb.co/9cvQ5YX/Angular-Pic.webp";

function Popup({TheProduct,handlePurchaseSubmit}) {


    const [cardNumber, setCardNumber] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [expirationMM, setExpirationMM] = useState('');
    const [expirationYY, setExpirationYY] = useState('');
    const [cvc, setCVC] = useState('');
    const [errors, setErrors] = useState({});

    const validateCardDetails = () => {
        let errors = {};

        if (!cardNumber || cardNumber.length < 16 || isNaN(cardNumber)) {
            errors.cardNumber = 'Please enter a valid 16-digit card number.';
        }

        if (!cardHolder || !/^[a-zA-Z ]+$/.test(cardHolder)) {
            errors.cardHolder = 'Please enter a valid card holder name.';
        }

        if (!expirationMM || !expirationYY || isNaN(expirationMM) || isNaN(expirationYY)) {
            errors.expiry = 'Please enter a valid expiration date.';
        } else {
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear() % 100;
            const currentMonth = currentDate.getMonth() + 1;

            if (expirationYY < currentYear || (expirationYY === currentYear && expirationMM < currentMonth)) {
                errors.expiry = 'Expiration date should be in the future.';
            }
        }

        if (!cvc || isNaN(cvc) || cvc.length < 3 || cvc.length > 4) {
            errors.cvc = 'Please enter a valid CVC.';
        }

        setErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSubmit = () => {
        const isValid = validateCardDetails();
        if (isValid) {

            handlePurchaseSubmit(TheProduct);
        }
    };

    return (
        <div>

            {/* ==============================================
	    Credit Card Payment Section
	    ===============================================*/}
            <section className="credit-card">
                <div className="container">
                    <div className="card-holder">
                        <div className="card-box bg-news">
                            <div className="row">
                                <div className="col-lg-6">
                                       <div className="product Mrg-50">
                                            <h3>{TheProduct.title}</h3>
                                            <img src={TheProduct.image} alt={TheProduct.title}/>
                                            <p>Price: {TheProduct.price} €</p>
                                        </div>
                                </div>
                                <div className="col-lg-6">

                                    <form>
                                        <div className="card-details">
                                            <h3 className="title">Credit Card Details</h3>
                                            <div className="row">
                                                <div className="form-group col-sm-7">
                                                    <div className="inner-addon right-addon">
                                                        <label form="card-holder">Card Holder</label>
                                                        <i className="far fa-user"></i>
                                                        <input
                                                            id="card-holder"
                                                            type="text"
                                                            className={`form-control ${errors.cardHolder ? 'is-invalid' : ''}`}
                                                            placeholder="Card Holder"
                                                            aria-label="Card Holder"
                                                            aria-describedby="basic-addon1"
                                                            value={cardHolder}
                                                            onChange={(e) => setCardHolder(e.target.value)}
                                                        />
                                                        {errors.cardHolder && (
                                                            <div className="invalid-feedback">{errors.cardHolder}</div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="form-group col-sm-5">
                                                    <label form="">Expiration Date</label>
                                                    <div className="input-group expiration-date w-auto">
                                                        <input
                                                            id="expiration-date"
                                                            type="text"
                                                            className={`form-control ${errors.expiry ? 'is-invalid' : ''}`}
                                                            placeholder="MM"
                                                            aria-label="MM"
                                                            aria-describedby="basic-addon1"
                                                            value={expirationMM}
                                                            onChange={(e) => setExpirationMM(e.target.value)}
                                                        />
                                                        <span className="date-separator">/</span>
                                                        <input
                                                            type="text"
                                                            className={`form-control ${errors.expiry ? 'is-invalid' : ''}`}
                                                            placeholder="YY"
                                                            aria-label="YY"
                                                            aria-describedby="basic-addon1"
                                                            value={expirationYY}
                                                            onChange={(e) => setExpirationYY(e.target.value)}
                                                        />
                                                        {errors.expiry && (
                                                            <div className="invalid-feedback">{errors.expiry}</div>
                                                        )}
                                                    </div>

                                                </div>
                                                <div className="form-group col-sm-8">
                                                    <div className="inner-addon right-addon">
                                                        <label form="card-number">Card Number</label>
                                                        <i className="far fa-credit-card"></i>
                                                        <input
                                                            id="card-number"
                                                            type="text"
                                                            className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`}
                                                            placeholder="Card Number"
                                                            aria-label="Card Number"
                                                            aria-describedby="basic-addon1"
                                                            value={cardNumber}
                                                            onChange={(e) => setCardNumber(e.target.value)}
                                                        />
                                                        {errors.cardNumber && (
                                                            <div className="invalid-feedback">{errors.cardNumber}</div>
                                                        )}
                                                         </div>
                                                </div>
                                                <div className="form-group col-sm-4">
                                                    <label form="cvc">CVC</label>
                                                    <input
                                                        id="cvc"
                                                        type="text"
                                                        className={`form-control ${errors.cvc ? 'is-invalid' : ''}`}
                                                        placeholder="CVC"
                                                        aria-label="CVC"
                                                        aria-describedby="basic-addon1"
                                                        value={cvc}
                                                        onChange={(e) => setCVC(e.target.value)}
                                                    />
                                                    {errors.cvc && (
                                                        <div className="invalid-feedback">{errors.cvc}</div>
                                                    )}
                                                     </div>
                                                <div className="form-group col-sm-12 ">
                                                    <button onClick={handleSubmit} type="button" className="btn btn-primary btn-block">Proceed</button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>

                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
}
export default Popup;