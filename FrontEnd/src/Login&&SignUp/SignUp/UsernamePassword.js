import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { TiTick, TiTimes } from "react-icons/ti";

const UsernamePassword = ({
  personalDetails,
  onInputChange,
  nextButtonClicked,
  usernameValid,
  passwordValid,
  validateUsername,
  validatePassword,
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validate Username
    if (name === "userName") {
      const isUsernameValid = value.trim().length >= 4;
      validateUsername(isUsernameValid);
    }

    // Validate Password
    if (name === "password") {
      const lowercaseRegex = /[a-z]/;
      const uppercaseRegex = /[A-Z]/;
      const numericRegex = /[0-9]/;
      const hasLowercase = lowercaseRegex.test(value);
      const hasUppercase = uppercaseRegex.test(value);
      const hasNumeric = numericRegex.test(value);
      const hasLength = value.length >= 8;

      // Update state for each password criterion
      validatePassword({
        lowercase: hasLowercase,
        uppercase: hasUppercase,
        numeric: hasNumeric,
        length: hasLength,
      });
    }

    // Call the parent onInputChange function to update the form data
    onInputChange(e);
  };

  const renderTickOrCross = (isValid) => {
    return isValid ? (
      <TiTick color="green" size={20} />
    ) : (
      <TiTimes color="red" size={20} />
    );
  };

  const header = <h4>Password Requirements</h4>;

  const footer = (
    <small>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li
          style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}
        >
          {renderTickOrCross(passwordValid.lowercase)}{" "}
          <span style={{ marginLeft: "5px" }}>At least one lowercase</span>
        </li>
        <li
          style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}
        >
          {renderTickOrCross(passwordValid.uppercase)}{" "}
          <span style={{ marginLeft: "5px" }}>At least one uppercase</span>
        </li>
        <li
          style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}
        >
          {renderTickOrCross(passwordValid.numeric)}{" "}
          <span style={{ marginLeft: "5px" }}>At least one numeric</span>
        </li>
        <li
          style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}
        >
          {renderTickOrCross(passwordValid.length)}{" "}
          <span style={{ marginLeft: "5px" }}>Minimum 8 characters</span>
        </li>
      </ul>
    </small>
  );

  return (

<>
      <div className="field">
        <InputText
          placeholder="Username"
          type="text"
          value={personalDetails.userName}
          onChange={handleInputChange}
          name="userName"
          autoFocus
          className={!usernameValid  && nextButtonClicked ? "p-invalid w-11" : "w-11"}
        />
        {!usernameValid && (
        <small className="p-error">Username must be at least 4 characters</small>
      )}
      </div>
  <div className="field">
        <Password
          placeholder="Password"
          value={personalDetails.password}
          onChange={handleInputChange}
          header={header}
          footer={footer}
          name="password"
          className={
            (!passwordValid.lowercase ||
              !passwordValid.uppercase ||
              !passwordValid.numeric ||
              !passwordValid.length) &&
            personalDetails.password !== ""
              ? "p-invalid w-11"
              : "w-11"
          }
          toggleMask
        />
      </div>
</>
  );
};

export default UsernamePassword;
