const { morphism } = require('morphism');
const { catalogMessage, orderMessage } = require('../schemas/base');
const { mergeData } = require('./utils');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const lodash = require('lodash');
const objectMapper = require('object-mapper');

// Directory where provider schemas are stored
const schemasDir = path.join(__dirname, '../schemas');
let searchResponseData = null; // Variable to store search response data

// Object to hold the dynamically imported schemas
const providerSchemas = {};

// Read all schema files in the directory and import them
fs.readdirSync(schemasDir).forEach(file => {
    if (file.endsWith('.schema.js')) {
        const schemaName = path.basename(file, '.schema.js');
        providerSchemas[schemaName] = require(path.join(schemasDir, file));
    }
});

// Generate providerUrls dynamically from the providerSchemas
const providerUrls = Object.entries(providerSchemas).map(([name, schema]) => ({
    name,
    urlConfig: schema.urlConfig
}));

// Function to fetch provider data from the API
const fetchProviders = async ({ name, urlConfig }) => {
    try {
        const providerResponse = urlConfig.data
            ? await axios.post(urlConfig.url, urlConfig.data, { headers: urlConfig.headers })
            : await axios.get(urlConfig.url, { headers: urlConfig.headers });

        let fullData = providerResponse.data;
        fullData.name = name; // Add the provider name to the data for identification

        const providerSchema = providerSchemas[name];
        if (providerSchema?.transformSchema && providerSchema.transformPath) {
            const path = providerSchema.transformPath;
            if (fullData[path]) {
                fullData[path] = mergeData(fullData[path], providerSchema.transformSchema);
            } else {
                console.warn(`Path ${path} not found in provider data`);
            }
        }
        return fullData;
    } catch (error) {
        console.error(`Error fetching provider information from ${urlConfig.url}:`, error.message);
        return { error: `Failed to fetch data from provider: ${name}` }; // Handle error by returning an error object
    }
};

// Webhook function to handle the request
const webhook = async (req, res) => {
    const { context } = req.body;

    try {
        if (context?.action === 'search') {
            context.action = 'on_search';
            const results = await Promise.allSettled(providerUrls.map(fetchProviders));
            const newObj = {
                context,
                message: catalogMessage.message
            };

            results.forEach(result => {
                if (result.status === 'fulfilled' && !result.value.error) {
                    const data = result.value;
                    const schema = providerSchemas[data.name];

                    if (schema) {
                        const itemArray = lodash.get(data, schema.responsePath).map(item =>
                            objectMapper(item, schema.itemSchema)
                        );
                        const providerData = { ...schema.providerSchema, items: itemArray };
                        newObj.message.catalog.providers.push(providerData);
                    } else {
                        console.error(`No schema found for provider name: ${data.name}`);
                    }
                } else if (result.status === 'rejected') {
                    console.error(`Error fetching provider information: ${result.reason}`);
                } else {
                    console.error(`Provider data error: ${result.value.error}`);
                }
            });

            searchResponseData = newObj.message.catalog.providers;
            res.status(200).send(newObj);
        } else if (context?.action === 'select') {
            context.action = 'on_select';
            if (searchResponseData) {
                const providerResult = lodash.find(searchResponseData, item => item.id.toLowerCase() === req.body.message.order.provider.id.toLowerCase());
                if (providerResult) {
                    const schema = providerSchemas[providerResult.id.toLowerCase()];
                    const newObj = {
                        context,
                        message: orderMessage.message
                    };

                    if (schema) {
                        const itemArray = lodash.filter(providerResult.items, item => item.id == req.body.message.order.items[0].id);
                        const providerData = { ...schema.providerSchema, items: itemArray };

                        newObj.message.order.provider = providerData;
                        res.status(200).send(newObj);
                    } else {
                        console.error(`No schema found for provider name: ${providerResult.id}`);
                        res.status(500).send({ error: 'Internal server error' });
                    }
                } else {
                    res.status(404).send({ error: 'Provider not found' });
                }
            } else {
                res.status(400).send({ error: 'No search data available' });
            }
        } else {
            res.status(400).send({ error: 'Invalid action' });
        }
    } catch (error) {
        console.error("Webhook error:", error);
        res.status(500).send({ error: 'Internal server error' });
    }
};

module.exports = { webhook };
