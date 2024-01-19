import { InputText } from "primereact/inputtext";
import { useState } from "react";

const ContactInfo = ({
  personalDetails,
  onInputChange,
  nextButtonClicked,
  emailValid,
  mobileNumberValid,
  landlineNumberValid,
  validateEmail,
  validateMobileNumber,
  validateLandlineNumber
}) => {

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Perform validation based on the input name
    switch (name) {
      case "email":
        validateEmail(value);
        break;
      case "mobilenumber":
        validateMobileNumber(value);
        break;
      case "landlineNumber":
        validateLandlineNumber(value);
        break;
      default:
        break;
    }

    // Propagate the input change to the parent component
    onInputChange(e);
  };

  return (
    <>

      <InputText
        placeholder="Email"
        type="email"
        value={personalDetails.email}
        onChange={handleInputChange}
        name="email"
        className={!emailValid  && nextButtonClicked? "p-invalid w-11" : "w-11"}
      />
      <br />
      {!emailValid && nextButtonClicked && (
        <small className="p-error">Please enter a valid email address</small>
      )}
      <br />
      <InputText
        placeholder="Mobile Number"
        type="tel"
        value={personalDetails.mobilenumber}
        onChange={handleInputChange}
        name="mobilenumber"
        className={!mobileNumberValid && nextButtonClicked ? "p-invalid w-11" : "w-11"}
      />
      <br />
      {!mobileNumberValid && nextButtonClicked && (
        <small className="p-error">
          Please enter a valid 10-digit mobile number
        </small>
      )}
      <br />
      <InputText
        placeholder="Landline Number"
        type="tel"
        value={personalDetails.landlineNumber}
        onChange={handleInputChange}
        name="landlineNumber"
        className={!landlineNumberValid ? "p-invalid w-11" : "w-11"}
      />
      <br />
      {!landlineNumberValid && (
        <small className="p-error">
          Please enter a valid landline number (at least 8 digits)
        </small>
      )}
    </>
  );
};

export default ContactInfo;
