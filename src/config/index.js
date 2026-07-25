'use strict';

const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const Joi = require('joi');

const schema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  PORT: Joi.number().integer().positive().default(3000),

  // Database
  DB_CLIENT: Joi.string().default('pg'),
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().integer().positive().default(5432),
  DB_NAME: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_POOL_MIN: Joi.number().integer().min(0).default(2),
  DB_POOL_MAX: Joi.number().integer().positive().default(10),

  // Elasticsearch
  ELASTICSEARCH_NODE: Joi.string().uri().default('http://localhost:9200'),
  ELASTICSEARCH_USERNAME: Joi.string().default(''),
  ELASTICSEARCH_PASSWORD: Joi.string().default(''),

  // JWT
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_ACCESS_TTL: Joi.string().default('15m'),
  JWT_RESET_TTL: Joi.string().default('1h'),

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: Joi.number().integer().positive().default(60000),
  RATE_LIMIT_MAX: Joi.number().integer().positive().default(100),
}).unknown(true);

const { error, value: envVars } = schema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,

  db: {
    client: envVars.DB_CLIENT,
    host: envVars.DB_HOST,
    port: envVars.DB_PORT,
    name: envVars.DB_NAME,
    user: envVars.DB_USER,
    password: envVars.DB_PASSWORD,
    pool: {
      min: envVars.DB_POOL_MIN,
      max: envVars.DB_POOL_MAX,
    },
  },

  elasticsearch: {
    node: envVars.ELASTICSEARCH_NODE,
    username: envVars.ELASTICSEARCH_USERNAME,
    password: envVars.ELASTICSEARCH_PASSWORD,
  },

  jwt: {
    secret: envVars.JWT_SECRET,
    accessTTL: envVars.JWT_ACCESS_TTL,
    resetTTL: envVars.JWT_RESET_TTL,
  },

  rateLimit: {
    windowMs: envVars.RATE_LIMIT_WINDOW_MS,
    max: envVars.RATE_LIMIT_MAX,
  },
};

module.exports = config;
