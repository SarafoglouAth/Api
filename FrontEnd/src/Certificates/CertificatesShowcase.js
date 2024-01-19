import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import '../Products/ProductShowcase.css';
import 'primereact/resources/themes/nova/theme.css';
import { Button } from 'primereact/button';
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import Tester from "../Admin/Tester";
import {Dialog} from "primereact/dialog";




// Component responsible for showcasing Certificates

const CertificatesShowcase = ({data}) => {
    // State variables
    const url="https://localhost:7060/certificates/findOneForUser/";
    const toast = useRef(null); // Reference for toast messages
    const [CertificateData, setCertificateData] = useState([]); // State for Certificate data
    const [PreviewCertificateDialog, setPreviewCertificateDialog] = useState(false);
    const [CertificatePrintData, setCertificatePrintData]  =useState({ Name: '', Date: '', Course: '', id: 1});
    const [loading, setLoading] = useState(true); // State for displaying loading indicator


    const hideDialogPreview = () => {
        setPreviewCertificateDialog(false);
    };
    const PreviewCertificateDialogFooter  = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialogPreview} />
        </React.Fragment>
    );


    const CertificateTemplate = ({id,tilte,image,certificationDate,percentageScore,Name}) => {
        function DownloadCertificate(rowData) {
            setPreviewCertificateDialog(true);
            setCertificatePrintData({Date: certificationDate, id: id, Name: Name, tilte: tilte});
        }
        const header = (<img alt="Card" src={image} />); // Header for the Certificate card
        const footer = (
          <Button className="Rounded" onClick={() => DownloadCertificate()} label="Download" severity="secondary"></Button>
        );

        // Return the card component displaying Certificate details
        return (
            <>
                <Card title={tilte} footer={footer} header={header} className="TxtAlCntr">
                    <p className="m-0">Date : {certificationDate}</p>
                    <p className="m-0">Score : {percentageScore}%</p>
                </Card>
            </>
        );
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(url+data.candidateId);
                setCertificateData(response.data); // Set the fetched Certificate data in state
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [loading]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Render the Certificate showcase
    return (
        <>
            <Toast ref={toast} /> {/* Toast component for displaying messages */}

            <div className="product-showcase BackgroundColor">
                <h2>Certificates Acquired</h2>
                <div className="products">
                    {/* Map through Certificate data to render individual Certificate components */}
                    {CertificateData.map((Certificate) => (
                        <div key={Certificate.id}>
                            <CertificateTemplate
                                id={Certificate.id}
                                tilte={Certificate.tilte}
                                image={Certificate.image}
                                certificationDate={formatDate(Certificate.certificationDate)}
                                percentageScore={Certificate.percentageScore}
                                Name={Certificate.firstName + " " + Certificate.middleName[0] + ".  " + Certificate.lastName}
                            />
                        </div>
                    ))}
                </div>

                {/* Render payment form popup if showPopup is true */}
                <Dialog visible={PreviewCertificateDialog}  header="Preview Certificate" modal className="p-fluid" footer={PreviewCertificateDialogFooter} onHide={()=> setPreviewCertificateDialog(false)}>
                    <Tester id={CertificatePrintData.id} date={CertificatePrintData.Date} name={CertificatePrintData.Name} course={CertificatePrintData.tilte}/>

                </Dialog>
            </div>
        </>
    );
};

export default CertificatesShowcase;
