import React, {useEffect, useState} from "react";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";

import {confirmDialog} from 'primereact/confirmdialog';

import {DataTable} from "primereact/datatable";
import {Tag} from "primereact/tag";
import {Checkbox} from 'primereact/checkbox';
import {Column} from "primereact/column";
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog";
import {InputTextarea} from "primereact/inputtextarea";
import axios from "axios";

//Όταν γίνεται create, update, delete ένα answer το backend θα πρέπει να έχει στο responce όλα τα answer που αντιστοιχούν σε αυτο το question


function AnswersTable(props) {
    const [answerEditor, setAnswerEditor] = useState({
        visible: false,
        isAdd: false,
        header: '',
        value: '',
        isCorrect: false,
        allowMarkCorrect: false,
        answerId: null
    });
    const httpRootPath = 'https://localhost:7060/answers/';
    const token = localStorage.getItem("token");
    const authHeader = {
        headers: {'Authorization': `Bearer ${token}`}
    }
    const [answers, setAnswers] = useState([]);
    const admin = props.admin;
    const questionId = props.questionId;
    useEffect(() => {
        loadData();
    }, [questionId]);
    const loadData = () => {
        axios.get(`${httpRootPath}question/${questionId}`, authHeader)
            .then(success => {
                setAnswers(success.data)
            }).catch(error => {
            console.error("Error fetching Exam data:", error);
        })
    }


    function acceptAnswerDeletion(answerId) {
        axios.delete(`${httpRootPath}Delete/${answerId}`, authHeader)
            .then(successResponse => {
                setAnswers(successResponse.data);
                loadData();
            }).catch(errorResponse => console.error(errorResponse));
    }

    function answerButtonsColumnTemplate() {
        if (admin) {
            return (<Column
                className="p-1 "
                body={(rowData) =>
                    <div className="flex justify-content-center align-items-center gap-2">
                        <Button
                            tooltip="Update an Answer"
                            tooltipOptions={{position: "left"}}
                            icon="pi pi pi-pencil"
                            size="small"
                            severity="secondary"
                            style={{width: "35px"}}
                            onClick={() => {
                                showAnswerEditor(false, rowData.text, rowData.isCorrect, rowData.id)
                            }}
                        ></Button>
                        {rowData.isCorrect ? '':
                            <Button
                                tooltip="Delete an Answer"
                                tooltipOptions={{position: "left"}}
                                icon="pi pi-trash"
                                size="small"
                                severity="danger"
                                style={{width: "35px"}}
                                onClick={() => {
                                    confirmDialog({
                                        message: 'Do you want to delete this Answer?',
                                        header: 'Delete Confirmation',
                                        icon: 'pi pi-info-circle',
                                        acceptClassName: 'p-button-danger',
                                        accept: () => acceptAnswerDeletion(rowData.id),

                                    });
                                }}
                            ></Button>
                        }

                    </div>
                }
            ></Column>);
        }
    }


    function showAnswerEditor(isAdd, value, isCorrect, answerId) {
        setAnswerEditor({
            ...answerEditor,
            visible: true,
            isAdd: isAdd,
            header: isAdd ? 'Add an Answer' : 'Update Answer',
            value: value ?? '',
            isCorrect: isCorrect,
            allowMarkCorrect: (isAdd && answers.length > 0) || !isCorrect,
            answerId: answerId
        })
    }

    function hideAnswerEditor() {
        setAnswerEditor({
            ...answerEditor,
            visible: false,
            value: '',
            answerId: null
        })
    }

    const header = () => {
        return (
            <div className="flex align-items-center gap-2 ">
        <span>
          <h2>Answer</h2>
        </span>
                {admin && (
                    <>
                        {" "}
                        <Button
                            label="Add"
                            tooltip="Add an Answer"
                            icon="pi pi-plus"
                            size="small"
                            severity="success"
                            style={{width: "90px", height: "30px"}}
                            onClick={() => showAnswerEditor(true, '', answers.length === 0, null)}
                        />
                        <Dialog
                            header={answerEditor.header}
                            visible={answerEditor.visible}
                            style={{width: "75vw"}}
                            contentStyle={{height: "305px"}}
                            onHide={() => hideAnswerEditor()}
                            footer={
                                <div className="flex align-items-center justify-content-between">
                                    <div className="flex align-items-center gap-2">
                                        <label htmlFor="isCorrect" className="me-2">Is Correct</label>
                                        <Checkbox inputId="isCorrect"
                                                  disabled={!answerEditor.allowMarkCorrect}
                                                  checked={answerEditor.isCorrect}
                                                  onClick={() => {
                                                      setAnswerEditor({
                                                          ...answerEditor,
                                                          isCorrect: !answerEditor.isCorrect
                                                      });
                                                  }}
                                        />
                                        {
                                            answerEditor.allowMarkCorrect && answerEditor.isCorrect ?
                                                <Tag icon="pi pi-exclamation-triangle" severity="warning"
                                                     value="Currently correct answer will be replaced"></Tag>
                                                :
                                                ''
                                        }
                                    </div>
                                    <Button
                                        label="Save"
                                        tooltip="Save the Answer"
                                        size="small"
                                        severity="success"
                                        style={{width: "90px", height: "30px"}}
                                        onClick={(e) => upsertAnswer()}
                                    />
                                </div>
                            }
                        >
                            <InputTextarea
                                value={answerEditor.value}
                                onChange={(e) => {
                                    setAnswerEditor({
                                        ...answerEditor,
                                        value: e.target.value
                                    });
                                }}
                                autoResize
                                autoFocus
                                style={{minWidth: "100%"}}
                                rows={12}
                            />
                        </Dialog>{" "}
                    </>
                )}
            </div>
        );
    };


    function upsertAnswer() {
        let request;
        if (answerEditor.isAdd) {
            request = axios.post(`${httpRootPath}New`, {
                questionId: questionId,
                isCorrect: answerEditor.isCorrect,
                text: answerEditor.value
            }, authHeader);

        } else {
            request = axios.put(`${httpRootPath}Update`, {
                answerId: answerEditor.answerId,
                isCorrect: answerEditor.isCorrect,
                text: answerEditor.value
            }, authHeader);
        }

        request.then(successResponse => {
            loadData();
            hideAnswerEditor();
        }).catch(errorResponse => console.error(errorResponse));
    }

    const correctColumnTemplate = (rowData) => {
        return (
            <div className={'flex justify-content-center'}>
                <Checkbox readOnly={true} checked={rowData.isCorrect}></Checkbox>
            </div>
        )
    };
    return (
        <DataTable
            value={answers}            //του λέω που είναι η λίστα που θέλω να μου φτιάξει με βάση το row
            dataKey="id"
            tableStyle={{minWidth: "5rem"}}
            stripedRows={true}
        >
            <Column
                field="text"                      //του λέω από πού να πάρει απο τη λίστα μου τις καταχωρίσεις για κάθε γραμμή
                header={header}
                style={{width: "95%"}}
            ></Column>
            <Column
                className="p-1 "
                header="Correct"
                body={correctColumnTemplate}
            ></Column>
            {answerButtonsColumnTemplate()}
        </DataTable>
    )
}

export default AnswersTable;