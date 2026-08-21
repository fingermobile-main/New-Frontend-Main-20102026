const app = require('./app');
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  logger.info(`✅ Backend server running on port ${PORT}`);
  logger.info(`✅ Health,
check:,
http://,
localhost:${PORT}/health`);
});
