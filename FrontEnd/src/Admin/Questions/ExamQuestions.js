import React, {useEffect, useState} from "react";
import axios from "axios";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";

import {ConfirmDialog, confirmDialog} from 'primereact/confirmdialog';

import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Button} from "primereact/button";

import {Image} from "primereact/image";
import {Dialog} from "primereact/dialog";
import {InputTextarea} from "primereact/inputtextarea";

import AnswersTable from "./AnswersTable";

// TODO : FIx api call ( CRUD) for questions
function ExamQuestions({targetedProduct, hideQuestions, Role}) {

    const httpRootPath = 'https://localhost:7060/questions/';
    const token = localStorage.getItem("token");
    const authHeader = {
        headers: {'Authorization': `Bearer ${token}`}
    }
    //data

    const [examId, setExamId] = useState();
    const [loading, setLoading] = useState(true);

    const [exam, setExam] = useState({})

    useEffect(() => {
        loadData();
    }, [targetedProduct]);
    const loadData = () => {
        setLoading(true);
        setExamId(targetedProduct.id)
        axios.get(`${httpRootPath}exam/${targetedProduct.id}`, authHeader)
            .then(success => {
                setExam(success.data)
                setLoading(false);
            }).catch(error => {
            console.error("Error fetching Exam data:", error);
        })
    }

    const admin = Role === "Admin";


    const [expandedRows, setExpandedRows] = useState(null);

    const [imagePopup, setImagePopup] = useState('');
    const [visibleImagePopup, setVisibleImagePopup] = useState(false);

    const [questionEditor, setQuestionEditor] = useState({
        visible: false,
        header: '',
        imageUrl: null,
        value: '',
        isAdd: false,
        questionId: null
    });


    const expandAll = () => {
        let _expandedRows = {};

        exam.questions.forEach((p) => (_expandedRows[`${p.id}`] = true));

        setExpandedRows(_expandedRows);
    };
    const collapseAll = () => setExpandedRows(null);

    const header = (
        <div className="flex flex-wrap justify-content-between align-items-center gap-2">

      <span>
        <h1>{exam?.testName}</h1>
      </span>
            <div>
                <Button icon="pi pi-plus" label="Expand All" onClick={expandAll} text/>
                <Button
                    icon="pi pi-minus"
                    label="Collapse All"
                    onClick={collapseAll}
                    text
                />
                <Button
                    icon="pi pi-arrow-left"
                    label="Back"
                    onClick={hideQuestions}
                    text
                />
            </div>
        </div>
    );

    //admin delete update image end

    const rowExpansionTemplate = (question) => { //??? ????? ?? row
        return (
            <div className="p-1">
                <AnswersTable  admin={admin} questionId={question.id}/>
            </div>
        );
    };

    function showQuestionEditor(isAdd, value, imageUrl, questionId) {
        setQuestionEditor(
            {
                ...questionEditor,
                visible: true,
                isAdd: isAdd,
                header: isAdd ? "Add new Question" : "Update Question",
                value: value ?? '',
                imageUrl: imageUrl,
                questionId: questionId
            }
        );
    }

    function hideQuestionEditor() {
        setQuestionEditor({...questionEditor, visible: false})
    }

    const upsertQuestion = () => {
        //TODO: implement
        console.log(`Question Update not implemented yet, would update questionId: ${questionEditor}`, questionEditor);


        let request;
        if (questionEditor.isAdd) {
            // const response = await axios.get('https://localhost:7060/candidates');

            request = axios.post(`${httpRootPath}New`, {
                examId: examId,
                questionText: questionEditor.value,
                imageUrl: questionEditor.imageUrl
            }, authHeader);
        } else {
            request = axios.put(`${httpRootPath}Update`, {
                questionId: questionEditor.questionId,
                questionText: questionEditor.value,
                imageUrl: questionEditor.imageUrl
            }, authHeader)
        }
        request
            .then(successResponse => {
                console.log(successResponse.data)
                loadData();
            })
            .catch(errorResponse => console.error(errorResponse));
    }

    const questionTextColumnHeader = () => {
        return (
            <div className="flex align-items-center gap-2 ">
        <span>
          <h2>Question</h2>
        </span>
                {admin && (
                    <>
                        {" "}
                        <Button
                            label="Add"
                            tooltip="Add a Question"
                            icon="pi pi-plus"
                            size="small"
                            severity="success"
                            style={{width: "90px", height: "30px"}}
                            onClick={() => showQuestionEditor(true, undefined, null, null)}
                        />
                        <Dialog
                            header={<span> {questionEditor.header}</span>}
                            visible={questionEditor.visible}
                            style={{width: "75vw"}}
                            contentStyle={{height: "min-content"}}
                            onHide={() => hideQuestionEditor()}
                            footer={
                                <div className="flex align-items-center justify-content-end">
                                    <Button
                                        label="Save"
                                        tooltip="Save the Question"
                                        size="small"
                                        severity="success"
                                        style={{width: "90px", height: "30px"}}
                                        onClick={() => upsertQuestion()}
                                    />

                                </div>
                            }
                        >
                            <div className={'flex flex-column gap-2 '}>
                                <InputTextarea
                                    value={questionEditor.value}
                                    onChange={(e) =>
                                        setQuestionEditor({...questionEditor, value: e.target.value})
                                    }
                                    autoFocus
                                    autoResize
                                    style={{minWidth: "100%"}}
                                    placeholder={'Type Question Text'}
                                    rows={12}
                                />
                                <div className="flex align-items-center gap-2 flex-1">
                                    <label>Image:</label>
                                    <InputTextarea
                                        className={'flex flex-1'}
                                        value={questionEditor.imageUrl}
                                        onChange={(e) =>
                                            setQuestionEditor({...questionEditor, imageUrl: e.target.value})
                                        }
                                        placeholder={'Image Url'}
                                        rows={1}
                                        autoResize={false}
                                    />
                                    {
                                        !!questionEditor.imageUrl ? <Button
                                            label="Delete"
                                            tooltip="Delete Image"
                                            tooltipOptions={{position: "top"}}
                                            icon="pi pi-trash"
                                            size="small"
                                            severity="danger"
                                            style={{width: "90px", height: "30px"}}
                                            onClick={(e) => {
                                                setQuestionEditor({...questionEditor, imageUrl: ''})
                                            }}
                                        /> : ''
                                    }
                                </div>
                            </div>
                        </Dialog>{" "}
                    </>
                )}
            </div>
        );
    };

    const imageColumnTemplate = (rowData) => {
        return (
            <img
                src={rowData.image}
                alt={rowData.image}
                width="64px"
                className="shadow-4"
                onClick={() => {
                    setImagePopup(rowData.image);
                    setVisibleImagePopup(true);
                }}
            />
        );
    };

    const toggleAnswer = (rowData) => {
        if (getExpandedRows().includes(rowData.id.toString())) {
            setExpandedRows(null);
            return;
        }
        const _expandedRow = {[rowData.id]: true};

        setExpandedRows(_expandedRow);
    };

    const getExpandedRows = () => {
        if (!expandedRows) {
            return [];
        }

        return Object.entries(expandedRows)
            .filter(([_, value]) => value)
            .map(([key, _]) => key);
    };
    //  TODO: refactor into single method

    const acceptQuestionDeletion = (questionId) => {
        //TODO: implement
        console.log(`Question Deletion not implemented yet, would delete questionId: ${questionId}`);

        axios.delete(`${httpRootPath}Delete/${questionId}`, authHeader)
            .then(successResponse => {
                loadData();
            })
            .catch(errorResponse => console.error(errorResponse));
    }

    const questionButtons = (rowData) => (
        <div className="flex flex-column justify-content-center align-items-center gap-1">
            <Button
                label="Answers"
                tooltip="Expand Answers"
                tooltipOptions={{position: "left"}}
                icon="pi pi-eye"
                size="small"
                severity="info"
                style={{width: "110%"}}
                onClick={() => toggleAnswer(rowData)}
            />

            <Button
                label="Update"
                tooltip="Update a Question"
                tooltipOptions={{position: "left"}}
                icon="pi pi-pencil"
                size="small"
                severity="secondary"
                style={{width: "110%"}}
                onClick={() => showQuestionEditor(false, rowData.questionText, rowData.image, rowData.id)}
            />
            <Button
                label="Delete"
                tooltip="Delete a Question"
                tooltipOptions={{position: "left"}}
                icon="pi pi-trash"
                size="small"
                severity="danger"
                style={{width: "110%"}}
                onClick={() => {
                    confirmDialog({
                        message: 'Do you want to delete this Question?',
                        header: 'Delete Confirmation',
                        icon: 'pi pi-info-circle',
                        acceptClassName: 'p-button-danger',
                        accept: () => acceptQuestionDeletion(rowData.id)&&setVisibleImagePopup(false),

                    });
                }}
            />
        </div>
    );
    const questionButtonsViewOnly = (rowData) => (
        <div className="flex flex-column justify-content-center align-items-center gap-1">
            <Button
                label=""
                tooltip="Expand Answers"
                tooltipOptions={{position: "left"}}
                icon="pi pi-eye"
                size="small"
                severity="info"
                style={{width: "35px"}}
                onClick={() => toggleAnswer(rowData)}
            />
        </div>
    );

    function questionsDatatableButtons() {
        if (admin) {
            return <Column header="Update/Remove" body={questionButtons}/>;
        }
        return <Column body={questionButtonsViewOnly}/>;
    }

    //  TODO: end of refactor into single method

    return (
        <div className="card">


            {exam === null ? "" :


                <DataTable
                    loading={loading}
                    paginator
                    rows={5}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    value={exam.questions}
                    expandedRows={expandedRows}
                    onRowToggle={(e) => setExpandedRows(e.data)}
                    rowExpansionTemplate={rowExpansionTemplate}
                    dataKey="id"
                    header={header}
                    tableStyle={{minWidth: "50rem"}}
                    stripedRows={true}
                >
                    <Column
                        field="questionText"
                        header={questionTextColumnHeader}
                        className="text-lg"
                        style={{width: "80%"}}
                    />
                    <Column
                        header="Image"
                        body={imageColumnTemplate}
                        style={{width: "120px"}}
                    />
                    {questionsDatatableButtons()}
                </DataTable>
            }
            {/* POPUP Image element */}
            <Dialog
                header={<div className="flex align-items-center gap-2">
                    <span>Image</span>
                </div>}
                visible={visibleImagePopup}
                dismissableMask={true}
                maximizable
                style={{width: "50vw"}}
                draggable={false}
                onHide={() => {
                    setImagePopup('');
                    setVisibleImagePopup(false)
                }}
            >
                <Image src={imagePopup} alt="Image" width="100%"/>
            </Dialog>
            <ConfirmDialog/>
        </div>
    );
}

export default ExamQuestions;
