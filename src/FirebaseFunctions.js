import { db } from "./App";
import {
  addDoc,
  collection,
  query,
  where,
  limit,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  orderBy,
} from "firebase/firestore";

const addProductToStore = async (productName, stock) => {
  productName = productName.toLowerCase().trim();
  stock = Number(stock);
  if (!productName || stock < 1) {
    return "error/invalid-data";
  }

  const productExists = await getProductByName(productName);
  if (productExists) {
    return "error/product-exists";
  }

  return await addDoc(collection(db, "products"), {
    productName,
    stock,
  });
};

const getProductByName = async (productName) => {
  productName = productName.toLowerCase().trim();
  const productRef = query(
    collection(db, "products"),
    where("productName", "==", productName),
    limit(1)
  );
  const productQueryResult = await getDocs(productRef);
  const productData = productQueryResult.docs[0]?.data();
  if (!productData) {
    return false;
  }
  return { ...productData, id: productQueryResult.docs[0].id };
};

const takeOrder = async (productRefId, amount) => {
  const productRef = doc(db, "products", productRefId);
  const product = await getDoc(productRef);
  const productData = product.data();
  const newStockAmount = Number(productData.stock) - Number(amount);
  if (newStockAmount >= 0) {
    await updateDoc(productRef, {
      stock: newStockAmount,
    });
    return "success";
  }
  return "error/insufficient-balance";
};

const addStock = async (productRefId, amount) => {
  const productRef = doc(db, "products", productRefId);
  const product = await getDoc(productRef);
  const productData = product.data();
  const newStockAmount = Number(productData.stock) + Number(amount);
  await updateDoc(productRef, {
    stock: newStockAmount,
  });
  return "success";
};

const getAllProducts = async () => {
  const productQuery = query(
    collection(db, "products"),
    orderBy("productName"),
    limit(50)
  );
  return await getDocs(productQuery);
};

export {
  addProductToStore,
  getProductByName,
  takeOrder,
  addStock,
  getAllProducts,
};
