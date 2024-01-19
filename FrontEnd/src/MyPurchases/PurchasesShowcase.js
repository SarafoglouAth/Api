import React, {useEffect, useRef, useState} from "react";
import MyPurchases from "./MyPurchases";
import { ProgressSpinner } from 'primereact/progressspinner';
import axios from "axios";
import { Toast } from "primereact/toast";
import {Dialog} from "primereact/dialog";
import {Calendar} from "primereact/calendar";
import {Button} from "primereact/button";
import "./PurchasesShowcase.css";
import Exam from "./Tests/Exam";
import moment from "moment/moment";
const PurchasesShowcaseS = ({setTargetedExam,data}) => {
    let today= new Date();
     let emptyProduct = {
         id: null,
        title: "",
        examdate: today,
        };



    const toast = useRef(null); // Reference for toast messages
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(emptyProduct);
    const [showDatePickerDialog, SetShowDatePickerDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [candidateid, setCandidateid] = useState(data.candidateId);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchUserData = async () => {
            try {

                const response = await axios.get("https://localhost:7060/Purchase/candidatespurcuses?candidateId="+candidateid);
                setProducts(response.data);
                setLoading(false);


            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, [loading]);
    const HandleTakeTest =  (id) => {
        setTargetedExam(id);
    };
    const formatDate = (inputDate) => {
        // Add 3 hours to the input date
        const dateWithOffset = moment(inputDate).add(3, 'hours');
        // Format the date
        return dateWithOffset.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    };
    const handleLock = async () => {
        try {
            selectedProduct.examdate = formatDate(selectedProduct.examdate);
            let responseData={
                "examId": selectedProduct.id,
                "lockDate": selectedProduct.examdate,
                "candidateId": candidateid}
            await axios.post('https://localhost:7060/Purchase/LockDate/', responseData );
            setLoading(true);

        } catch (error) {
            console.error('Error Locking Date:', error);
            // Handle the error, display an error message, etc.
        }
    };
    function LockSheduleDate() {

        setSubmitted(false);
        setSelectedProduct(emptyProduct);
        SetShowDatePickerDialog(false);
        handleLock();
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Test Date  locked ', life: 3000 });
    }
    const formatDateNormal = (dateString) => {
        return moment(dateString).format('YYYY-DD-MM');
    };

    const ScheduleTest = (productID,producttitle,testDate) => {
        testDate ? testDate = new Date(testDate) : testDate = today;
        SetShowDatePickerDialog(true);
        setSelectedProduct({ id: productID,title:producttitle,examdate:testDate });
    };
    const HideDatePickerDialog = () => {
        SetShowDatePickerDialog(false);
        setSelectedProduct(emptyProduct);
    };

    const ScheduleTestFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times"severity="danger" outlined onClick={HideDatePickerDialog} />
            <Button label="Submit" icon="pi pi-check"  onClick={LockSheduleDate} />
        </React.Fragment>
    );
    return <>
    <div className="product-showcase">
        <Toast ref={toast}/>
        <h2>My Purchased Products</h2>
        <div className="products">
            {products.map((product) =>
                <div key={product.id}>
                    <MyPurchases
                        title={product.title}
                        image={product.image}
                        takeTheTest={() => HandleTakeTest(product.id)}

                        examdate={product.examdate}
                        ScheduleTest={() => ScheduleTest(product.id, product.title, product.examdate)}
                        isTestTaken={product.isTestTaken}

                    />

                </div>)}
            <Dialog visible={showDatePickerDialog} style={{width: '32rem'}}
                    breakpoints={{'960px': '75vw', '641px': '90vw'}} footer={ScheduleTestFooter}
                    header="Please select a Date" modal onHide={HideDatePickerDialog}>
                <div className="field">
                    <h4>{selectedProduct.title}</h4>
                    <label htmlFor="TestDate" className="font-bold">
                        TestDate
                    </label>
                    <Calendar id="TestDate" value={selectedProduct.examdate}
                              onChange={(e) => setSelectedProduct({...selectedProduct, examdate: e.target.value})}
                              required minDate={today} dateFormat="dd/mm/yy" showIcon readOnlyInput/>
                    {submitted && !selectedProduct.examdate &&
                        <small className="p-error">BirthDate is required.</small>}
                </div>
            </Dialog>


        </div>
    </div>
</>;
};

export default PurchasesShowcaseS;
