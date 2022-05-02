import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductByName } from "../FirebaseFunctions";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../App";
import { useForm } from "react-hook-form";

const ProductPage = () => {
  const { productName } = useParams();
  const [stockValue, setStockValue] = useState("Loading");

  useEffect(() => {
    fetchStockAndSubscribeToStock();
  });

  const fetchStockAndSubscribeToStock = async () => {
    const { id, stock } = await getProductByName(productName);
    setStockValue(Number(stock));
    return subscribeToStockUpdates(id);
  };

  const subscribeToStockUpdates = (productRefId) => {
    return onSnapshot(doc(db, "products", productRefId), (doc) => {
      const newStockValue = doc.data().stock;
      setStockValue(Number(newStockValue));
    });
  };

  return (
    <div className="product-page">
      <div className="product-info">
        {productName} <div className="stock-info">Stock: {stockValue}</div>
      </div>

      <AddNewStockForm />
      <TakeOrderForm
        maxOrderAmount={stockValue === "loading" ? 0 : stockValue}
      />
    </div>
  );
};

const AddNewStockForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    reset();
  };

  return (
    <form className="update-stock" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-header">Add New Stock</div>
      <div className="input-field">
        <label htmlFor="increment-amount">Amount:</label>
        <input
          type="number"
          id="increment-amount"
          {...register("stockIncrement", {
            required: "Amount is required",
            min: {
              value: 1,
              message: "Amount should be atleast 1",
            },
          })}
        ></input>
        <p className="error-field">{errors.stockIncrement?.message}</p>
      </div>
      <div className="button-div">
        <button className="submit-btn">Add</button>
      </div>
    </form>
  );
};

const TakeOrderForm = ({ maxOrderAmount }) => {
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="take-order">
      <div className="form-header">Take Order</div>
      <div className="input-field">
        <label htmlFor="order-amount">Amount: </label>
        <input
          type="number"
          id="order-amount"
          {...register("orderAmount", {
            required: "Amount is required",
            max: {
              value: maxOrderAmount,
              message: "Insufficient stock",
            },
            min: {
              value: 1,
              message: "Amount should be atleast 1",
            },
          })}
        ></input>
        <p className="error-field">{errors.orderAmount?.message}</p>
      </div>
      <div className="button-div">
        <button className="submit-btn">Take Order</button>
      </div>
    </form>
  );
};

export default ProductPage;
