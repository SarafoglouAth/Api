import React, {useState, useEffect, useRef} from 'react';
import {classNames} from 'primereact/utils';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Toast} from 'primereact/toast';
import {Button} from 'primereact/button';
import {Toolbar} from 'primereact/toolbar';
import {Dialog} from 'primereact/dialog';
import {InputText} from 'primereact/inputtext';
import axios from "axios";
import {Calendar} from "primereact/calendar";
import {Dropdown} from 'primereact/dropdown';
import moment from "moment/moment";

export default function MarkExams({Role}) {
    const [AdminID, setAdminID] = useState(2)

    const today = new Date();
    const oneMonthLater = new Date(today);
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

    const minDate = today.toLocaleDateString();
    const maxDate = oneMonthLater;

    const [MarkingDialog, setMarkingDialog] = useState(false);
    const [marking, setMarking] = useState({});
    const [markingAssignment, setMarkingAssignment] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null);
    const dt = useRef(null);
    const [loading, setLoading] = useState(true);
    const [markers, setMarkers] = useState([]); // State to hold markers
    const [exams, setExams] = useState([])

    const token = localStorage.getItem("token");
    const authHeader = {
        headers: {'Authorization': `Bearer ${token}`}
    }
    useEffect(() => {
        axios.get("https://localhost:7060/MarkerDelegation")
            .then(response => {
                setExams(response.data.markerCandidateExams);
                setMarkers(response.data.availableMarkers);
                setLoading(false);
            });

    }, [loading]);


    const hideDialog = () => {
        setSubmitted(false);
        setMarkingDialog(false);
    };

    const handlePost = () => {
        let MarkingTOpostFormat = (({examDate, tilte, ...rest}) => rest)(marking);
        MarkingTOpostFormat.markDate = formatDateWithMoment(MarkingTOpostFormat.markDate);

    }

    const saveMarking = () => {
        setSubmitted(true);

        if (!marking.markDueDate || !marking.markedById) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Please fill in all required fields.',
            });
            return;
        }

        setLoading(true);
        axios.post('https://localhost:7060/MarkerDelegation/MarkerAssign', {
            examId: marking.id,
            markedById: marking.markedById,
            markDueDate: new moment(marking.markDueDate).utc().toISOString()
        })
            .then((response) => {
                toast.current.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Marking Created',
                    life: 3000,
                });
            })
            .catch(error => {
                toast.current.show({
                    severity: 'error',
                    summary: {error},
                    detail: 'Marking Creation Failed',
                    life: 3000,
                });
            })
            .finally(() => {
                setLoading(false);
                setMarkingDialog(false);
            });

    };

    const editMarking = (rowData) => {
        setMarking(rowData);
        setMarkingDialog(true);
    };


    const findMarkedById = (markedById) => {
        return markers.find(x => x.userID === markedById)?.userName;
    }
    const formatDate = (dateString) => {
        if (!dateString) {
            return ''
        }
        return new moment(dateString).format('DD/MM/yyyy');
    };

    const formatDateWithMoment = (dateString) => {
        const originalDate = moment(dateString);
        return originalDate.format('YYYY-MM-DD');
    };
    const exportCSV = () => {
        dt.current.exportCSV();
    };


    const onDateChange = (e, date) => {
        const val = (e.target && e.target.value) || '';
        let _Marking = {...marking};

        _Marking[`${date}`] = val;
        _Marking[`${date}`] = _Marking[`${date}`].toLocaleDateString();


        setMarking(_Marking);
    };
    const onInputChange = (e, name) => {

        const val = (e.target && e.target.value) || '';
        let _Marking = {...marking};
        _Marking[`${name}`] = val;
        setMarking(_Marking);
    };


    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV}/>;
    };


    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editMarking(rowData)}/>
            </React.Fragment>
        );
    };


    const MarkingDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog}/>
            <Button label="Save" icon="pi pi-check" onClick={saveMarking}/>
        </React.Fragment>
    );


    return (
        <div>
            <Toast ref={toast}/>
            <div className="card">
                <Toolbar className="mb-4" end={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={exams} loading={loading}
                           dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                           paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                           currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Markings">

                    <Column field="id" header="id" sortable style={{minWidth: '12rem'}}></Column>
                    <Column field="title" header="Test Name" sortable style={{minWidth: '16rem'}}></Column>
                    <Column field="examinationDate" header="Exam Date" sortable style={{minWidth: '10rem'}}
                            body={(rowData) => formatDate(rowData.examinationDate)}></Column>
                    <Column field="markDueDate" header="Mark due Date" sortable style={{minWidth: '10rem'}}
                            body={(rowData) => formatDate(rowData.markDueDate)}></Column>
                    <Column field="markedById" header="Marker Assigned" sortable
                            body={(rowData) => findMarkedById(rowData.markedById)}
                            style={{minWidth: '10rem'}}></Column>
                    {Role === "Admin" &&
                        <Column body={actionBodyTemplate} exportable={false} style={{minWidth: '12rem'}}></Column>}
                </DataTable>
            </div>

            <Dialog visible={MarkingDialog} style={{width: '32rem'}} breakpoints={{'960px': '75vw', '641px': '90vw'}}
                    header="Marking Details" modal className="p-fluid" footer={MarkingDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="TestID" className="font-bold">
                        Test ID
                    </label>
                    <InputText id="TestID" value={marking.id} disabled/>
                </div>
                <div className="field">
                    <label htmlFor="title" className="font-bold">
                        Test Name
                    </label>
                    <InputText id="title" value={marking.title} disabled/>
                </div>
                <div className="field">
                    <label htmlFor="examinationDate" className="font-bold">
                        examDate
                    </label>
                    <InputText id="examinationDate" value={formatDate(marking.examinationDate)} disabled/>
                </div>
                <div className="field">
                    <label htmlFor="markDate" className="font-bold">
                        Mark Date Due
                    </label>
                    <Calendar id="markDate" showIcon value={new moment(marking.markDueDate).toDate()} dateFormat="yy-mm-dd"
                              onChange={(e) => {
                                  setMarking({...marking, markDueDate: e.target.value})
                              }}
                              minDate={today} maxDate={maxDate}
                              className={classNames({'p-invalid': submitted && !marking.markDueDate})}/>
                </div>
                <div className="field">
                    <label htmlFor="markerAssigned" className="font-bold">
                        Marker Assigned
                    </label>
                    <Dropdown
                        value={marking.markedById}
                        onChange={(e) => {
                            setMarking({...marking, markedById: e.target.value})
                        }}
                        options={markers}
                        optionLabel="userName"
                        optionValue="userID"
                        placeholder="Select a Marker"
                        className="w-full md:w-14rem"
                    />
                </div>
            </Dialog>


        </div>
    );
}