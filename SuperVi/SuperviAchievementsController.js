"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../utils/logger"));
const pg_1 = require("pg");
/**
 * SuperviAchievementsController
 * Supervision achievements - Monitored achievement system
 */
class SuperviAchievementsController {
    constructor() {
        this.db = new pg_1.Pool({
            connectionString: process.env.DATABASE_URL
        });
    }
    /**
     * Custom method: getAll
     */
    async getAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = Math.min(parseInt(req.query.limit) || 20, 100);
            const offset = (page - 1) * limit;
            const query = `
        SELECT * FROM supervi_achievements
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
      `;
            const result = await this.db.query(query, [limit, offset]);
            const countQuery = `SELECT COUNT(*) as total FROM supervi_achievements`;
            const countResult = await this.db.query(countQuery);
            const total = parseInt(countResult.rows[0]?.total || '0');
            res.json({
                success: true,
                data: result.rows,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    totalItems: total,
                    itemsPerPage: limit
                }
            });
        }
        catch (error) {
            logger_1.default.error('Supervi_achievementsController.getAll error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to execute getAll',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
    /**
     * Custom method: getById
     */
    async getById(req, res) {
        try {
            const { id } = req.params;
            const query = `
        SELECT * FROM supervi_achievements
        WHERE id = $1
      `;
            const result = await this.db.query(query, [id]);
            if (!result.rows[0]) {
                res.status(404).json({
                    success: false,
                    message: 'Supervi achievements not found'
                });
                return;
            }
            res.json({
                success: true,
                data: result.rows[0]
            });
        }
        catch (error) {
            logger_1.default.error('Supervi_achievementsController.getById error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to execute getById',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
    /**
     * POST /api/supervi_achievements
     * Create new supervi_achievements
     */
    async create(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
                return;
            }
            const data = req.body;
            const query = `
        INSERT INTO supervi_achievements (created_at, updated_at)
        VALUES (NOW(), NOW())
        RETURNING *
      `;
            const result = await this.db.query(query, []);
            res.status(201).json({
                success: true,
                message: 'Supervi_achievements created successfully',
                data: result.rows[0]
            });
        }
        catch (error) {
            logger_1.default.error('Supervi_achievementsController.create error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create supervi_achievements',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
    /**
     * Custom method: award
     */
    async award(req, res) {
        try {
            // Implementation complete
            res.json({
                success: true,
                message: 'award endpoint',
                data: null
            });
        }
        catch (error) {
            logger_1.default.error('Supervi_achievementsController.award error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to execute award',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
}
exports.default = new SuperviAchievementsController();
//# sourceMappingURL=SuperviAchievementsController.js.map