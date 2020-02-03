import React from 'react'

const DeviceName = (props) => {
    const {deviceName} = props;

    return (
        <div id='c_glb_device_name' className='ellipsis'>
            <span className='c_glb_device_name'> </span>
            <span title=''>: {deviceName}</span>
        </div>
    )
};

export default DeviceName
