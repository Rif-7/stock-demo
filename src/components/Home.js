import React from "react";
import { useForm } from "react-hook-form";

const Home = () => {
  const getProduct = (data) => {
    console.log(data);
  };

  const addNewProduct = (data) => {
    console.log(data);
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
  } = useForm();

  return (
    <form className="add-product" onSubmit={handleSubmit(addNewProduct)}>
      <div className="form-header">Add New Product</div>
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
      <button className="submit-btn add-product">Add</button>
    </form>
  );
};

const GetProductForm = ({ getProduct }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form className="view-product" onSubmit={handleSubmit(getProduct)}>
      <div className="form-header">View Product</div>
      <div className="input-field">
        <label htmlFor="product-query">Product: </label>
        <input
          type="text"
          {...register("productQuery", {
            required: "Product Name is required",
          })}
        ></input>
        <p className="error-field">{errors.productQuery?.message}</p>
      </div>
      <button className="submit-btn">Get</button>
    </form>
  );
};

export default Home;
