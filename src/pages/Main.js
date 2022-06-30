import React from "react";

import SideBar from "../shared/components/SideBar.js";
import Menu from "../shared/components/Menu";

import "./Shared.css";
import "./Main.css";

function Main(props) {
    let currentShopProducts = [];
    props.products.forEach((product) => {
        if (product.shop === props.currentShop.id) {
            currentShopProducts.push(product);
        }
    });

    return (
        <div className="main">
            <React.Fragment>
                <SideBar
                    shops={props.shops}
                    shopClick={props.shopClick}
                    currentShop={props.currentShop}
                    blockedShops={props.blockedShops}
                    error={props.error}
                    isLoading={props.isLoading}
                />
                <Menu
                    products={currentShopProducts}
                    currentShop={props.currentShop}
                    addToCart={props.addToCart}
                    error={props.error}
                    isLoading={props.isLoading}
                />
            </React.Fragment>
        </div>
    );
}

export default Main;
