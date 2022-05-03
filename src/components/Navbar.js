import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <span className="header">
        <Link to="/stock-demo">Stock Viewer</Link>
      </span>
      <span className="view-all">
        <Link to="stock-demo/all">All Products</Link>
      </span>
    </nav>
  );
};

export default Navbar;
