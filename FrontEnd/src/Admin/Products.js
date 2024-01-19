import React, {useState} from "react";

import ProductsCRUD from "./ProductsCRUD";
import ExamQuestions from "./Questions/ExamQuestions";

const Products = ({Role}) => {
    const [showQuestions, setShowQuestions] = useState(false);
    const [targetedProduct, setTargetedProduct] = useState(null);


    const handleQuestionVisibility = (product) => {
        setTargetedProduct(product);
        setShowQuestions(true);
    };

    const hideQuestions = () => {
        setTargetedProduct(null);
        setShowQuestions(false);
    };

    return (
        <>
            {showQuestions ? (
                <ExamQuestions
                    targetedProduct={targetedProduct}
                    hideQuestions={hideQuestions}
                    Role={Role}
                />
            ) : (
                <ProductsCRUD
                    Role={Role}
                    handleQuestionVisibility={handleQuestionVisibility}
                />
            )}
        </>
    );
};

export default Products;
