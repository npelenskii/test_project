import React from "react";
import { NavLink } from "react-router-dom";

import "./NavLinks.css";

const NavLinks = (props) => {
    return (
        <div className="nav-links">
            <NavLink to="/" className="link">
                Shop
            </NavLink>
            <NavLink to="/cart" className="link">
                Shopping Cart
            </NavLink>
            <NavLink to="/history" className="link">
                History
            </NavLink>
        </div>
    );
};

export default NavLinks;
