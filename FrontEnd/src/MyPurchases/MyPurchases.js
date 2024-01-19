import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import moment from "moment";

const MyPurchases = ({ title, image, examdate, ScheduleTest, takeTheTest, isTestTaken }) => {
    const header = <img src={image} alt={title} />;

    const formatDateNormal = (dateString) => {
        return moment(dateString).format('YYYY-DD-MM');
    };

    let examdateToNormal = formatDateNormal(examdate);



    const content = () => {
        return (
            <div style={{ flex: 1, height: "100px" }}>
                <h3>{isTestTaken ? "The test was taken at " + examdateToNormal : !examdate ? "Click on the button to schedule  " : "The test is Scheduled at " + examdateToNormal}</h3>
            </div>
        );
    };

    const footer = (
        <div className="bottom-button">
            {isTestTaken ? (
                <Button className="Rounded" disabled label="Waiting For results" severity="secondary"></Button>
            ) : examdate === null ? (
                <Button className="Rounded " onClick={ScheduleTest} label="Schedule the test" severity="info"></Button>
            ) : examdateToNormal === moment().format('YYYY-DD-MM') ? (
                <Button className="Rounded" onClick={takeTheTest} label="Take the test" severity="success"></Button>
            ) : (
                <Button className="Rounded" onClick={ScheduleTest} label="Reschedule the test" severity="help"></Button>
            )}
        </div>
    );

    return (
        <>
            <Card
                title={title}
                footer={footer}
                header={header}
                className="TxtAlCntr "
                style={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
                {content()}
            </Card>
        </>
    );
};

export default MyPurchases;
