const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const sequelize = require('./config/database');
const Event = require('./models/Event');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.post('/api/analytics/events', async (req, res) => {
  try {
    const { eventType, userId, payload } = req.body;
    const event = await Event.create({ eventType, userId, payload });
    res.status(201).json({ success: true, eventId: event.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/analytics/events', async (req, res) => {
  try {
    const events = await Event.findAll();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'web-analytics-service' });
});

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true }).then(() => {
  console.log('Database synced successfully');
  app.listen(PORT, () => {
    console.log(`Web Analytics Service is running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Unable to connect to the database:', err);
});

module.exports = app;
