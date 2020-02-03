import React from 'react';
import Label from './Label';


const TextInput = (props) => {
    const {label, placeholder, maxLength, required, name, value, onChange} = props;

    return (
        <div className="form_group">
            <Label
                label={label}
            />
            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                maxLength={maxLength}
                required={required}
                style={{
                    width: "480px"
                }}
            />
        </div>
    )

};


export default TextInput
