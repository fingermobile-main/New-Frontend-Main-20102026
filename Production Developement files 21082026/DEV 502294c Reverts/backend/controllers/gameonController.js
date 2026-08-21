const { contentDb } = require("../db");

class GameonController {
    async getAll(req, res) {
        try {
            res.json({ success: true, data: [] });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Server error' });
        }
    }

    async getById(req, res) {
        try {
            res.json({ success: true, data: {} });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Server error' });
        }
    }

    async create(req, res) {
        try {
            res.status(201).json({ success: true, data: {} });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Server error' });
        }
    }

    async delete(req, res) {
        try {
            res.json({ success: true, message: 'Deleted successfully' });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Server error' });
        }
    }
}

module.exports = new GameonController();
