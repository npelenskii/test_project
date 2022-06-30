import React from "react";
import { TailSpin } from "react-loader-spinner";

import "../../pages/Shared.css";

import "./Menu.css";

const Menu = (props) => {
    const products = props.products.map((product) => (
        <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} />
            <p>{product.name}</p>
            <p>{product.price}$</p>
            <button onClick={() => props.addToCart(product)}>
                Add To Cart
            </button>
        </div>
    ));
    return (
        <React.Fragment>
            <div className="container-heading">
                <h2>Goods</h2>
            </div>
            {props.isLoading && (
                <TailSpin
                    height="100"
                    width="100"
                    color="orange"
                    ariaLabel="loading"
                />
            )}
            {props.error && <h3>Cant load please try again later</h3>}
            <div className="menu-container">{products}</div>
        </React.Fragment>
    );
};

export default Menu;
