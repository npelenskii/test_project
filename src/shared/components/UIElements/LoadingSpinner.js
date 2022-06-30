import React from "react";
import ReactDOM from "react-dom";

import "./Modal.css";

const Modal = (props) => {
    const content = (
        <div className="modal">
            <h2>{props.message}</h2>
            <button onClick={() => props.errorClear()}>OK</button>
        </div>
    );
    return ReactDOM.createPortal(content, document.getElementById("error"));
};

export default Modal;
