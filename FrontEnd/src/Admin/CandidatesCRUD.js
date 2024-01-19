import React, {useEffect, useRef, useState} from 'react';
import {classNames} from 'primereact/utils';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Toast} from 'primereact/toast';
import {Toolbar} from 'primereact/toolbar';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import {Dialog} from 'primereact/dialog';
import axios from "axios";
import {RadioButton} from "primereact/radiobutton";
import {Calendar} from "primereact/calendar";
import {Password} from "primereact/password";
import moment from 'moment';

export default function CandidatesCRUD({Role}) {

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
// setting an empty candidate to be used in the form
    let emptyCandidate = {
        userId: 0,
        username: '',
        password: '',
        id:0,
        firstName:'',
        middleName: '',
        lastName: '',
        gender: '',
        nativeLanguage: '',
        birthDate: new Date(maxDate),
        photoIDType: '',
        photoIDNumber: '',
        photoIDIssueDate: new Date(maxDate),
        email: '',
        address: '',
        addressLine2: '',
        countryOfResidence: '',
        state: '',
        territory: '',
        province: '',
        townCity: '',
        postalCode: '',
        landlineNumber: '',
        mobileNumber: '',
    };
    const [loading, setLoading] = useState(true);
    const [Candidates, setCandidates] = useState([]);
    const [CandidateDialog, setCandidateDialog] = useState(false);
    const [deleteCandidateDialog, setDeleteCandidateDialog] = useState(false);
    const [Candidate, setCandidate] = useState(emptyCandidate);
    const [selectedCandidates, setSelectedCandidates] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null);
    const dt = useRef(null);
    const [showPass, setShowPass] = useState(false);

// fetching the data from the api
    useEffect(() => {
        const fetchCandidateData = async () => {
            try {
                const response = await axios.get('https://localhost:7060/candidates');
                setCandidates(response.data);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching Candidate data:', error);
            }
        };

        fetchCandidateData();
    }, [loading]);


    const formatDateWithMoment = (dateString) => {
        const originalDate = moment(dateString);
        return originalDate.format('YYYY-MM-DD');
    };
    // CRUD operations
    const handleUpdate = async () => {
        try {
            Candidate.birthDate=formatDateWithMoment(Candidate.birthDate);
            Candidate.photoIDIssueDate=formatDateWithMoment(Candidate.photoIDIssueDate);
            // Assuming Candidate.id is the candidate's ID
            const response = await axios.put(`https://localhost:7060/candidates/Admin/`, Candidate );
            setLoading(true);
            console.log(response.data); // Handle the response as needed

            // Optionally, you can perform some action on successful update
            // For example, show a success message, redirect to another page, etc.
        } catch (error) {
            console.error('Error updating candidate:', error);
            // Handle the error, display an error message, etc.
        }
    };
    const handleCreate = async () => {
        try {
            Candidate.birthDate=formatDateWithMoment(Candidate.birthDate);
            Candidate.photoIDIssueDate=formatDateWithMoment(Candidate.photoIDIssueDate);
            const response = await axios.post('https://localhost:7060/candidates/Admin/', Candidate );

            setLoading(true);
            console.log(response.data); // Handle the response as needed
        } catch (error) {
            console.error('Error creating candidate:', error);
            // Handle the error, display an error message, etc.
        }
    };
    const handleDelete = async () => {
        try {
            // Assuming Candidate.id is the candidate's ID
            const response = await axios.delete(`https://localhost:7060/candidates/${Candidate.userId}`  );
            setLoading(true);
            console.log(response.data); // Handle the response as needed

            // Optionally, you can perform some action on successful update
            // For example, show a success message, redirect to another page, etc.
        } catch (error) {
            console.error('Error updating candidate:', error);
            // Handle the error, display an error message, etc.
        }
    };


// form validation and submission
    const saveCandidate = () => {
        setSubmitted(true);

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
        const isUsernameUnique = Candidates.every(
            (existingCandidate) =>
                existingCandidate.userId === Candidate.userId ||
                existingCandidate.username !== Candidate.username
        );

        if (!isUsernameUnique) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Username must be unique. Please choose a different username.',
            });
            return;
        }
        if (Candidate.userId !==0) {
            // If Candidate has an ID, it means we are updating an existing candidate
            handleUpdate();
        } else {
            // If Candidate doesn't have an ID, it means we are creating a new candidate
            handleCreate();
        }

        setCandidateDialog(false);
        setCandidate(emptyCandidate);
            };
