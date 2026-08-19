const NodeCache = require("node-cache");
const cache = new NodeCache({stdTTL: 600 }); // Cache for 10 minutes (600 seconds)

const cacheMiddleware = (req, res, next) => {
  const key = req.originalUrl;

  if (cache.has(key)) {
    console.log(`Cache hit for ${key}`);
    return res.send(cache.get(key));
  }

  console.log(`Cache miss for ${key}`);
  res.sendResponse = res.send;
  res.send = (body) => {
    cache.set(key, body);
    res.sendResponse(body);
  };
  next();
};

module.exports = cacheMiddleware;
