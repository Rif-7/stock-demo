import { db } from "./App";
import {
  addDoc,
  collection,
  query,
  where,
  limit,
  getDocs,
} from "firebase/firestore";

const addProductToStore = async (productName, stock) => {
  productName = productName.toLowerCase().trim();
  stock = Number(stock);
  if (!productName || stock < 1 || productName === "all") {
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
  return productData;
};

export { addProductToStore, getProductByName };
