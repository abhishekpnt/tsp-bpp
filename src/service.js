const { morphism } = require('morphism');
const { message } = require('../schemas/base');
const { mergeData } = require('./utils');
const fs = require('fs');
const path = require('path');
const async = require('async');
const axios = require('axios');
const lodash = require('lodash');

// Directory where provider schemas are stored
const schemasDir = path.join(__dirname, '../schemas');

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
// Assuming each schema file exports an object with a urlPath field
const providerUrls = Object.entries(providerSchemas).map(([name, schema]) => ({
    name,
    url: schema.urlPath
}));

// Function to fetch provider data from the API
const fetchProviders = async ({ name, url }) => {
    try {
        const providerResponse = await axios.get(url);
        let fullData = providerResponse.data;
        fullData.name = name; // Add the provider name to the data for identification
        const providerSchema = providerSchemas[name];
        if (providerSchema && providerSchema.transformSchema && providerSchema.transformPath) {
            const path = providerSchema.transformPath;
            if (fullData[path]) {
                fullData.response = mergeData(fullData[path], providerSchema.transformSchema);
            } else {
                console.warn(`Path ${path} not found in provider data`);
            }
        }
        return fullData;
    } catch (error) {
        console.error(`Error fetching provider information from ${url}:`, error.message);
        throw new Error(`Failed to fetch data from provider: ${name}`);
    }
};

// Webhook function to handle the request
const webhook = async (req, res) => {
    console.log('providerUrls', providerUrls);
    const { context } = req.body;

    try {
        if (context.action === 'search') {
            // Make parallel API calls to fetch provider information
            async.map(providerUrls, fetchProviders, (err, dataArray) => {
                if (err) {
                    console.error("Error fetching provider information:", err);
                    return res.status(500).send({ error: 'Failed to fetch provider information' });
                }

                // Flatten the array of provider responses
                const allData = [].concat(...dataArray);

                // Initialize the new object structure
                let newObj = { context, message };
                newObj.message.catalog.providers = [];

                // Process each provider's data
                allData.forEach(data => {
                    const schema = providerSchemas[data.name]; // Assuming provider name matches schema name

                    if (schema) {
                        // Extract items from the response using the responsePath defined in the schema
                        const itemArray = lodash.get(data, schema.responsePath).map(item =>
                            morphism(schema.itemSchema, item)
                        );

                        // Create a provider data object and add the transformed items
                        const providerData = { ...schema.providerSchema, items: itemArray };
                        newObj.message.catalog.providers.push(providerData);
                    } else {
                        console.error(`No schema found for provider name: ${data.name}`);
                    }
                });

                // Send the response
                res.status(200).send(newObj);
            });
        } else if (context.action === 'order') {
            // Handle order action
            // (Implementation would go here)
        } else {
            res.status(400).send({ error: 'Invalid action' });
        }
    } catch (error) {
        console.error("Webhook error:", error);
        res.status(500).send({ error: 'Internal server error' });
    }
};

module.exports = { webhook };
