import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <span className="header">
        <Link to="/stock-demo">Stock Viewer</Link>
      </span>
      <button className="view-all submit-btn">
        <Link to="stock-demo/all">All Products</Link>
      </button>
    </nav>
  );
};

export default Navbar;
