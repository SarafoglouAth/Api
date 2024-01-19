import React, { useState } from "react";
import { Button } from "primereact/button";
import PersonalDetails from "./PersonalDetails";
import ContactInfo from "./ContactInfo";
import AddressInfo from "./AddressInfo";
import IdInfo from "./IdInfo";
import UsernamePassword from "./UsernamePassword";
import { Card } from "primereact/card";
import { useSignUp } from "./useSignUp";

const Signup = ({handleSignUpSuccess}) => {
  const [usernameValid, setUsernameValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState({
    lowercase: false,
    uppercase: false,
    numeric: false,
    length: false,
  });
  const [firstNameValid, setFirstNameValid] = useState(true);
  const [lastNameValid, setLastNameValid] = useState(true);
  const [birthDateValid, setBirthdateValid] = useState(true);
  const [nativeLanguageValid, setNativeLanguageValid] = useState(true);
  const [genderValid, setGenderValid] = useState(true);
  const [idNumberValid, setIdNumberValid] = useState(true);
  const [idTypeValid, setIdTypeValid] = useState(true);
  const [idIssueDateValid, setIdIssueDateValid] = useState(true);
  const [emailValid, setEmailValid] = useState(true);
  const [mobileNumberValid, setMobileNumberValid] = useState(true);
  const [landlineNumberValid, setLandlineNumberValid] = useState(true);
  const [addressValid, setAddressValid] = useState(true);
  const [countryofresidenceValid, setCountryOfResidenceValid] = useState(true);
  const [provinceValid, setProvinceValid] = useState(true);
  const [cityValid, setCityValid] = useState(true);
  const [postalCodeValid, setPostalCodeValid] = useState(true);
  const [nextButtonClicked, setNextButtonClicked] = useState(false);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    firstName: "",
    middleName: "",
    lastName: "",
    birthDate: null,
    nativeLanguage: null,
    gender: null,
    photoIDNumber: "",
    photoIDType: null,
    photoIDIssueDate: null,
    email: "",
    mobilenumber: "",
    address: "",
    addressLine2: "",
    countryOfResidence: null,
    province: "",
    state: "",
    townCity: "",
    postalCode: "",
    territory: ""
  });
  const { loading, signUp } = useSignUp();

