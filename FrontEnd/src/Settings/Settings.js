import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import {classNames} from "primereact/utils";
import {Password} from "primereact/password";
import {Calendar} from "primereact/calendar";
import {RadioButton} from "primereact/radiobutton";
import {Button} from "primereact/button";
import {Toast} from "primereact/toast";
import moment from "moment/moment";
import {GetId} from "../../src/GetId";

function Settings({Username}) {

    const [Candidate, setCandidate] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const toast = useRef(null);
    const today = new Date();
    const currentYear = today.getFullYear();
    const [userID, setUserID] = useState();
    // Calculate years for min and max dates for the calendar used in the form
    const minYear = currentYear - 101;
    const maxYear = currentYear - 10;
    // Set minimum and maximum dates
    const minDate = new Date();
    minDate.setFullYear(minYear);

    const maxDate = new Date();
    maxDate.setFullYear(maxYear);




    useEffect(() => {
        const fetchCandidateData = async () => {
            try {
                const data = await GetId(Username);
                setUserID(data.userId);
                const response = await axios.get(
                    "https://localhost:7060/candidates/" + data.userId
                );
                setCandidate(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching Candidate data:", error);
            }
        };

        fetchCandidateData();
    }, [loading, Username]);
    const formatDateWithMoment = (dateString) => {
        const originalDate = moment(dateString);
        return originalDate.format('YYYY-MM-DD');
    };
    const handleUpdate = (event) => {
        event.preventDefault();
        setSubmitted(true);
        Candidate.birthDate=formatDateWithMoment(Candidate.birthDate);
        Candidate.photoIDIssueDate=formatDateWithMoment(Candidate.photoIDIssueDate);
        // Required field validation
        if (
            !Candidate.username ||
            !Candidate.firstName ||
            !Candidate.lastName ||
            !Candidate.gender ||
            !Candidate.nativeLanguage ||
            !Candidate.birthDate ||
            !Candidate.email ||
            !Candidate.address
        ) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Please fill in all required fields.',
            });
            return;
        }

        // Date validation
        if (
            !Candidate.birthDate ||
            isNaN(new Date(Candidate.birthDate).getTime()) ||
            !Candidate.photoIDIssueDate ||
            isNaN(new Date(Candidate.photoIDIssueDate).getTime())
        ) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Please enter valid dates for birth date and photo ID issue date.',
            });
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!Candidate.email || !emailRegex.test(Candidate.email)) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Please enter a valid email address.',
            });
            return;
        }

        handleTheUpdate();
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });

    };

     const handleTheUpdate = async () => {
        try {

            const response = await axios.put(`https://localhost:7060/candidates/settings/`+userID, Candidate );
            setLoading(true);
            console.log(response.data); // Handle the response as needed

            // Optionally, you can perform some action on successful update
            // For example, show a success message, redirect to another page, etc.
        } catch (error) {
            console.error('Error updating candidate:', error);
            // Handle the error, display an error message, etc.
        }
    };
    const onCategoryChange = (e) => {
        let _Candidate = { ...Candidate };

        _Candidate['photoIDType'] = e.value;
        setCandidate(_Candidate);
    };
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _Candidate = { ...Candidate };

        _Candidate[`${name}`] = val;

        setCandidate(_Candidate);
    };
    return (<div className="container backgroundWhite GroupFields ">
        <Toast ref={toast} />
        <h2>Edit Your Settings</h2><hr/>
        <form >

            <div className=" surface-overlay border-round border-1 my-3 p-3 text-center">
                <h3 className="text-center">User Credentials</h3> <hr/>
                <div className="field">
                    <label htmlFor="username" className="font-bold pr-8">
                        UserName
                    </label>
                    <InputText id="username"  value={Candidate.username} onChange={(e) => onInputChange(e, 'username')} required autoFocus className={classNames({ 'p-invalid': submitted && !Candidate.username })} />
                    {submitted && !Candidate.username && <small className="p-error">username is required.</small>}

                </div>
                <div className="field">
                    <label htmlFor="password" className="font-bold pr-8">
                        PassWord
                    </label>
                    <Password toggleMask id="password" value={Candidate.password}
                              onChange={(e) => onInputChange(e, 'password')} required
                              className={classNames({'p-invalid': submitted && !Candidate.password})}/>
                    {submitted && !Candidate.password && <small className="p-error">Password is required.</small>}

                    </div>

            </div>

            <div className="surface-overlay border-round border-1 my-3 p-3 text-center">
                <h3 className="text-center">Personal Information</h3> <hr/>
                <div className="field">
                    <label htmlFor="firstName" className="font-bold  pr-8">
                        FirstName
                    </label>
                    <InputText id="firstName" value={Candidate.firstName} onChange={(e) => onInputChange(e, 'firstName')} required rows={3} cols={20} autoFocus className={classNames({ 'p-invalid': submitted && !Candidate.firstName })} />
                    {submitted && !Candidate.firstName && <small className="p-error">firstName is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="middleName" className="font-bold pr-8">
                        MiddleName
                    </label>
                    <InputText id="middleName" value={Candidate.middleName} onChange={(e) => onInputChange(e, 'middleName')} required  rows={3} cols={20}  className={classNames({ 'p-invalid': submitted && !Candidate.middleName })} />
                    {submitted && !Candidate.middleName && <small className="p-error">middleName is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="lastName" className="font-bold pr-8">
                        LastName
                    </label>
                    <InputText id="lastName" value={Candidate.lastName} onChange={(e) => onInputChange(e, 'lastName')} required  rows={3} cols={20}  className={classNames({ 'p-invalid': submitted && !Candidate.lastName })} />
                    {submitted && !Candidate.lastName && <small className="p-error">lastName is required.</small>}

    </div>
                <div className="field">
                    <label htmlFor="gender" className="font-bold pr-8">
                        Gender
                    </label>
                    <InputText id="gender" value={Candidate.gender} onChange={(e) => onInputChange(e, 'gender')} required rows={3} cols={20}  className={classNames({ 'p-invalid': submitted && !Candidate.gender })} />
                    {submitted && !Candidate.gender && <small className="p-error">gender is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="nativeLanguage" className="font-bold pr-8">
                        Native Language
                    </label>
                    <InputText id="nativeLanguage" value={Candidate.nativeLanguage} onChange={(e) => onInputChange(e, 'nativeLanguage')} required  rows={3} cols={20}  className={classNames({ 'p-invalid': submitted && !Candidate.nativeLanguage })} />
                    {submitted && !Candidate.nativeLanguage && <small className="p-error">nativeLanguage is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="birthDate" className="font-bold pr-8">
                        BirthDate
                    </label>
                    <Calendar  id="birthDate" value={new Date(Candidate.birthDate)} onChange={(e) => onInputChange(e, 'birthDate')} required   dateFormat="yy-mm-dd" maxDate={maxDate} minDate={minDate} showIcon   readOnlyInput  className={classNames({ 'p-invalid': submitted && !Candidate.birthDate })} />
                    {submitted && !Candidate.birthDate && <small className="p-error">birthDate is required.</small>}
                </div>
                <div className="field text-center">
                    <label className="mb-3 font-bold pr-8 ">Photo ID Type</label>
                    <div className="flex align-items-center">
                        <div className="field-radiobutton col-6 ">
                            <RadioButton inputId="photoID1" name="photoIDType" value="Passport" onChange={onCategoryChange} checked={Candidate.photoIDType === "Passport"} />
                            <label htmlFor="photoID1">Passport</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="photoID2" name="photoIDType" value="CountryIDCard" onChange={onCategoryChange} checked={Candidate.photoIDType === "CountryIDCard"} />
                            <label htmlFor="photoID2">Country ID Card</label>
                        </div>

                    </div>
                </div>

                <div className="field">
                    <label htmlFor="photoIDNumber" className="font-bold pr-8">
                        PhotoIDNumber
                    </label>
                    <InputText id="photoIDNumber" value={Candidate.photoIDNumber} onChange={(e) => onInputChange(e, 'photoIDNumber')} required  rows={3} cols={20}  className={classNames({ 'p-invalid': submitted && !Candidate.photoIDNumber })} />
                    {submitted && !Candidate.photoIDNumber && <small className="p-error">photoIDNumber is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="photoIDIssueDate" className="font-bold pr-8">
                        PhotoIDIssueDate
                    </label>
                    <Calendar  id="photoIDIssueDate" value={new Date(Candidate.photoIDIssueDate)} onChange={(e) => onInputChange(e, 'photoIDIssueDate')} required   dateFormat="yy-mm-dd"  showIcon   readOnlyInput  className={classNames({ 'p-invalid': submitted && !Candidate.photoIDIssueDate })} />
                    {submitted && !Candidate.photoIDIssueDate && <small className="p-error">photoIDIssueDate is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="email" className="font-bold pr-8">
                        Email
                    </label>
                    <InputText id="email" value={Candidate.email} onChange={(e) => onInputChange(e, 'email')} required    className={classNames({ 'p-invalid': submitted && !Candidate.email })} />
                    {submitted && !Candidate.email && <small className="p-error">email is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="address" className="font-bold pr-8">
                        Address
                    </label>
                    <InputText id="address" value={Candidate.address} onChange={(e) => onInputChange(e, 'address')} required  rows={3} cols={20}  className={classNames({ 'p-invalid': submitted && !Candidate.address })} />
                    {submitted && !Candidate.address && <small className="p-error">address is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="addressLine2" className="font-bold pr-8">
                       Secondary Address Line
                    </label>
                    <InputText id="addressLine2" value={Candidate.addressLine2} onChange={(e) => onInputChange(e, 'addressLine2')} required  rows={3} cols={20}  className={classNames({ 'p-invalid': submitted && !Candidate.addressLine2 })} />
                    {submitted && !Candidate.addressLine2 && <small className="p-error">addressLine2 is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="countryOfResidence" className="font-bold pr-8">
                        Country Of Residence
                    </label>
                    <InputText id="countryOfResidence" value={Candidate.countryOfResidence} onChange={(e) => onInputChange(e, 'countryOfResidence')} required  rows={3} cols={20}  className={classNames({ 'p-invalid': submitted && !Candidate.countryOfResidence })} />
                    {submitted && !Candidate.countryOfResidence && <small className="p-error">countryOfResidence is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="state" className="font-bold pr-8">
                        State
                    </label>
                    <InputText id="state" value={Candidate.state} onChange={(e) => onInputChange(e, 'state')} required  rows={3} cols={20}  className={classNames({ 'p-invalid': submitted && !Candidate.state })} />
                    {submitted && !Candidate.state && <small className="p-error">state is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="territory" className="font-bold pr-8">
                        Territory
                    </label>
                    <InputText id="territory" value={Candidate.territory} onChange={(e) => onInputChange(e, 'territory')} required  rows={3} cols={20}  className={classNames({ 'p-invalid': submitted && !Candidate.territory })} />
                    {submitted && !Candidate.territory && <small className="p-error">territory is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="province" className="font-bold pr-8">
                        Province
                    </label>
                    <InputText id="province" value={Candidate.province} onChange={(e) => onInputChange(e, 'province')} required  rows={3} cols={20}  className={classNames({ 'p-invalid': submitted && !Candidate.province })} />
                    {submitted && !Candidate.province && <small className="p-error">province is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="townCity" className="font-bold pr-8">
                        TownCity
                    </label>
                    <InputText id="townCity" value={Candidate.townCity} onChange={(e) => onInputChange(e, 'townCity')} required  rows={3} cols={20}  className={classNames({ 'p-invalid': submitted && !Candidate.townCity })} />
                    {submitted && !Candidate.townCity && <small className="p-error">townCity is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="postalCode" className="font-bold pr-8">
                        PostalCode
                    </label>
                    <InputText id="postalCode" value={Candidate.postalCode} onChange={(e) => onInputChange(e, 'postalCode')} required  rows={3} cols={20}  className={classNames({ 'p-invalid': submitted && !Candidate.postalCode })} />
                    {submitted && !Candidate.postalCode && <small className="p-error">postalCode is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="landlineNumber" className="font-bold pr-8">
                        LandlineNumber
                    </label>
                    <InputText id="landlineNumber" value={Candidate.landlineNumber} onChange={(e) => onInputChange(e, 'landlineNumber')} required  rows={3} cols={20}  className={classNames({ 'p-invalid': submitted && !Candidate.landlineNumber })} />
                    {submitted && !Candidate.landlineNumber && <small className="p-error">landlineNumber is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="mobileNumber" className="font-bold pr-8">
                        MobileNumber
                    </label>
                    <InputText id="mobileNumber" value={Candidate.mobileNumber} onChange={(e) => onInputChange(e, 'mobileNumber')} required  rows={3} cols={20}  className={classNames({ 'p-invalid': submitted && !Candidate.mobileNumber })} />
                    {submitted && !Candidate.mobileNumber && <small className="p-error">mobileNumber is required.</small>}
                </div>

            </div>
        </form>
        <Button label="Save Changes"   onClick={handleUpdate}/>
    </div>);
}

export default Settings;


