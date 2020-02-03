import React from 'react'

const Label = (props) => {
    const {label} = props;

    return (
        <label
            style={{
                width: "146px",
                display: "inline-block",
                paddingBottom: "10px"
            }}
        >
            {label}
        </label>
    )

};

export default Label
