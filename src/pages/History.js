import React, { useState, useEffect } from "react";

import { useHttpClient } from "../shared/hooks/http-hook";

import Input from "../shared/components/Input";
import Button from "../shared/components/Button";

import "./Shared.css";
import "./History.css";

const History = (props) => {
    const { sendRequest } = useHttpClient();
    const [orders, setOrders] = useState();
    const [inputs, setInputs] = useState([
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
    ]);
    const [reset, setReset] = useState(false);

    useEffect(() => {
        setReset(false);
    }, [reset]);

    const handleFormSubmit = async (event) => {
        event.preventDefault(event.target.phone.value);
        try {
            const responseData = await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}api/order/history`,
                "POST",
                JSON.stringify({
                    phone: event.target.phone.value,
                    email: event.target.email.value,
                }),
                {
                    "Content-Type": "application/json",
                }
            );
            setOrders(responseData.orders);
            console.log(responseData.orders);
        } catch (err) {
            console.log(err);
        }
        setReset(true);
    };

    let ordersItems = [];

    if (orders) {
        ordersItems = orders.map((item) => {
            const products = item.products.map((product, counter) => (
                <div key={counter} className="history-order-products-container">
                    <h3>{product.name}</h3>
                    <img src={product.image} alt={product.name} />
                </div>
            ));
            return (
                <div key={item.id} className="history-order-container">
                    <h2>Client information</h2>
                    <h3>{item.name}</h3>
                    <h3>{item.email}</h3>
                    <h3>{item.phone}</h3>
                    <h3>{item.address}</h3>
                    <h2>Goods</h2>
                    {products}
                    <h2>{item.price}$</h2>
                    <button onClick={() => props.takeOrder(item)}>
                        Add items to Cart
                    </button>
                </div>
            );
        });
    }

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

    if (!inputs[0].isValid && !inputs[1].isValid) {
        disabled = true;
    }

    return (
        <div>
            <h2>Find your previous orders</h2>
            <form
                onSubmit={
                    disabled
                        ? (event) => {
                              event.preventDefault();
                          }
                        : handleFormSubmit
                }
                className="form"
            >
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
                <Button type="submit" value="Search" disabled={disabled} />
            </form>
            <div className="history-orders">
                {orders && ordersItems.length === 0 && (
                    <h3>
                        Cant find orders by your inputs, try change your data or
                        try again later
                    </h3>
                )}
                {ordersItems}
            </div>
        </div>
    );
};

export default History;
