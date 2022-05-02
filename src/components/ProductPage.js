import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductByName, takeOrder, addStock } from "../FirebaseFunctions";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../App";
import { useForm } from "react-hook-form";
import ReactLoading from "react-loading";

const ProductPage = () => {
  const { productName } = useParams();
  const [stockValue, setStockValue] = useState("Loading");
  const [productRef, setProductRef] = useState(null);

  useEffect(() => {
    fetchStockAndSubscribeToStock();
  });

  const fetchStockAndSubscribeToStock = async () => {
    const { id, stock } = await getProductByName(productName);
    setStockValue(Number(stock));
    setProductRef(id);
    return subscribeToStockUpdates(id);
  };

  const subscribeToStockUpdates = (productRefId) => {
    return onSnapshot(doc(db, "products", productRefId), (doc) => {
      const newStockValue = doc.data().stock;
      setStockValue(Number(newStockValue));
    });
  };

  const onTakeOrder = async (data) => {
    const { orderAmount } = data;
    if (!productRef) {
      console.log("Product Ref Id not found");
      return;
    }
    return await takeOrder(productRef, orderAmount);
  };

  const onAddStock = async (data) => {
    const { stockIncrement } = data;
    if (!productRef) {
      console.log("Product Ref Id not found");
      return;
    }
    return await addStock(productRef, stockIncrement);
  };

  return (
    <div className="product-page">
      <div className="product-info">
        {productName} <div className="stock-info">Stock: {stockValue}</div>
      </div>

      <AddNewStockForm onAddStock={onAddStock} />
      <TakeOrderForm
        maxOrderAmount={stockValue === "loading" ? 0 : stockValue}
        onTakeOrder={onTakeOrder}
      />
    </div>
  );
};

const AddNewStockForm = ({ onAddStock }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [formStatus, setFormStatus] = useState("idle");

  const onSubmit = async (data) => {
    setFormStatus("loading");
    try {
      await onAddStock(data);
    } catch (error) {
      console.log(error);
    }
    reset();
    setFormStatus("idle");
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

const TakeOrderForm = ({ maxOrderAmount, onTakeOrder }) => {
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm();

  const [formStatus, setFormStatus] = useState("idle");

  const onSubmit = async (data) => {
    setFormStatus("loading");
    try {
      await onTakeOrder(data);
    } catch (error) {
      console.log(error);
    }
    reset();
    setFormStatus("idle");
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

export default ProductPage;
