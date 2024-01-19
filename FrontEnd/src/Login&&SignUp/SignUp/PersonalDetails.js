import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import natives from ".././Data/natives.js";
import genderOptions from ".././Data/gender.js";

const PersonalDetails = ({
  personalDetails,
  onInputChange,
  nextButtonClicked,
  firstNameValid,
  lastNameValid,
  validateFirstName,
  validateLastName,
                             validateBirthdate,
  birthDateValid,
  nativeLanguageValid,
  genderValid,
  validateNativeLanguage,
  validateGender,
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "firstName":
        validateFirstName(value);
        break;
      case "lastName":
        validateLastName(value);
        break;
      case "birthday":
          validateBirthdate(value);
        break;
      default:
        break;
    }

    onInputChange(e);
  };
  const handleLanguageChange = (e) => {
    const { value } = e.target;
    validateNativeLanguage(value)
    onInputChange({ target: { name: "nativeLanguage", value } });
  };
  const handleGenderChange = (e) => {
    const { value } = e.target;
    validateGender(value);
    onInputChange({ target: { name: "gender", value } });
  };
    const today = new Date();
    const currentYear = today.getFullYear();

    // Calculate years for min and max dates for the calendar used in the form
    const minYear = currentYear - 101;
    const maxYear = currentYear - 10;
    // Set minimum and maximum dates
    const minDate = new Date();
    minDate.setFullYear(minYear);

    const maxDate = new Date();
    maxDate.setFullYear(maxYear);
  return (
    <>

      <div>
        <InputText
          placeholder="First Name"
          type="text"
          value={personalDetails.firstName}
          onChange={handleInputChange}
          name="firstName"
          className={
            !firstNameValid && nextButtonClicked ? "p-invalid w-11" : "w-11"
          }
        />
         </div>
        {!firstNameValid && nextButtonClicked && (
          <small className="p-error">The field is required</small>
        )}
      <br />
      <div>
        <InputText
          placeholder="Middle Name"
          type="text"
          value={personalDetails.middleName}
          onChange={handleInputChange}
          name="middleName"
          className="w-11"
        />
      </div>
      <br />
      <div>
        <InputText
          placeholder="Last Name"
          type="text"
          value={personalDetails.lastName}
          onChange={handleInputChange}
          name="lastName"
          className={
            !lastNameValid && nextButtonClicked ? "p-invalid w-11" : "w-11"
          }
        />
          </div>
        {!lastNameValid && nextButtonClicked && (
          <small className="p-error">The field is required</small>
        )}
      <br />
      <div>
        <Calendar
          value={personalDetails.birthDate}
          onChange={handleInputChange}
          showIcon
          name="birthDate"
          placeholder="Birth Date"
          minDate={minDate}
          maxDate={maxDate}
          className={ !birthDateValid && nextButtonClicked ? "p-invalid w-11" : "w-11"}
        />
         </div>
        {!birthDateValid && nextButtonClicked && (
          <small className="p-error">The field is required</small>
        )}
      <br />
      <div>
        <Dropdown
          value={personalDetails.nativeLanguage}
          onChange={handleLanguageChange}
          optionLabel="name"
          placeholder="Native Language"
          options={natives}
          className={!nativeLanguageValid && nextButtonClicked
              ? "p-invalid w-11"
              : "w-11 md:w-14rem:"
          }
        />
        </div>
        {!nativeLanguageValid && nextButtonClicked && (
          <small className="p-error">The field is required</small>
        )}
      <br />
      <div>
        <Dropdown
          value={personalDetails.gender}
          onChange={handleGenderChange}
          optionLabel="name"
          placeholder="Gender"
          options={genderOptions}
          className={
            !genderValid && nextButtonClicked
              ? "p-invalid w-11"
              : "w-11 md:w-14rem:"
          }
        />
         </div>
        {!genderValid && nextButtonClicked && (
          <small className="p-error">The field is required</small>
        )}
    </>
  );
};

export default PersonalDetails;
