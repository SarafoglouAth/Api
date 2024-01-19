import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import axios from "axios";
import { Image } from 'primereact/image';

export default function ProductsCRUD({Role,handleQuestionVisibility}) {
    let emptyProduct = {
        id: 0,
        title: '',
        image: null,
        description: '',
        price: 0
    };

    const [products, setProducts] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null);
    const dt = useRef(null)
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('https://localhost:7060/exams');
                setProducts(response.data); // Set the fetched product data in state
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [loading]);
    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const saveProduct = () => {

        setSubmitted(true);

        if (
            !product.title ||
            !product.image ||
            !product.description ||
            !product.price
        ) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Please fill in all required fields.',
            });
            return;
        }


        if (product.id !==0) {
            // If Candidate has an ID, it means we are updating an existing candidate
            handleUpdate();
        } else {
            // If Candidate doesn't have an ID, it means we are creating a new candidate
            handleCreate();
        }

        setProductDialog(false);
        setProduct(emptyProduct);
        // do some stuff
    };
    const handleUpdate = async () => {
        try {

            const response = await axios.put(`https://localhost:7060/exams/Update`, product );
            setLoading(true);
            console.log(response.data); // Handle the response as needed

            // Optionally, you can perform some action on successful update
            // For example, show a success message, redirect to another page, etc.
        } catch (error) {
            console.error('Error updating candidate:', error);
            // Handle the error, display an error message, etc.
        }
    };
    const handleCreate = async () => {
        try {
            const response = await axios.post(`https://localhost:7060/exams/new`,
                product,  // Assuming 'exam' is your ExamDto
            );


            setLoading(true);
            console.log(response.data); // Handle the response as needed
        } catch (error) {
            console.error('Error creating product:', error);
            // Handle the error, display an error message, etc.
        }
    };
    const handleDelete = async () => {
        try {
            // Assuming Candidate.id is the candidate's ID
            const response = await axios.delete(`https://localhost:7060/exams/Delete?id=`+product.id   );
            setLoading(true);
            console.log(response.data); // Handle the response as needed

            // Optionally, you can perform some action on successful update
            // For example, show a success message, redirect to another page, etc.
        } catch (error) {
            console.error('Error deliting product:', error);
            // Handle the error, display an error message, etc.
        }
    };
    const editProduct = (product) => {
        setProduct({ ...product });
        setProductDialog(true);

    };

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
    let _products = products.filter((val) => val.id !== product.id);
 setProducts(_products);
            handleDelete();
            setDeleteProductDialog(false);
            setProduct(emptyProduct);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });

    };




    const exportCSV = () => {
        dt.current.exportCSV();
    };



    const onInputChange = (e, title) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };

        _product[`${title}`] = val;

        setProduct(_product);
    };

    const onInputNumberChange = (e, title) => {
        const val = e.value || 0;
        let _product = { ...product };

        _product[`${title}`] = val;

        setProduct(_product);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                {Role ==="Admin"&& <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew}/>}
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };

    const ImageBodyTemplate = (rowData) => {
        return <Image src={rowData.image} alt="Image" width="250" preview />;
    };

     const showQuestionsAnswers = (rowData) => {
        let _product = rowData;
        handleQuestionVisibility(_product);
    };




    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>

                {Role ==="Admin"? <> <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} />
                        <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)} />
                        <Button icon="pi pi-question-circle" rounded outlined  onClick={() => showQuestionsAnswers(rowData)} /> </> :
                    <Button icon="pi pi-question-circle" rounded outlined className="mr-2" onClick={() => showQuestionsAnswers(rowData)} />}

            </React.Fragment>
        );
    };




    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveProduct} />
        </React.Fragment>
    );
    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteProduct} />
        </React.Fragment>
    );


    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={products} loading={loading}
                           dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                           paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                           currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" >
                    <Column field="id" header="ID" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="title" header="Title" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="image" header="Image" preview  body={ImageBodyTemplate}></Column>
                    <Column field="description" header="Description"  style={{ minWidth: '10rem' }}></Column>
                    <Column field="price" header="Price $"  sortable style={{ minWidth: '12rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{minWidth: '12rem'}}></Column>
                </DataTable>
            </div>

            <Dialog visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                <div style={{display: "flex",justifyContent:"center"}}> {product.image && <Image src={product.image} alt="Image" width="250" preview />}</div>
                <div className="field">
                    <label htmlFor="image" className="font-bold">
                        Image
                    </label>
                    <InputText id="image" value={product.image} onChange={(e) => onInputChange(e, 'image')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.image })} />
                    {submitted && !product.image && <small className="p-error">Image is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="title" className="font-bold">
                        title
                    </label>
                    <InputText id="title" value={product.title} onChange={(e) => onInputChange(e, 'title')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.title })} />
                    {submitted && !product.title && <small className="p-error">title is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="description" className="font-bold">
                        description
                    </label>
                    <InputTextarea id="description" value={product.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                </div>

                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="price" className="font-bold">
                            price
                        </label>
                        <InputNumber id="price" value={product.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="USD" locale="en-US" />
                    </div>
                </div>
            </Dialog>

            <Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && (
                        <span>
                            Are you sure you want to delete <b>{product.title}</b>?
                        </span>
                    )}
                </div>
            </Dialog>


        </div>
    );
}
