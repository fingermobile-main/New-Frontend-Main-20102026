const db = require('./db');

module.exports = {
  ...db,
  // Add a general query helper if needed by older routes,
  query: (text, params) => db.identityDb.query(text, params)
};
