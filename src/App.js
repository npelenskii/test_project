import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";

import { useHttpClient } from "./shared/hooks/http-hook";

import MainNavigation from "./shared/components/Navigation/MainNavigation";
import Main from "./pages/Main";
import Cart from "./pages/Cart";
import History from "./pages/History";

function App() {
    const { sendRequest, isLoading, error, clearError } = useHttpClient();
    const [shops, setShops] = useState([]);
    const [currentShop, setCurrentShop] = useState();
    const [blockedShops, setBlockedShops] = useState([]);
    const [products, setProducts] = useState({
        menuProducts: [],
        cartItems: [],
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchItems = async () => {
            console.log(`${process.env.REACT_APP_BACKEND_URL}api/product/shop`);
            const responseData = await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}api/product/shop`
            );
            let loadedShops = [],
                menuList = [],
                cartList = [],
                localCart = JSON.parse(localStorage.getItem("cartItems")) || [];

            responseData.shops.forEach((shop) => {
                loadedShops.push(shop);
                shop.products.forEach((product) => {
                    if (localCart.find((item) => item.id === product.id)) {
                        if (
                            cartList.filter((item) => item.id === product.id)
                                .length === 0
                        )
                            cartList.push({
                                ...product,
                                amount: 1,
                            });
                    } else {
                        if (
                            menuList.filter((item) => item.id === product.id)
                                .length === 0
                        )
                            menuList.push(product);
                    }
                });
            });

            if (cartList.length > 0) {
                setCurrentShop(
                    loadedShops.find((shop) => shop.id === cartList[0].shop)
                );
                setBlockedShops(
                    loadedShops.filter((shop) => shop.id !== cartList[0].shop)
                );
            } else {
                setCurrentShop(loadedShops[0]);
                setBlockedShops([]);
            }
            setShops(loadedShops);

            setProducts({ menuProducts: menuList, cartItems: cartList });
        };
        fetchItems();
    }, [sendRequest]);

    useEffect(() => {
        if (products.cartItems.length !== 0)
            localStorage.setItem(
                "cartItems",
                JSON.stringify(products.cartItems)
            );
    }, [products.cartItems]);

    const HandleShopChange = (shop) => {
        setCurrentShop(shop);
    };

    const HandleAddToCart = (product) => {
        setProducts((prevProducts) => ({
            menuProducts: prevProducts.menuProducts.filter(
                (item) => item.id !== product.id
            ),
            cartItems: [...prevProducts.cartItems, { ...product, amount: 1 }],
        }));
        setBlockedShops(shops.filter((shop) => shop.id !== product.shop));
    };

    const HandleMinusFromCart = (product) => {
        if (product.amount === 1) {
            if (products.cartItems.length === 1) {
                setBlockedShops([]);
                localStorage.removeItem("cartItems");
            }
            setProducts((prevProducts) => ({
                menuProducts: [...prevProducts.menuProducts, product],
                cartItems: prevProducts.cartItems.filter(
                    (cartItem) => cartItem.id !== product.id
                ),
            }));
        } else {
            setProducts((prevProducts) => ({
                menuProducts: prevProducts.menuProducts.filter(
                    (item) => item.id !== product.id
                ),
                cartItems: prevProducts.cartItems.map((cartProduct) => {
                    if (cartProduct.id === product.id) {
                        cartProduct.amount = cartProduct.amount - 1;
                    }
                    return cartProduct;
                }),
            }));
        }
    };

    const HandlePlusToCart = (product) => {
        setProducts((prevProducts) => ({
            menuProducts: prevProducts.menuProducts.filter(
                (item) => item.id !== product.id
            ),
            cartItems: prevProducts.cartItems.map((cartProduct) => {
                if (cartProduct.id === product.id) {
                    cartProduct.amount = cartProduct.amount + 1;
                }
                return cartProduct;
            }),
        }));
    };

    const HandleTakeOrder = (order) => {
        let menuList = [],
            cartList = [];

        products.cartItems.forEach((product) => {
            console.log(order.products.find((item) => item.id === product.id));
            if (
                order.products.filter((item) => item.id === product.id).length >
                0
            ) {
                cartList.push(product);
            } else {
                menuList.push(product);
            }
        });

        products.menuProducts.forEach((product) => {
            if (
                order.products.filter((item) => item.id === product.id).length >
                0
            ) {
                cartList.push(product);
            } else {
                menuList.push(product);
            }
        });

        cartList = cartList.map((product) => {
            return {
                ...product,
                amount: 1,
            };
        });

        setBlockedShops(shops.filter((shop) => shop.id !== cartList[0].shop));

        setProducts({
            menuProducts: menuList,
            cartItems: cartList,
        });
        navigate("/cart");
    };

    const handleMakeOrder = () => {
        localStorage.removeItem("cartItems");
        setProducts((prevProducts) => ({
            menuProducts: prevProducts.menuProducts.concat(
                prevProducts.cartItems
            ),
            cartItems: [],
        }));
        setBlockedShops([]);
    };

    return (
        <React.Fragment>
            <MainNavigation />
            <Routes>
                <Route
                    path="/"
                    element={
                        <Main
                            shops={shops || []}
                            products={products.menuProducts || []}
                            currentShop={currentShop}
                            shopClick={HandleShopChange}
                            addToCart={HandleAddToCart}
                            isLoading={isLoading}
                            error={error}
                            clearError={clearError}
                            blockedShops={blockedShops}
                        />
                    }
                    exact
                />
                <Route
                    path="/cart"
                    element={
                        <Cart
                            products={products.cartItems || []}
                            currentShop={currentShop}
                            minusFromCart={HandleMinusFromCart}
                            plusToCart={HandlePlusToCart}
                            isLoading={isLoading}
                            makeOrder={handleMakeOrder}
                        />
                    }
                    exact
                />
                <Route
                    path="/history"
                    element={<History takeOrder={HandleTakeOrder} />}
                    exact
                />
                <Route path="/" element={<Navigate replace to="/" />} />
            </Routes>
        </React.Fragment>
    );
}

export default App;
