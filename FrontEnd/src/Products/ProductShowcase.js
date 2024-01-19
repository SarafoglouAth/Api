import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './ProductShowcase.css';
import PaymentForm from "./Popup";
import 'primereact/resources/themes/nova/theme.css';
import { Button } from 'primereact/button';
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";


// Component responsible for showcasing products
const ProductShowcase = ({data}) => {
    // State variables
    const [showPopup, setShowPopup] = useState(false); // Toggle the Payment Form popup
    const toast = useRef(null); // Reference for toast messages
    const [productData, setProductData] = useState([]); // State for product data
    const [selectedProduct, setSelectedProduct] = useState(null); // State for the selected product
    const candidateId = data.candidateId;
    const [loading, setLoading] = useState(true)

    // Individual product component
    const Product = ({ title, image, description, price, Purchase, isPurchased }) => {
        const header = (<img alt="Card" src={image} />); // Header for the product card
        const footer = (
            <>
                {/* Conditional rendering of Purchase or Purchased button */}
                {!isPurchased
                    ? (<Button className="Rounded" onClick={Purchase} label="Purchase" severity="success"></Button>)
                    : <Button className="Rounded" label="Purchased" severity="danger" disabled></Button>
                }
            </>
        );

        // Return the card component displaying product details
        return (
            <>
                <Card title={title} footer={footer} header={header} className="TxtAlCntr"  style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                    <p className="m-0">{description}</p>
                    <h5 className="m-0">price: ${price}</h5>
                </Card>
            </>
        );
    };

    // Fetch product data from an API on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('https://localhost:7060/Purchase/GetCandidateExams/'+candidateId);
                setProductData(response.data); // Set the fetched product data in state
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [loading]);
    const handlePurchase = async (product) => {
        try {
            let responeData= {
                "examId": product.examId,
                "candidateId": candidateId
            }
            console.log(responeData)
            await axios.post('https://localhost:7060/Purchase/NewPurchase', responeData );
            setLoading(true);

        } catch (error) {
            console.error('Error Locking Date:', error);
            // Handle the error, display an error message, etc.
        }
    };
    // Handler for purchasing a product
    const purchaseHandler = (product) => {
        setSelectedProduct(product); // Set the selected product in state
        setShowPopup(true); // Show the payment form popup

    };

    // Handler for submitting a purchase
    const handlePurchaseSubmit = (product) => {
        setShowPopup(false); // Close the payment form popup
        handlePurchase(product);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Purchase successful', life: 3000 }); // Show a success toast message
    };

    // Render the product showcase
    return (
        <>
            <Toast ref={toast} /> {/* Toast component for displaying messages */}

                <div className="product-showcase BackgroundColor">

                <img src="https://i.ibb.co/m5xy0RJ/Screenshot-2024-01-07-213814-transformed.png" alt="Logo" className="Logo" />
                    <h2>Certifications</h2>
                    <div className="products">
                        {/* Map through product data to render individual Product components */}
                        {productData.map((product) => (
                            <div key={product.examId}>
                                <Product
                                    key={product.examId}
                                    title={product.title}
                                    image={product.image}
                                    description={product.description}
                                    price={product.price}
                                    Purchase={() => purchaseHandler(product)}
                                    isPurchased={product.isPurchased}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Render payment form popup if showPopup is true */}
                    {showPopup && (
                        <div className="popup">
                            <span className="close Bckgrnd-Clr" onClick={() => setShowPopup(false)}>
                                &times;
                            </span>
                            {/* Pass selected product and submit handler to PaymentForm component */}
                            <PaymentForm TheProduct={selectedProduct} handlePurchaseSubmit={handlePurchaseSubmit} />
                        </div>
                    )}
                </div>


        </>
    );
};

export default ProductShowcase;