formData.state=formData.province;
formData.territory=formData.townCity;
  const nextStep = async () => {
    if (step === 0) {
      const { userName, password } = formData;
      const isUsernameValid = userName.trim().length >= 4;
      const isPasswordValid =
        password.trim().length >= 8 &&
        /[a-z]/.test(password) &&
        /[A-Z]/.test(password) &&
        /[0-9]/.test(password);

      validateUsername(isUsernameValid);
      validatePassword(isPasswordValid);

      if (isUsernameValid && isPasswordValid) {
        setStep((currentStep) => currentStep + 1);
      }
    } else if (step === 1) {
      if (nextButtonClicked) {
        const { firstName, lastName, birthDate, nativeLanguage, gender } =
          formData;

        const isFirstNameValid = firstName.trim().length > 0;
        const isLastNameValid = lastName.trim().length > 0;
        const isBirthdateValid = birthDate !== null;
        const isNativeLanguageValid = nativeLanguage !== null;
        const isGenderValid = gender !== null;

        validateFirstName(isFirstNameValid);
        validateLastName(isLastNameValid);
        validateBirthdate(isBirthdateValid);
        validateNativeLanguage(isNativeLanguageValid);
        validateGender(isGenderValid);

        if (
          isFirstNameValid &&
          isLastNameValid &&
          isBirthdateValid &&
          isNativeLanguageValid &&
          isGenderValid
        ) {
          setStep((currentStep) => currentStep + 1);
        }
      } 
    } else if (step === 2) {
      if (nextButtonClicked) {
        const { photoIDNumber, photoIDType, photoIDIssueDate } = formData;
  
        const isIdNumberValid = photoIDNumber.trim().length > 0;
        const isIdTypeValid = photoIDType !== null;
        const isIssueDateValid = photoIDIssueDate !== null;
  
        validateIdNumber(isIdNumberValid);
        validateIdType(isIdTypeValid);
        validateIdIssueDate(isIssueDateValid);
  
        if (isIdNumberValid && isIdTypeValid && isIssueDateValid) {
          setStep((currentStep) => currentStep + 1);
        }
      }
    } else if (step === 3) {
      if (nextButtonClicked) {
        const { email, mobilenumber, } = formData;

        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
        const isMobileNumberValid = /^\d{10}$/.test(mobilenumber.trim());

        validateEmail(isEmailValid);
        validateMobileNumber(isMobileNumberValid);

        if (isEmailValid && isMobileNumberValid) {
          setStep((currentStep) => currentStep + 1);
        }
      }
    }
  };

  const handleNextButtonClick = (e) => {
    e.preventDefault();
    setNextButtonClicked(true);
    nextStep();
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    setNextButtonClicked(true);

    if (step === 4) {
      const {
        address,
        addressLine2,
        countryOfResidence,
        province,
        townCity,
        postalCode,
      } = formData;

      const isAddressValid = address.trim().length > 0;
      const isCountryofResidenceValid = countryOfResidence !== null;
      const isProvinceValid = province.trim().length > 0;
      const isCityValid = townCity.trim().length > 0;
      const isPostalCodeValid = postalCode.trim().length > 0;

      validateAddress(isAddressValid);
      validateCountryOfResidence(isCountryofResidenceValid);
      validateProvince(isProvinceValid);
      validateCity(isCityValid);
      validatePostalCode(isPostalCodeValid);

      if (
        isAddressValid &&
        isProvinceValid &&
        isCountryofResidenceValid &&
        isCityValid &&
        isPostalCodeValid
      ) {
        handleSignUpSuccess();
        await signUp(formData);

      }
    }
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const validateUsername = (isValid) => {
    setUsernameValid(isValid);
  };

  const validatePassword = (isValid) => {
    setPasswordValid(isValid);
  };

  const validateFirstName = (isValid) => {
    setFirstNameValid(isValid);
  };

  const validateLastName = (isValid) => {
    setLastNameValid(isValid);
  };

  const validateBirthdate = (isValid) => {
    setBirthdateValid(isValid);
  };
  const validateNativeLanguage = (isValid) => {
    setNativeLanguageValid(isValid);
  };

  const validateGender = (isValid) => {
    setGenderValid(isValid);
  };

  const validateIdNumber = (isValid) => {
    setIdNumberValid(isValid);
  };

  const validateIdType = (isValid) => {
    setIdTypeValid(isValid);
  };

  const validateIdIssueDate = (isValid) => {
    setIdIssueDateValid(isValid);
  };

  const validateEmail = (isValid) => {
    setEmailValid(isValid);
  };

  const validateMobileNumber = (isValid) => {
    setMobileNumberValid(isValid)
  };

  const validateLandlineNumber = (isValid) => {
    setLandlineNumberValid(isValid)
  };

  const validateAddress = (isValid) => {
    setAddressValid(isValid);
  };

  const validateCountryOfResidence = (isValid) => {
    setCountryOfResidenceValid(isValid);
  };

  const validateProvince = (isValid) => {
    setProvinceValid(isValid);
  };

  const validateCity = (isValid) => {
    setCityValid(isValid);
  };

  const validatePostalCode = (isValid) => {
    setPostalCodeValid(isValid);
  };

  return (
<>

            {step === 0 && (
              <UsernamePassword
                personalDetails={formData}
                onInputChange={onInputChange}
                nextButtonClicked={nextButtonClicked}
                usernameValid={usernameValid}
                passwordValid={passwordValid}
                validateUsername={validateUsername}
                validatePassword={validatePassword}
              />
            )}
            {step === 1 && (
              <PersonalDetails
                personalDetails={formData}
                onInputChange={onInputChange}
                nextButtonClicked={nextButtonClicked}
                firstNameValid={firstNameValid}
                lastNameValid={lastNameValid}
                birthDateValid={birthDateValid}
                nativeLanguageValid={nativeLanguageValid}
                genderValid={genderValid}
                validateFirstName={validateFirstName}
                validateLastName={validateLastName}
                validateBirthdate={validateBirthdate}
                validateNativeLanguage={validateNativeLanguage}
                validateGender={validateGender}
              />
            )}
            {step === 2 && (
              <IdInfo
                personalDetails={formData}
                onInputChange={onInputChange}
                nextButtonClicked={nextButtonClicked}
                idNumberValid={idNumberValid}
                idTypeValid={idTypeValid}
                idIssueDateValid={idIssueDateValid}
                validateIdNumber={validateIdNumber}
                validateIdType={validateIdType}
                validateIdIssueDate={validateIdIssueDate}
              />
            )}
            {step === 3 && (
              <ContactInfo
                personalDetails={formData}
                onInputChange={onInputChange}
                nextButtonClicked={nextButtonClicked}
                emailValid={emailValid}
                mobileNumberValid={mobileNumberValid}
                landlineNumberValid={landlineNumberValid}
                validateEmail={validateEmail}
                validateMobileNumber={validateMobileNumber}
                validateLandlineNumber={validateLandlineNumber}
              />
            )}
            {step === 4 && (
              <AddressInfo
                personalDetails={formData}
                onInputChange={onInputChange}
                nextButtonClicked={nextButtonClicked}
                addressValid={addressValid}
                cityValid={cityValid}
                countryofresidenceValid={countryofresidenceValid}
                provinceValid={provinceValid}
                postalCodeValid={postalCodeValid}
                validateAddress={validateAddress}
                validateCountryOfResidence={validateCountryOfResidence}
                validateCity={validateCity}
                validatePostalCode={validatePostalCode}
                validateProvince={validateProvince}
              />
            )}

            <br />

            {step > 0 && (
              <Button label="Prev" className="mr-2" onClick={prevStep} />
            )}
            {step <= 3 && (
              <Button
                label="Next"
                className="mr-2"
                onClick={handleNextButtonClick}
              />
            )}
            {step === 4 && <Button label="Submit" onClick={handleSubmit} />}
          </>

  );
};

export default Signup;
