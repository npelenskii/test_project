import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";

import { useHttpClient } from "../shared/hooks/http-hook";
import Input from "../shared/components/Input";
import Button from "../shared/components/Button";

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "./Shared.css";
import "./Cart.css";

const Cart = (props) => {
    const { sendRequest, isLoading } = useHttpClient();
    const [inputs, setInputs] = useState([
        {
            name: "name",
            value: "",
            isValid: false,
        },
        {
            name: "phone",
            value: "",
            isValid: false,
        },
        {
            name: "email",
            value: "",
            isValid: false,
        },
        {
            name: "address",
            value: "",
            isValid: false,
        },
    ]);

    const [reset, setReset] = useState(false);
    const [orderDone, setOrderDone] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        setReset(false);
    }, [reset]);

    const handleFormSubmit = async (event) => {
        event.preventDefault(event.target.phone.value);
        let productsList = [];
        await props.products.forEach((product) => {
            for (let i = 1; i <= product.amount; i++) {
                productsList.push(product.id);
            }
        });
        let responseData;
        try {
            responseData = await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}api/order/create`,
                "POST",
                JSON.stringify({
                    name: event.target.name.value,
                    phone: event.target.phone.value,
                    email: event.target.email.value,
                    address: event.target.address.value,
                    products: productsList,
                }),
                {
                    "Content-Type": "application/json",
                }
            );
            console.log(responseData);
        } catch (err) {
            console.log(err);
        }
        setReset(true);
        props.makeOrder();
        setOrderDone(responseData);
    };

    let currentPrice = 0;

    const products = props.products.map((product) => {
        currentPrice += product.price * product.amount;
        return (
            <div key={product.id} className="product-card cart-item">
                <img src={product.image} alt={product.name} />
                <p>{product.name}</p>
                <p>{product.price}$</p>
                <button onClick={() => props.plusToCart(product)}>+</button>
                <p>{product.amount}</p>
                <button onClick={() => props.minusFromCart(product)}>-</button>
            </div>
        );
    });

    const handleInputChange = (input) => {
        setInputs((prevInputs) =>
            prevInputs.map((item) => {
                if (item.name === input.name) {
                    item = {
                        ...item,
                        value: input.value,
                        isValid: input.isValid,
                    };
                }
                return item;
            })
        );
    };

    let disabled = false;

    inputs.forEach((input) => {
        if (!input.isValid) {
            disabled = true;
        }
    });

    let orderItem;

    if (orderDone) {
        const OrderProducts = orderDone.order.products.map(
            (product, counter) => (
                <div key={counter} className="history-order-products-container">
                    <h3>{product.name}</h3>
                    <img src={product.image} alt={product.name} />
                </div>
            )
        );
        orderItem = (
            <div key={orderDone.order.id} className="history-order-container">
                <h2>Client information</h2>
                <h3>{orderDone.order.name}</h3>
                <h3>{orderDone.order.email}</h3>
                <h3>{orderDone.order.phone}</h3>
                <h3>{orderDone.order.address}</h3>
                <h2>Goods</h2>
                {OrderProducts}
                <h2>{orderDone.order.price}$</h2>
                <button onClick={() => navigate("/")}>Make next Order</button>
            </div>
        );
    }

    return (
        <React.Fragment>
            {isLoading && (
                <TailSpin
                    height="100"
                    width="100"
                    color="orange"
                    ariaLabel="loading"
                />
            )}
            {props.error && <h3>Cant order now, try again later</h3>}
            {orderDone ? (
                <div>
                    <h2>Your order accepted</h2>
                    {orderItem}
                </div>
            ) : (
                <React.Fragment>
                    <h2>Order Form</h2>
                    <form
                        onSubmit={
                            !disabled
                                ? handleFormSubmit
                                : (event) => {
                                      event.preventDefault();
                                  }
                        }
                        className="form"
                    >
                        <Input
                            placeholder="Enter your name"
                            id="name"
                            name="name"
                            send={handleInputChange}
                            reset={reset}
                        />
                        <Input
                            placeholder="Enter your phone number"
                            id="phone"
                            send={handleInputChange}
                            reset={reset}
                        />
                        <Input
                            placeholder="Enter your email"
                            id="email"
                            send={handleInputChange}
                            reset={reset}
                        />
                        <Input
                            placeholder="Enter your address"
                            id="address"
                            send={handleInputChange}
                            reset={reset}
                        />
                        <Button
                            type="submit"
                            value="Submit order"
                            disabled={disabled}
                        />
                    </form>

                    {props.currentShop &&
                    props.products.length !== 0 &&
                    !isLoading ? (
                        <h2>Current Shop: {props.currentShop.name}</h2>
                    ) : (
                        <h2>Your Cart is empty</h2>
                    )}
                    {props.isLoading ? (
                        <TailSpin
                            height="100"
                            width="100"
                            color="orange"
                            ariaLabel="loading"
                        />
                    ) : (
                        <h3>Current price: {currentPrice}$</h3>
                    )}

                    <div className="cart-container">{products}</div>
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

export default Cart;
