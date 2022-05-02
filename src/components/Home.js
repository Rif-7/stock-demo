import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { addProductToStore, getProductByName } from "../FirebaseFunctions";
import ReactLoading from "react-loading";
import { Navigate } from "react-router-dom";

const Home = () => {
  const getProduct = async (data) => {
    const { productName } = data;
    return await getProductByName(productName);
  };

  const addNewProduct = async (data) => {
    const { productName, stockAmount } = data;
    return await addProductToStore(productName, stockAmount);
  };

  return (
    <div className="home">
      <AddProductForm addNewProduct={addNewProduct} />
      <GetProductForm getProduct={getProduct} />
    </div>
  );
};

const AddProductForm = ({ addNewProduct }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [formStatus, setFormStatus] = useState("idle");
  const [customError, setCustomError] = useState(null);

  const onSubmit = async (data) => {
    setCustomError(null);
    setFormStatus("loading");
    const result = await addNewProduct(data);
    if (result === "error/invalid-data") {
      setCustomError("Invalid Data");
    } else if (result === "error/product-exists") {
      setCustomError("Product Already Exists");
    } else {
      reset();
    }
    setFormStatus("idle");
  };

  // if any error exists in the input fields set the custom error to null
  if (errors[Object.keys(errors)[0]]?.message) {
    if (customError !== null) {
      setCustomError(null);
    }
  }

  return (
    <form className="add-product" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-header">Add New Product</div>
      {customError ? <p className="error-field">{customError}</p> : null}
      <div className="input-field">
        <label htmlFor="product-name">Product Name: </label>
        <input
          type="text"
          id="product-name"
          {...register("productName", {
            required: "Product Name is required",
          })}
        ></input>
        <p className="error-field">{errors.productName?.message}</p>
      </div>
      <div className="input-field">
        <label htmlFor="stock">Stock: </label>
        <input
          type="number"
          {...register("stockAmount", {
            required: "Stock Amount is required",
            min: {
              value: 1,
              message: "Stock Amount should be greater than 1",
            },
          })}
        ></input>
        <p className="error-field">{errors.stockAmount?.message}</p>
      </div>

      <div className="button-div">
        <button className="submit-btn add-product">Add</button>
        {formStatus === "loading" ? (
          <ReactLoading
            type="spin"
            color="#ffbfa0"
            height="40px"
            width="40px"
          />
        ) : null}
      </div>
    </form>
  );
};

const GetProductForm = ({ getProduct }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const [formStatus, setFormStatus] = useState("idle");
  const [customError, setCustomError] = useState(null);

  const onSubmit = async (data) => {
    setCustomError(null);
    setFormStatus("loading");
    const result = await getProduct(data);
    if (!result) {
      setCustomError("Product Not Found");
      setFormStatus("idle");
    }
    setFormStatus("redirect");
  };

  // if any error exists in the input fields set the custom error to null
  if (errors[Object.keys(errors)[0]]?.message) {
    if (customError !== null) {
      setCustomError(null);
    }
  }

  const productName = watch("productName");
  if (formStatus === "redirect") {
    return <Navigate replace to={`/products/${productName}`} />;
  }

  return (
    <form className="view-product" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-header">View Product</div>
      {customError ? <p className="error-field">{customError}</p> : null}
      <div className="input-field">
        <label htmlFor="product-query">Product: </label>
        <input
          type="text"
          {...register("productName", {
            required: "Product Name is required",
          })}
        ></input>
        <p className="error-field">{errors.productQuery?.message}</p>
      </div>
      <div className="button-div">
        <button className="submit-btn">Get</button>
        {formStatus === "loading" ? (
          <ReactLoading
            type="spin"
            color="#ffbfa0"
            height="40px"
            width="40px"
          />
        ) : null}
      </div>
    </form>
  );
};

export default Home;
