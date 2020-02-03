const validateConfig = (body) => {
    const requiredFields = [
        `brokers_0_host`,
        `brokers_0_client_name`,
        `brokers_0_connect_options_ssl_options_trust_store`,
        `brokers_0_connect_options_ssl_options_key_store`,
        `brokers_0_connect_options_ssl_options_private_key`,
        `brokers_0_publish_data_0_topics_0`,
        `brokers_0_subscribe_data_0_topic`,
        `data_server_port`,
        `web_server_port`
    ];

    requiredFields.forEach((field) => {
        if (!body[field]) {
            throw new Error(`Form validation Error: ${field} required`)
        }
    });

    const config = {
        brokers: [
            {
                host: body.brokers_0_host,
                client_name: body.brokers_0_client_name,
                connect_options: {
                    ssl_options: {
                        trust_store: body.brokers_0_connect_options_ssl_options_trust_store,
                        key_store: body.brokers_0_connect_options_ssl_options_key_store,
                        private_key: body.brokers_0_connect_options_ssl_options_private_key
                    }
                },
                publish_data: [
                    {
                        topics: [
                            body.brokers_0_publish_data_0_topics_0
                        ]
                    }
                ],
                subscribe_data: [
                    {
                        topic: body.brokers_0_subscribe_data_0_topic
                    }
                ]
            }
        ],
        data_server: {
            port: body.data_server_port
        },
        web_server: {
            port: body.web_server_port
        }
    };

    return config
};

module.exports = {
    validateConfig
};
