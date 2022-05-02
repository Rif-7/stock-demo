import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllProducts } from "../FirebaseFunctions";

const AllProducts = () => {
  const [componentState, setComponentState] = useState("loading");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProductList();
  }, []);

  const getProductList = async () => {
    const allProducts = await getAllProducts();
    const allProductsList = allProducts.docs.map((doc, index) => {
      return doc.data();
    });
    setComponentState("idle");
    setProducts(allProductsList);
  };

  if (componentState === "loading") {
    return <div className="indicator">Loading</div>;
  } else if (products.length === 0) {
    return <div className="indicator">No Products Found</div>;
  }

  return (
    <div className="all-products">
      {products.map((product, index) => {
        return (
          <CompactProductView
            productName={product.productName}
            stock={product.stock}
            key={index}
          />
        );
      })}
    </div>
  );
};

const CompactProductView = ({ productName, stock }) => {
  return (
    <div className="compact-view">
      <div className="compact-product-name">
        <Link to={`/products/${productName}`}>{productName}</Link>
      </div>
      <div className="compact-stock-info">Stock: {stock}</div>
    </div>
  );
};

export default AllProducts;
