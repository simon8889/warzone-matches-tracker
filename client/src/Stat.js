import React, { lazy } from "react";
import "./index.css";
 
const Stat = props => {
    return (
        <div className="stat">
            <h3 className="stat__title">{props.title}:</h3>
            <p className="stat__value">{props.value}</p>
        </div>
    )
}

export default Stat;