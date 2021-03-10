import React, { Component } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./ProvideAuth";

const Navbar = (props) => {
  const auth = useAuth();

  return (
    <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
      <Link to="/" className="navbar-brand">
        FamilyMonkey
      </Link>
      <div className="collpase navbar-collapse">
        <ul className="navbar-nav mr-auto">
          <li className="navbar-item">
            <Link to="/app" className="nav-link">
              List
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/add" className="nav-link">
              Add family member
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/account" className="nav-link">
              Account
            </Link>
          </li>
          <li className="navbar-item">
            <Link
              to="/login"
              className="nav-link"
              onClick={() => auth.logout()}
            >
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
