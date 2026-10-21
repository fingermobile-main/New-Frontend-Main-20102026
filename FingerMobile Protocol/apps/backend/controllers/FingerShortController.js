const FingerShort = require('../models/FingerShort');

const getAllShorts = async (req, res) => {
  try {
    const shorts = await FingerShort.findAll({ order: [['createdAt', 'DESC']] });
    res.json(shorts);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

const createShort = async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnailUrl, authorId } = req.body;
    const short = await FingerShort.create({ title, description, videoUrl, thumbnailUrl, authorId });
    res.status(201).json(short);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

const getShortById = async (req, res) => {
  try {
    const short = await FingerShort.findByPk(req.params.id);
    if (!short) {
      return res.status(404).json({ message: 'FingerShort not found' });
    }
    res.json(short);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

const updateShort = async (req, res) => {
  try {
    const short = await FingerShort.findByPk(req.params.id);
    if (!short) {
      return res.status(404).json({ message: 'FingerShort not found' });
    }
    await short.update(req.body);
    res.json(short);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

const deleteShort = async (req, res) => {
  try {
    const short = await FingerShort.findByPk(req.params.id);
    if (!short) {
      return res.status(404).json({ message: 'FingerShort not found' });
    }
    await short.destroy();
    res.json({ message: 'FingerShort deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getAllShorts,
  createShort,
  getShortById,
  updateShort,
  deleteShort
};
