import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { RadioButton } from 'primereact/radiobutton';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import axios from "axios";

export default function Users({Role}) {
    //Api sends int for role, but we want to display the string
    const roleMapping = {
        0: 'Candidate',
        1: 'Quality Control',
        2: 'Marker',
        3: 'Admin'
    };
    //Empty user object for creating new users
    let emptyUser = {
        id: 0,
        userName: '',
        passWord: '',
        role: 4,
    };

    const [Users, setUsers] = useState([]);
    const [UserDialog, setUserDialog] = useState(false);
    const [deleteUserDialog, setDeleteUserDialog] = useState(false);
    const [User, setUser] = useState(emptyUser);
    const [selectedUsers, setSelectedUsers] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null);
    const dt = useRef(null);
    const url = 'https://localhost:7060/Users';
    const [loading, setLoading] = useState(true);
    //Fetches data from api
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await axios.get(url, {
                    headers: {'Authorization': `Bearer ${token}`}
                });
                setUsers(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching User data:', error);

            }
        };

        fetchUserData();
    }, [loading]);
    //Handles api calls for CRUD operations
    const handleUpdate = async () => {
        try {
            const response = await axios.put((url+`/${User.id}`), User );
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
            const response = await axios.post(url, User );
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
            const response = await axios.delete(url+`/${User.id}`  );
            setLoading(true);
            console.log(response.data); // Handle the response as needed

            // Optionally, you can perform some action on successful update
            // For example, show a success message, redirect to another page, etc.
        } catch (error) {
            console.error('Error updating candidate:', error);
            // Handle the error, display an error message, etc.
        }
    };
    //Opens the dialog for creating new users

    const openNew = () => {
        setUser(emptyUser);
        setSubmitted(false);
        setUserDialog(true);
    };
//Closes the dialog for creating new users
    const hideDialog = () => {
        setSubmitted(false);
        setUserDialog(false);
    };

    const hideDeleteUserDialog = () => {
        setDeleteUserDialog(false);
    };

//Validates and Saves the user to the database
    const saveUser = () => {
        setSubmitted(true);
        if (
            !User.userName ||
            !User.passWord
        ) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Please fill in all required fields.',
            });
            return;
        }
        const isuserNameUnique = Users.every(
            (existingUser) =>
                existingUser.id === User.id ||
                existingUser.userName !== User.userName
        );

        if (!isuserNameUnique) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'userName must be unique. Please choose a different userName.',
            });
            return;
        }
        if (User.id !==0) {
            // If Candidate has an ID, it means we are updating an existing candidate
            handleUpdate();
        } else {
            // If Candidate doesn't have an ID, it means we are creating a new candidate
            handleCreate();
        }


            setUserDialog(false);
            setUser(emptyUser);

    };

    const editUser = (User) => {
        setUser({ ...User });
        setUserDialog(true);
    };

    const confirmDeleteUser = (User) => {
        setUser(User);
        setDeleteUserDialog(true);
    };

    const deleteUser = () => {
        handleDelete();
        setDeleteUserDialog(false);
        setUser(emptyUser);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
    };





    const exportCSV = () => {
        dt.current.exportCSV();
    };




    const onCategoryChange = (e) => {
        let _User = { ...User };

        _User["role"] = e.value;
        setUser(_User);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _User = { ...User };

        _User[`${name}`] = val;

        setUser(_User);
    };

    const leftToolbarTemplate = () => {
        return (
            <>{Role==="Admin" &&
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
            </div>}</>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };





    const actionBodyTemplate = (rowData) => {

        return (<>{Role==="Admin" &&
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editUser(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteUser(rowData)} />
            </React.Fragment>  }</>)
    };

    const UserDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveUser} />
        </React.Fragment>
    );
    const deleteUserDialogFooter = (
        <React.Fragment >
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteUserDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteUser} />
        </React.Fragment>
    );

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={Users} selection={selectedUsers} onSelectionChange={(e) => setSelectedUsers(e.value)}
                           dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                           paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                           currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Users"
                           loading={loading}>
                    <Column  field="id" header="ID" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column  field="userName" header="userName" sortable style={{ minWidth: '12rem' }}></Column>
                    {Role==="Admin" && <Column  field="passWord" header="PassWord" sortable style={{ minWidth: '16rem' }}></Column>}
                    <Column  field="role" header="role" sortable style={{ minWidth: '10rem' }} body={(rowData) => roleMapping[rowData.role]}></Column>
                    <Column  body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={UserDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="User Details" modal className="p-fluid" footer={UserDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="userName" className="font-bold">
                        userName
                    </label>
                    <InputText id="userName"  value={User.userName} onChange={(e) => onInputChange(e, 'userName')} required autoFocus className={classNames({ 'p-invalid': submitted && !User.userName })} />
                    {submitted && !User.userName && <small className="p-error">userName is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="passWord" className="font-bold">
                        PassWord
                    </label>
                    <Password  toggleMask id="passWord" value={User.passWord} onChange={(e) => onInputChange(e, 'passWord')} required  className={classNames({ 'p-invalid': submitted && !User.passWord })} />
                    {submitted && !User.passWord && <small className="p-error">passWord is required.</small>}
                </div>

                <div className="field">
                    <label className="mb-3 font-bold">Category</label>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="role1" name="role" value={1} onChange={onCategoryChange} checked={User.role === 1} />
                            <label htmlFor="role1">QualityControl</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="role2" name="role" value={2} onChange={onCategoryChange} checked={User.role === 2} />
                            <label htmlFor="role2">Marker</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="role3" name="role" value={3} onChange={onCategoryChange} checked={User.role === 3} />
                            <label htmlFor="role3">Admin</label>
                        </div>
                    </div>
                </div>
            </Dialog>

            <Dialog visible={deleteUserDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteUserDialogFooter} onHide={hideDeleteUserDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {User && (
                        <span>
                            Are you sure you want to delete <b>{User.userName}</b>?
                        </span>
                    )}
                </div>
            </Dialog>


        </div>
    );
}
