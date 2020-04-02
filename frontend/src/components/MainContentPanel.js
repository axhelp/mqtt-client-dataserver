import React, {Component} from 'react';
import Configuration from './Configuration';
import {getDeviceHostAddress} from '../helpers/utils';

const appConfigUrl = `${getDeviceHostAddress()}/config`;
const appStatusUrl = `${getDeviceHostAddress()}/status`;

class MainContentPanel extends Component {
    render() {
        return (
                <Configuration
                    appConfigUrl={appConfigUrl}
                    appStatusUrl={appStatusUrl}
                />
        );
    }
}

export default MainContentPanel;
