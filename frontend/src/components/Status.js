import React from 'react';
import Label from './Label';


export const StatusEnum = {
    OK: `OK`,
    WARN: `WARN`,
    ERROR: `ERROR`
};

const getColorByStatus = (status) => {
    switch (status) {
        case StatusEnum.OK:
            return `green`;

        case StatusEnum.WARN:
            return `#FFC000`;

        case StatusEnum.ERROR:
            return `#ED1C24`;

        default :
            return `#ED1C24`;
    }
};

export const Status = (props) => {
    const {label, status, message} = props;

    return (
        <div>
            <Label
                label={label}
            />
            <span
                style={{
                    height: "15px",
                    width: "15px",
                    backgroundColor: getColorByStatus(status),
                    borderRadius: "50%",
                    display: "inline-block",
                    marginRight: "6px"
                }}> </span>
            <span
                style={{color: getColorByStatus(status)}}
            >
                {message}
            </span>
        </div>
    )
};
