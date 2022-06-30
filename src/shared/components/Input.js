import React, { useState, useEffect } from "react";
import validator from "validator";

import "./Input.css";

const Input = (props) => {
    const [input, setInput] = useState({
        value: "",
        isValid: false,
        isTouched: false,
    });

    useEffect(() => {
        if (props.reset) {
            setInput({
                value: "",
                isValid: false,
                isTouched: false,
            });
        }
    }, [props.reset]);

    const validate = () => {
        if (props.id === "name" && input.value.length > 1) {
            return true;
        } else if (
            props.id === "phone" &&
            validator.isMobilePhone(input.value)
        ) {
            return true;
        } else if (props.id === "email" && validator.isEmail(input.value)) {
            return true;
        } else if (props.id === "address" && input.value.length > 3) {
            return true;
        } else {
            return false;
        }
    };

    const touchHandler = (event) => {
        const LetIsValid = validate(event.target.value);
        setInput((prevVal) => ({
            ...prevVal,
            isTouched: true,
            isValid: LetIsValid,
        }));
        props.send({
            name: props.id,
            value: input.value,
            isValid: LetIsValid,
        });
    };

    const changeHandler = (event) => {
        const LetIsValid = validate(event.target.value);

        setInput((prevVal) => ({
            ...prevVal,
            value: event.target.value,
            isValid: LetIsValid,
        }));

        props.send({
            name: props.id,
            value: event.target.value,
            isValid: LetIsValid,
        });
    };

    return (
        <input
            className={
                !input.isValid && input.isTouched ? "input-failed" : "input"
            }
            id={props.id}
            name={props.name}
            placeholder={props.placeholder}
            onChange={changeHandler}
            onBlur={touchHandler}
            value={input.value}
        />
    );
};

export default Input;
