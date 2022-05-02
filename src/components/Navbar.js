import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <span className="header">
        <Link to="/">Stock Viewer</Link>
      </span>
      <span className="view-all">
        <Link to="/all">All Products</Link>
      </span>
    </nav>
  );
};

export default Navbar;
