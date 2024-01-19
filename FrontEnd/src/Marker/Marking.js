import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import axios from "axios";
import { Calendar } from "primereact/calendar";
import { Dropdown } from 'primereact/dropdown';

export default function Marking({ setTargetedExam, Role, data }) {
    // Define an empty marking object
    let emptyMarking = {
        examId: null,
        tilte: '',
        examDate: ' ',
        markDate: new Date()
    };

    // State variables initialization
    const [Markings, setMarkings] = useState(null);
    const [MarkingDialog, setMarkingDialog] = useState(false);
    const [MarkExam, setMarkExam] = useState(false);
    const [Marking, setMarking] = useState(emptyMarking);

    // Ref for toast and data table
    const toast = useRef(null);
    const dt = useRef(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");
    const authHeader = {
        headers: {'Authorization': `Bearer ${token}`}
    }
    // Fetch data on initial component render
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch data from API
                const response = await axios.get(`https://localhost:7060/MarkerDelegation/MarkingBoard`, authHeader);

                setLoading(false);
                // Set fetched data to Markings state
                setMarkings(response.data);
                // Set loading to false after data is fetched
                setLoading(false);
            } catch (error) {
                console.error("Error fetching Exam data:", error);
            }
        };
        fetchData();
    }, [loading]);

    // Function to edit a marking
    const editMarking = (Marking) => {
        // Set the Marking state with the data of the marking being edited
        setMarking({ ...Marking });
        // Open the Marking dialog
        setMarkingDialog(true);
        // Set the targeted exam based on the examId of the marking
        data.candidateId = Marking.candidateId;
        setTargetedExam(Marking.examId)
    };

    // Template for action buttons in the table based on user Role
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                {Role === "Admin" ?
                    <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editMarking(rowData)} /> :
                    <Button icon="pi pi-eye" rounded outlined className="mr-2" onClick={() => editMarking(rowData)} />}
            </React.Fragment>
        );
    };
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                {/* Toolbar component */}
                <Toolbar className="mb-4"></Toolbar>

                {/* DataTable component to display Markings */}
                <DataTable ref={dt} value={Markings} loading={loading}
                           dataKey="examId" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                           paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                           currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Markings" >


                    <Column field="examId" header="examId" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="title" header="Test Name" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="examinationDate" header="examDate" sortable style={{ minWidth: '10rem' }} body = {(rowData) =>formatDate(rowData.examinationDate)}></Column>
                    <Column field="markDueDate" header="Mark Date Due" sortable style={{ minWidth: '10rem' }} body = {(rowData) =>formatDate(rowData.markDueDate)}></Column>

                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>
        </div>
    );
}
