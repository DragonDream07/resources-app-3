'use strict';

const config = require('./index');

const elasticsearchConfig = {
  node: config.elasticsearch.node,
  ...(config.elasticsearch.username && config.elasticsearch.password
    ? {
        auth: {
          username: config.elasticsearch.username,
          password: config.elasticsearch.password,
        },
      }
    : {}),
};

module.exports = elasticsearchConfig;
