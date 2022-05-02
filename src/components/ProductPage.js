import React from "react";
import { useParams } from "react-router-dom";

const ProductPage = () => {
  const { productName } = useParams();
  return <div className="product-page">{productName}</div>;
};

export default ProductPage;
