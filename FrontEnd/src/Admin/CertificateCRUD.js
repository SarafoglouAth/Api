
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import axios from "axios";
import Tester from "./Tester";

// Component for CRUD operations on certificates
export default function CertificateCRUD({Role}) {
    // Define initial state and references
    let emptyCertificate = {
        id: null,
        candidateId: null,
        firstName: '',
        middleName: '',
        lastName: '',
        candidateExamsID: null,
        percentageScore: null,
        assessmentTestCode: null,
        certificationDate:new Date(),
        tilte:''
    };
    const [loading, setLoading] = useState(true);
    const [Certificates, setCertificates] = useState(null);
    const [deleteCertificateDialog, setDeleteCertificateDialog] = useState(false);
    const [Certificate, setCertificate] = useState(emptyCertificate);
    const toast = useRef(null);
    const dt = useRef(null);
    const url="https://localhost:7060/certificates";
    const [PreviewCertificateDialog, setPreviewCertificateDialog] = useState(false);
    const [CertificatePrintData, setCertificatePrintData] = useState({ Name: '', Date: '', Course: '', id: ''});


    // Fetch certificate data from an API on component mount
    useEffect(() => {
        // Fetch certificate data from an API
        const fetchUserData = async () => {
            try {
                const response = await axios.get(url);
                setCertificates(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching Certification data:', error);
            }
        };

        fetchUserData();
    }, []);
// Functions for handling dialogs, saving, editing, and deleting certificates



    const hideDialogPreview = () => {
        setPreviewCertificateDialog(false);
    };

    const hideDeleteCertificateDialog = () => {
        setDeleteCertificateDialog(false);
    };




    const confirmDeleteCertificate = (Certificate) => {
        handleDelete();
        setCertificate(Certificate);
        setDeleteCertificateDialog(true);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Certificate Deleted', life: 3000 });
    };
    const handleDelete = async () => {
        try {
            // Assuming Candidate.id is the candidate's ID
            const response = await axios.delete(url+`/${Certificate.id}`  );
            setLoading(true);
            console.log(response.data); // Handle the response as needed
        } catch (error) {
            console.error('Error deleting candidate:', error);
            // Handle the error, display an error message, etc.
        }
    };

    const deleteCertificate = () => {
        let _Certificates = Certificates.filter((val) => val.id !== Certificate.id);

        setCertificates(_Certificates);
        setDeleteCertificateDialog(false);
        setCertificate(emptyCertificate);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Certificate Deleted', life: 3000 });
    };



    // Function to handle CSV export of certificate data
    const exportCSV = () => {
        dt.current.exportCSV();
    };








    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };


    // Function to preview and download a certificate
    function DownloadCertificate(rowData) {
        let Name=rowData.firstName+" "+rowData.middleName[0]+".  "+rowData.lastName;
        let Date=rowData.certificationDate;
        let Course=rowData.tilte;
        let id=rowData.id;
        setCertificatePrintData({ Name, Date, Course, id });
        setPreviewCertificateDialog(true);
    }
    // Template for action buttons in the DataTable
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-download" rounded outlined severity="mr-2" onClick={() => DownloadCertificate(rowData)} />
                {Role==="Admin" &&  (<>
                    <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteCertificate(rowData)} /></>)
    }

            </React.Fragment>
        );
    };
    const PreviewCertificateDialogFooter  = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialogPreview} />
        </React.Fragment>
    );

    const deleteCertificateDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteCertificateDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteCertificate} />
        </React.Fragment>
    );
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    // Render the component with the DataTable and Dialogs
    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4"  end={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={Certificates}
                           loading={loading}
                           dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                           paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                           currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Certificates" >
                    <Column key="id" field="id" header="ID" sortable />
                    <Column key="candidateId" field="candidateId" header="candidateId" sortable style={{ minWidth: '1rem' }}/>
                    <Column key="certificationDate" field="certificationDate" header="Date" sortable body={(rowData) => formatDate(rowData.certificationDate)} />
                    <Column key="tilte" field="tilte" header="tilte" sortable />
                    <Column key="firstName" field="firstName" header="First Name" sortable />

                    <Column key="middleName" field="middleName" header="middleName" sortable />
                    <Column key="lastName" field="lastName" header="lastName" sortable />
                    <Column field="candidateExamsID" header="candidateExamsID" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column key="assessmentTestCode" field="assessmentTestCode" header="assessmentTestCode" sortable />
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>


            <Dialog visible={deleteCertificateDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteCertificateDialogFooter} onHide={hideDeleteCertificateDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {Certificate && (
                        <span>
                            Are you sure you want to delete <b>{Certificate.name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>
            <Dialog visible={PreviewCertificateDialog}  header="Preview Certificate" modal className="p-fluid" footer={PreviewCertificateDialogFooter} onHide={()=> setPreviewCertificateDialog(false)}>
                <Tester id={CertificatePrintData.id} date={CertificatePrintData.Date} name={CertificatePrintData.Name} course={CertificatePrintData.Course}/>

            </Dialog>

        </div>
    );
}
