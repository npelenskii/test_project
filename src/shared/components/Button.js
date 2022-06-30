import React from "react";

import "./Button.css";

const Button = (props) => {
    return (
        <button type={props.type} className={!props.disabled ? "" : "disabled"}>
            {props.value}
        </button>
    );
};

export default Button;
