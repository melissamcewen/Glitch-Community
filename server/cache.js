const { Cache } = require('memory-cache');
const { captureException } = require('@sentry/node');

const getOrFallback = async (label, fallback, func, ...args) => {
  try {
    return await func(...args);
  } catch (error) {
    console.warn(`Failed to ${label}: ${error.toString()}`);
    captureException(error);
    return fallback;
  }
};

module.exports = (timeout, verb, fallback = null) => {
  const cache = new Cache();

  const getFromCache = async (key, func, ...args) => {
    let promise = cache.get(key);
    if (!promise) {
      promise = getOrFallback(`${verb} ${key}`, fallback, func, ...args);
      cache.put(key, promise, timeout);
    }
    return promise;
  };

  const clearCache = () => cache.clear();

  return [getFromCache, clearCache];
};
