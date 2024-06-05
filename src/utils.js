const _ = require('lodash');

function mergeData(data, schemas) {
  const result = {};

  // Process each schema
  for (const [key, schema] of Object.entries(schemas)) {
    result[key] = data[key].map((item) => {
      const mergedItem = { ...item };

      for (const [field, transform] of Object.entries(schema)) {
        if (typeof transform === 'string') {
          mergedItem[field] = _.get(item, transform);
        } else if (typeof transform === 'function') {
          mergedItem[field] = transform(item, data);
        }
      }

      return mergedItem;
    });
  }
  return result;
}

module.exports={mergeData}