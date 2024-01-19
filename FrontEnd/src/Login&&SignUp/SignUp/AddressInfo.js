import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";
import countries from "../Data/countries"

const AddressInfo = ({
  personalDetails,
  onInputChange,
  nextButtonClicked,
  addressValid,
  provinceValid,
  cityValid,
  postalCodeValid,
  countryofresidenceValid,
  validateAddress,
  validateProvince,
  validateCity,
  validatePostalCode,
  validateCountryOfResidence,
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Perform validation based on the input name
    switch (name) {
      case "address":
        validateAddress(value);
        break;
      case "province":
        validateProvince(value);
        break;
      case "townCity":
        validateCity(value);
        break;
      case "postalCode":
        validatePostalCode(value);
        break;
      default:
        break;
    }

    // Propagate the input change to the parent component
    onInputChange(e);
  };
  const handlecountyChange = (e) => {
    const { value } = e.target;
    validateCountryOfResidence(value);
    onInputChange({ target: { name: "countryOfResidence", value } });
  };

  return (
    <>

      <div>
        <InputText
          placeholder="Address"
          onChange={handleInputChange}
          type="text"
          value={personalDetails.address}
          name="address"
          className={!addressValid && nextButtonClicked ? "p-invalid" : "w-11"}
        />
      </div>
      {!addressValid && nextButtonClicked && (
        <small className="p-error">The field is Required</small>
      )}
      <br />
      <InputText
        placeholder="Address Line 2"
        type="text"
        value={personalDetails.addressLine2}
        onChange={onInputChange}
        name="addressLine2"
        className="w-11"
      />
      <div>
        <br />
        <Dropdown
          value={personalDetails.countryOfResidence}
          onChange={handlecountyChange}
          optionLabel="name"
          placeholder="Country of residence"
          options={countries}
          className={
            !countryofresidenceValid && nextButtonClicked
              ? "p-invalid w-11"
              : "w-11 md:w-14rem:"
          }
        />
      </div>
      {!countryofresidenceValid && nextButtonClicked && (
        <small className="p-error">The field is Required</small>
      )}
      <br />
      <div>
        <InputText
          placeholder="State / Province"
          type="text"
          value={personalDetails.province}
          onChange={handleInputChange}
          name="province"
          className={
            !provinceValid && nextButtonClicked ? "p-invalid w-11" : "w-11"
          }
        />
      </div>
      {!provinceValid && nextButtonClicked && (
        <small className="p-error">The field is Required</small>
      )}
      <br />
      <div>
        <InputText
          placeholder="townCity"
          type="text"
          value={personalDetails.townCity}
          onChange={handleInputChange}
          name="townCity"

          className={!cityValid && nextButtonClicked? "p-invalid" : "w-11"}
        />
      </div>
      {!cityValid && nextButtonClicked && (
        <small className="p-error">The field is Required</small>
      )}

      <br />
      <div>
        <InputText
          placeholder="Postal Code"
          type="text"
          value={personalDetails.postalCode}
          onChange={handleInputChange}
          name="postalCode"
          className={!postalCodeValid && nextButtonClicked? "p-invalid" : "w-11"}
        />
      </div>
      {!postalCodeValid && nextButtonClicked && (
        <small className="p-error">The field is Required</small>
      )}
    </>
  );
};

export default AddressInfo;
