import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import idType from ".././Data/photoIDType.js";


const IdInfo = ({
  personalDetails,
  onInputChange,
  nextButtonClicked,
  idNumberValid,
  idTypeValid,
  idIssueDateValid,
  validateIdNumber,
  validateIdType,
  validateIdIssueDate,
}) => {
  const handleIdInputChange = (e) => {
    const { name, value } = e.target;

    // Perform validation based on the input name
    switch (name) {
      case "photoIDNumber":
        validateIdNumber(value);
        break;
      case "issueDate":
        validateIdIssueDate(value);
        break;
      default:
        break;
    }

    // Propagate the input change to the parent component
    onInputChange(e);
  };
  const handleIdTypeChange = (e) => {
    const { value } = e.target;
    validateIdType(value);
    onInputChange({ target: { name: "photoIDType", value } });
  };
  const today = new Date();
  const currentYear = today.getFullYear();

  // Calculate years for min and max dates for the calendar used in the form
  const minYear = currentYear +1;
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
          placeholder="ID Number"
          type="text"
          value={personalDetails.photoIDNumber}
          onChange={handleIdInputChange}
          name="photoIDNumber"
          className={!idNumberValid && nextButtonClicked ? "p-invalid w-11" : "w-11"}
        />
        </div>
      {!idNumberValid && nextButtonClicked && (
        <small className="p-error">This field is Required</small>
      )}  
      <br />
      <div>
        <Dropdown
          value={personalDetails.photoIDType}
          optionLabel="name"
          onChange={handleIdTypeChange}
          placeholder="ID Type"
          options={idType}
          className={!idTypeValid && nextButtonClicked ? "p-invalid w-11" : "w-11 md:w-14rem:"}
        />
        </div>
      {!idTypeValid && nextButtonClicked && (
        <small className="p-error">This field is Required</small>
      )}
      <br/>
      <div>
        <Calendar
          value={personalDetails.photoIDIssueDate}
          onChange={handleIdInputChange}
          name="photoIDIssueDate"
          placeholder="ID Issue Date"
          showIcon
          minDate={minDate}

          className={!idIssueDateValid && nextButtonClicked? "p-invalid  w-11" : "w-11"}
        />
      </div>
      {!idIssueDateValid && nextButtonClicked &&  (
        <small className="p-error">This field is Required</small>
      )}
    </>
  );
};

export default IdInfo;
