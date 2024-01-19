import React, { useState, useEffect } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import axios from "axios";
import Exam from "./Tests/Exam";
import PurchasesShowcaseS from "./PurchasesShowcase";
import Marking from "../Marker/Marking";

const Purchases = ({Role,data}) => {
    const [showExam, setShowExam] = useState(false);
    const [targetedExam, setTargetedExam] = useState(null);
    const [loading, setLoading] = useState(false);
    const [exams, setExams] = useState([]);

    const handleExamSubmission = () => {
        setShowExam(false); // Set showExam to false to stop rendering the exam
    };

    useEffect(()  =>  {
        const fetchData = async () => {
            setLoading(true);
            try {
                    let dataObj = { "examId": targetedExam,
                    "candidateId": data.candidateId}

                if (Role!=="Candidate") {



                    const response = await axios.get(`https://localhost:7060/Marker/GetExamToMark?examId=${targetedExam}&candidateId=${data.candidateId}`);
                    setExams(response.data);
                } else {

                    const response = await axios.get(`https://localhost:7060/Purchase/Test?examId=${targetedExam}&candidateId=${data.candidateId}`);
                    setExams(response.data);
                }


                setLoading(false);
                setShowExam(true);
            } catch (error) {
                console.error("Error fetching Exam data:", error);
            }
        };

        if (targetedExam) {

            fetchData();
            setTargetedExam(null);
        }
    }, [targetedExam]);

    const GoBack = () => {
        setShowExam(false);
    };
    return (
        <>
            {!showExam ? ( Role ==="Candidate" ? <PurchasesShowcaseS setTargetedExam={setTargetedExam} data={data}/> : <Marking setTargetedExam={setTargetedExam} Role={Role} data={data} /> )
                : ( loading ? (
                    <div className="card flex justify-content-center">
                        <ProgressSpinner/>
                    </div> )
                        :
                        (<Exam exams={exams} Role={Role} data={data} GoBack={GoBack} onExamSubmit={handleExamSubmission}/> )
            )}
        </>
    );
};

export default Purchases;
