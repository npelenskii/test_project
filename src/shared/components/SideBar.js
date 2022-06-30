import React from "react";
import { TailSpin } from "react-loader-spinner";

import "./SideBar.css";

const SideBar = (props) => {
    const elements = props.shops.map((shop, counter) => {
        let blocked = false;
        if (props.blockedShops.find((item) => item.id === shop.id)) {
            blocked = true;
        }
        return (
            <div
                key={counter}
                onClick={!blocked ? () => props.shopClick(shop) : undefined}
                className={
                    props.currentShop.name === shop.name
                        ? "sidebar-item-reversed"
                        : `${
                              blocked ? "sidebar-item disabled" : "sidebar-item"
                          }`
                }
            >
                <p>{shop.name}</p>
            </div>
        );
    });
    return (
        <div className="container-heading">
            <h2>Shops</h2>
            {props.isLoading && (
                <TailSpin
                    height="50"
                    width="50"
                    color="orange"
                    ariaLabel="loading"
                />
            )}
            <div className="sidebar-container">
                {props.error && <h3>Cant load please try again later</h3>}
                {elements}
            </div>
        </div>
    );
};

export default SideBar;