//Export to CSV
    const exportCSV = () => {
        dt.current.exportCSV();
    };
    // opening the form that creates a new candidate
    const openNew = () => {
        setCandidate(emptyCandidate);
        setSubmitted(false);
        setShowPass(true);


        setCandidateDialog(true);
    };
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _Candidate = { ...Candidate };

        _Candidate[`${name}`] = val;

        setCandidate(_Candidate);
    };
    //Dialog state handlers
    const hideDialog = () => {
        setSubmitted(false);
        setCandidateDialog(false);
    };
    const hideDeleteCandidateDialog = () => {
        setDeleteCandidateDialog(false);
    };




    const deleteCandidate = () => {
        handleDelete();
        setDeleteCandidateDialog(false);
        setCandidate(emptyCandidate);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    };
    const onCategoryChange = (e) => {
        let _Candidate = { ...Candidate };

        _Candidate['photoIDType'] = e.value;
        setCandidate(_Candidate);
    };


    const leftToolbarTemplate = () => {
        return ( <>{Role==="Admin" &&

            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew}/>
            </div>

    }</>);
    };
    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };

    const CandidateDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={() => setCandidateDialog(false)} />
            <Button label="Save" icon="pi pi-check" onClick={saveCandidate}  />
        </React.Fragment>
    );

    const deleteCandidateDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteCandidateDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteCandidate} />
        </React.Fragment>
    );

    const actionBodyTemplate = (rowData) => {
        return (<>{Role==="Admin" &&
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editCandidate(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteCandidate(rowData)} />
            </React.Fragment>
        }</>)
    };
    const editCandidate = (Candidate) => {
        setShowPass(false);
        setCandidate({ ...Candidate });
        setCandidateDialog(true);

    };
    const confirmDeleteCandidate = (Candidate) => {
        setCandidate(Candidate);
        setDeleteCandidateDialog(true);
    }


    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>

                <DataTable

                    ref={dt}
                    value={Candidates}
                    selection={selectedCandidates}
                    onSelectionChange={(e) => setSelectedCandidates(e.value)}
                    dataKey="id"
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Candidates"
                    loading={loading}
                >
                    <Column key="userId" field="userId" header="User Id" sortable style={{ minWidth: '1rem' }}/>
                    <Column key="id" field="id" header="Candidate Id" sortable style={{ minWidth: '1rem' }}/>
                    <Column key="username" field="username" header="Username" sortable />
                    <Column key="firstName" field="firstName" header="First Name" sortable />
                    <Column key="middleName" field="middleName" header="Middle Name" sortable />
                    <Column key="lastName" field="lastName" header="Last Name" sortable />
                    <Column key="gender" field="gender" header="Gender" sortable />
                    <Column key="nativeLanguage" field="nativeLanguage" header="Native Language" sortable />
                    <Column key="birthDate" field="birthDate" header="birthDate"  sortable  />
                    <Column key="photoIDType" field="photoIDType" header="photoIDType" sortable />
                    <Column key="photoIDNumber" field="photoIDNumber" header="photoIDNumber" sortable />
                    <Column key="photoIDIssueDate" field="photoIDIssueDate" header="photoIDIssueDate" sortable />
                    <Column key="email" field="email" header="email" sortable />
                    <Column key="address" field="address" header="address" sortable />
                    <Column key="addressLine2" field="addressLine2" header="seccondary Adress" sortable />
                    <Column key="countryOfResidence" field="countryOfResidence" header="countryOfResidence" sortable />
                    <Column key="state" field="state" header="state" sortable />
                    <Column key="territory" field="territory" header="territory" sortable />
                    <Column key="province" field="province" header="province" sortable />
                    <Column key="townCity" field="townCity" header="townCity" sortable />
                    <Column key="postalCode" field="postalCode" header="postalCode" sortable />
                    <Column key="landlineNumber" field="landlineNumber" header="landlineNumber" sortable />
                    <Column key="mobileNumber" field="mobileNumber" header="mobileNumber" sortable />
                    <Column key="Actions" body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>

                </DataTable>
            </div>

            <Dialog  visible={CandidateDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Candidate Details" modal className="p-fluid" footer={CandidateDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="username" className="font-bold">
                        username
                    </label>
                    <InputText id="username"  value={Candidate.username} onChange={(e) => onInputChange(e, 'username')} required autoFocus className={classNames({ 'p-invalid': submitted && !Candidate.username })} />
                    {submitted && !Candidate.username && <small className="p-error">username is required.</small>}

                </div>
                {showPass && (<div className="field">
                    <label htmlFor="password" className="font-bold">
                        password
                    </label>
                    <Password toggleMask id="password" value={Candidate.password}
                              onChange={(e) => onInputChange(e, 'password')} required
                              className={classNames({'p-invalid': submitted && !Candidate.password})}/>
                    {submitted && !Candidate.password && <small className="p-error">Password is required.</small>}
                </div>)}
                <div className="field">
                    <label htmlFor="firstName" className="font-bold">
                        firstName
                    </label>
                    <InputText id="firstName" value={Candidate.firstName} onChange={(e) => onInputChange(e, 'firstName')} required rows={3} cols={20} autoFocus className={classNames({ 'p-invalid': submitted && !Candidate.firstName })} />
                    {submitted && !Candidate.firstName && <small className="p-error">firstName is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="middleName" className="font-bold">
                        middleName
                    </label>
                    <InputText id="middleName" value={Candidate.middleName} onChange={(e) => onInputChange(e, 'middleName')} required  rows={3} cols={20}  className={classNames({ 'p-invalid': submitted && !Candidate.middleName })} />
                    {submitted && !Candidate.middleName && <small className="p-error">middleName is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="lastName" className="font-bold">
                        Last Name
                    </label>
                    <InputText id="lastName" value={Candidate.lastName} onChange={(e) => onInputChange(e, 'lastName')} required  rows={3} cols={20}  className={classNames({ 'p-invalid': submitted && !Candidate.lastName })} />
                    {submitted && !Candidate.lastName && <small className="p-error">lastName is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="gender" className="font-bold">
                        gender
                    </label>
                    <InputText id="gender" value={Candidate.gender} onChange={(e) => onInputChange(e, 'gender')} required rows={3} cols={20}  className={classNames({ 'p-invalid': submitted && !Candidate.gender })} />
                    {submitted && !Candidate.gender && <small className="p-error">gender is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="nativeLanguage" className="font-bold">
                        nativeLanguage
                    </label>
                    <InputText id="nativeLanguage" value={Candidate.nativeLanguage} onChange={(e) => onInputChange(e, 'nativeLanguage')} required  rows={3} cols={20}  className={classNames({ 'p-invalid': submitted && !Candidate.nativeLanguage })} />
                    {submitted && !Candidate.nativeLanguage && <small className="p-error">nativeLanguage is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="birthDate" className="font-bold">
                        birthDate
                    </label>
                    <Calendar  id="birthDate" value={new Date(Candidate.birthDate)} onChange={(e) => onInputChange(e, 'birthDate')} required   dateFormat="yy-mm-dd"  showIcon   readOnlyInput  className={classNames({ 'p-invalid': submitted && !Candidate.birthDate })} />
                    {submitted && !Candidate.birthDate && <small className="p-error">birthDate is required.</small>}
                </div>
                <div className="field">
                    <label className="mb-3 font-bold">Photo ID Type</label>
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
                    <label htmlFor="photoIDNumber" className="font-bold">
                        photoIDNumber
                    </label>
                    <InputText id="photoIDNumber" value={Candidate.photoIDNumber} onChange={(e) => onInputChange(e, 'photoIDNumber')} required  rows={3} cols={20}  className={classNames({ 'p-invalid': submitted && !Candidate.photoIDNumber })} />
                    {submitted && !Candidate.photoIDNumber && <small className="p-error">photoIDNumber is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="photoIDIssueDate" className="font-bold">
                        photoIDIssueDate
                    </label>
                    <Calendar  id="photoIDIssueDate" value={new Date(Candidate.photoIDIssueDate)} onChange={(e) => onInputChange(e, 'photoIDIssueDate')} required   dateFormat="yy-mm-dd"  showIcon   readOnlyInput  className={classNames({ 'p-invalid': submitted && !Candidate.photoIDIssueDate })} />
                    {submitted && !Candidate.photoIDIssueDate && <small className="p-error">photoIDIssueDate is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="email" className="font-bold">
                        email
                    </label>
                    <InputText id="email" value={Candidate.email} onChange={(e) => onInputChange(e, 'email')} required    className={classNames({ 'p-invalid': submitted && !Candidate.email })} />
                    {submitted && !Candidate.email && <small className="p-error">email is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="address" className="font-bold">
                        address
                    </label>
                    <InputText id="address" value={Candidate.address} onChange={(e) => onInputChange(e, 'address')} required  rows={3} cols={20}  className={classNames({ 'p-invalid': submitted && !Candidate.address })} />
                    {submitted && !Candidate.address && <small className="p-error">address is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="addressLine2" className="font-bold">
                        addressLine2
                    </label>
                    <InputText id="addressLine2" value={Candidate.addressLine2} onChange={(e) => onInputChange(e, 'addressLine2')} required  rows={3} cols={20}  className={classNames({ 'p-invalid': submitted && !Candidate.addressLine2 })} />
                    {submitted && !Candidate.addressLine2 && <small className="p-error">addressLine2 is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="countryOfResidence" className="font-bold">
                        countryOfResidence
                    </label>
                    <InputText id="countryOfResidence" value={Candidate.countryOfResidence} onChange={(e) => onInputChange(e, 'countryOfResidence')} required  rows={3} cols={20}  className={classNames({ 'p-invalid': submitted && !Candidate.countryOfResidence })} />
                    {submitted && !Candidate.countryOfResidence && <small className="p-error">countryOfResidence is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="state" className="font-bold">
                        state
                    </label>
                    <InputText id="state" value={Candidate.state} onChange={(e) => onInputChange(e, 'state')} required  rows={3} cols={20}  className={classNames({ 'p-invalid': submitted && !Candidate.state })} />
                    {submitted && !Candidate.state && <small className="p-error">state is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="territory" className="font-bold">
                        territory
                    </label>
                    <InputText id="territory" value={Candidate.territory} onChange={(e) => onInputChange(e, 'territory')} required  rows={3} cols={20}  className={classNames({ 'p-invalid': submitted && !Candidate.territory })} />
                    {submitted && !Candidate.territory && <small className="p-error">territory is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="province" className="font-bold">
                        province
                    </label>
                    <InputText id="province" value={Candidate.province} onChange={(e) => onInputChange(e, 'province')} required  rows={3} cols={20}  className={classNames({ 'p-invalid': submitted && !Candidate.province })} />
                    {submitted && !Candidate.province && <small className="p-error">province is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="townCity" className="font-bold">
                        townCity
                    </label>
                    <InputText id="townCity" value={Candidate.townCity} onChange={(e) => onInputChange(e, 'townCity')} required  rows={3} cols={20}  className={classNames({ 'p-invalid': submitted && !Candidate.townCity })} />
                    {submitted && !Candidate.townCity && <small className="p-error">townCity is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="postalCode" className="font-bold">
                        postalCode
                    </label>
                    <InputText id="postalCode" value={Candidate.postalCode} onChange={(e) => onInputChange(e, 'postalCode')} required  rows={3} cols={20}  className={classNames({ 'p-invalid': submitted && !Candidate.postalCode })} />
                    {submitted && !Candidate.postalCode && <small className="p-error">postalCode is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="landlineNumber" className="font-bold">
                        landlineNumber
                    </label>
                    <InputText id="landlineNumber" value={Candidate.landlineNumber} onChange={(e) => onInputChange(e, 'landlineNumber')} required  rows={3} cols={20}  className={classNames({ 'p-invalid': submitted && !Candidate.landlineNumber })} />
                    {submitted && !Candidate.landlineNumber && <small className="p-error">landlineNumber is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="mobileNumber" className="font-bold">
                        mobileNumber
                    </label>
                    <InputText id="mobileNumber" value={Candidate.mobileNumber} onChange={(e) => onInputChange(e, 'mobileNumber')} required  rows={3} cols={20}  className={classNames({ 'p-invalid': submitted && !Candidate.mobileNumber })} />
                    {submitted && !Candidate.mobileNumber && <small className="p-error">mobileNumber is required.</small>}
                </div>
            </Dialog>
            <Dialog visible={deleteCandidateDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteCandidateDialogFooter} onHide={hideDeleteCandidateDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {Candidate && (
                        <span>
                            Are you sure you want to delete <b>{Candidate.name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>


        </div>
    );
}