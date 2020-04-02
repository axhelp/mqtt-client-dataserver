import React, {useState, useEffect} from 'react';
import FileInput from './FileInput';
import TextInput from './TextInput';
import Label from './Label';
import {Status, StatusEnum} from './Status';
import {useTextInput} from '../hooks/use-text-input';
import {getDeviceHostAddress} from '../helpers/utils';
import {useInterval} from '../hooks/use-interval';


const appConfigUrl = `${getDeviceHostAddress()}/config`;
const appStatusUrl = `${getDeviceHostAddress()}/status`;

const Configuration = () => {
    const {value: brokerAddress, bind: bindBrokerAddress, setValue: setBrokerAddress} = useTextInput('');
    const {value: rootCaFle, bind: bindRootCaFile, setValue: setRootCaFile} = useTextInput('');
    const {value: certFile, bind: bindCertFile, setValue: setCertFile} = useTextInput('');
    const {value: keyFile, bind: bindKeyFile, setValue: setKeyFile} = useTextInput('');
    const {value: clientId, bind: bindClientId, setValue: setClientId} = useTextInput('');
    const {value: publishTopic, bind: bindPublishTopic, setValue: setPublishTopic} = useTextInput('');
    const {value: subscribeTopic, bind: bindSubscribeTopic, setValue: setSubscribeTopic} = useTextInput('');
    const {value: dataServerPort, bind: bindDataServerPort, setValue: setDataServerPort} = useTextInput('');
    const {value: webServerPort, bind: bindWebServerPort, setValue: setWebServerPort} = useTextInput('');
    const [appStatus, setAppStatus] = useState({});

    useEffect(() => {
        const fetchConfig = async () => {
            const res = await fetch(
                appConfigUrl
            );
            try {
                const config = await res.json();
                if (config) {
                    setBrokerAddress(config.brokers[0].host);
                    setRootCaFile(config.brokers[0].connect_options.ssl_options.trust_store);
                    setCertFile(config.brokers[0].connect_options.ssl_options.key_store);
                    setKeyFile(config.brokers[0].connect_options.ssl_options.private_key);
                    setClientId(config.brokers[0].client_name);
                    setPublishTopic(config.brokers[0].publish_data[0].topics);
                    setSubscribeTopic(config.brokers[0].subscribe_data[0].topic);
                    setDataServerPort(config.data_server.port);
                    setWebServerPort(config.web_server.port);
                }
            } catch (e) {
                console.log(e)
            }
        };
        fetchConfig();
    }, );


    const fetchStatus = async () => {
        const res = await fetch(
            appStatusUrl
        );
        try {
            return await res.json();
        } catch (e) {
            return e
        }
    };

    useInterval(() => {
        fetchStatus().then((appStatus) => {
            setAppStatus(appStatus)
        }).catch((e) => {
            setAppStatus({});
            console.log(e)
        })

    }, 1000);


    const handleSubmit = (evt) => {
        evt.preventDefault();

        const formData = new FormData();
        formData.append(`brokers_0_host`, brokerAddress);
        formData.append(`brokers_0_client_name`, clientId);
        formData.append(`brokers_0_connect_options_ssl_options_trust_store`, rootCaFle);
        formData.append(`brokers_0_connect_options_ssl_options_key_store`, certFile);
        formData.append(`brokers_0_connect_options_ssl_options_private_key`, keyFile);
        formData.append(`brokers_0_publish_data_0_topics_0`, publishTopic);
        formData.append(`brokers_0_subscribe_data_0_topic`, subscribeTopic);
        formData.append(`data_server_port`, dataServerPort);
        formData.append(`web_server_port`, webServerPort);

        fetch(appConfigUrl, {
            method: 'POST',
            body: formData
        })
            .then((res) => {
                return res.json()
            })
    };

    const statusAndMessage = (appStatus, componentName) => {
        const status = (appStatus[componentName] && appStatus[componentName].status)
            ? appStatus[componentName].status
            : StatusEnum.ERROR;

        const message = (appStatus[componentName] && appStatus[componentName].message)
            ? appStatus[componentName].message
            : `Unknown`;

        return {status, message}
    };

    return (
        <div className="cf pxc-grid-4">
            <h1>
                <span>Configuration</span>
            </h1>
            <div className="pxc-plt-ctrl">
                <div className="pxc-p-plain">
                    <div className="pxc-f-gradbox">
                        <form onSubmit={handleSubmit}>
                            <TextInput
                                label={`Broker address`}
                                placeholder={``}
                                maxLength={63}
                                name={`broker_address`}
                                {...bindBrokerAddress}
                            />
                            <Status
                                label={`Status`}
                                {...statusAndMessage(appStatus, `mqttClient`)}
                            />
                            <FileInput
                                label={`Root CA`}
                                name={`root_ca_file`}
                                uploadUrl={`${getDeviceHostAddress()}/upload`}
                                setTextInput={setRootCaFile}
                                {...bindRootCaFile}
                            />
                            <FileInput
                                label={`Certificate`}
                                name={`cert_file`}
                                uploadUrl={`${getDeviceHostAddress()}/upload`}
                                setTextInput={setCertFile}
                                {...bindCertFile}
                            />
                            <FileInput
                                label={`Private key`}
                                name={`key_file`}
                                uploadUrl={`${getDeviceHostAddress()}/upload`}
                                setTextInput={setKeyFile}
                                {...bindKeyFile}
                            />

                            <TextInput
                                label={`Cliend id`}
                                placeholder={``}
                                maxLength={63}
                                name={`client_id`}
                                {...bindClientId}
                            />
                            <TextInput
                                label={`Publish to topic`}
                                placeholder={``}
                                maxLength={63}
                                name={`publish_topic`}
                                {...bindPublishTopic}
                            />
                            <TextInput
                                label={`Subscribe to topic`}
                                placeholder={``}
                                maxLength={63}
                                name={`subscribe_topic`}
                                {...bindSubscribeTopic}
                            />
                            <TextInput
                                label={`Data server port`}
                                placeholder={``}
                                maxLength={63}
                                name={`data_server_port`}
                                {...bindDataServerPort}
                            />
                            <Status
                                label={`Status`}
                                {...statusAndMessage(appStatus, `dataServer`)}
                            />
                            <TextInput
                                label={`Web server port`}
                                placeholder={``}
                                maxLength={63}
                                name={`web_server_port`}
                                {...bindWebServerPort}
                            />
                            <Status
                                label={`Status`}
                                {...statusAndMessage(appStatus, `webServer`)}
                            />

                            <div className="form_group">
                                <Label
                                    label={`Save configuration`}
                                />
                                <button
                                    type="submit"
                                    className="pxc-btn-pa"
                                >
                                    <span>Save</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Configuration
