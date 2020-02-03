import { useState } from 'react'


export const useTextInput = initialValue => {
    const [value, setValue] = useState(initialValue);

    return {
        value,
        setValue,
        set: () => setValue(""),
        bind: {
            value,
            onChange: event => {
                setValue(event.target.value);
            }
        }
    };
};
