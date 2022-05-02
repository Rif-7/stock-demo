import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import ProductPage from "./components/ProductPage";

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDGvM7HIpCoohX8_f1wKxCVNUKxXKkJMFw",
  authDomain: "stock-demo-98867.firebaseapp.com",
  projectId: "stock-demo-98867",
  storageBucket: "stock-demo-98867.appspot.com",
  messagingSenderId: "584900581361",
  appId: "1:584900581361:web:62de65563cc0dfb83b9650",
};

const FirebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(FirebaseApp);

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="products/:productName" element={<ProductPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export { FirebaseApp, db };

export default App;
