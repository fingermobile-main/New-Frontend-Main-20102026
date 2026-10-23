import { Request, Response } from 'express';
import User from '../models/UserModel';
import { Op } from 'sequelize';
import { getSequelize } from '../utils/modelInitializer';
import { UserActivityService } from '../services/UserActivityService';

class UserManagementController {
  /**
   * GET /api/admin/users
   * Retrieve all users with pagination and filtering
   */
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;
      const search = req.query.search as string;
      const role = req.query.role as string;
      const status = req.query.status as string;

      const whereClause: any = {};
      
      if (search) {
        whereClause[Op.or] = [
          { email: { [Op.iLike]: `%${search}%` } },
          { username: { [Op.iLike]: `%${search}%` } },
          { firstName: { [Op.iLike]: `%${search}%` } },
          { lastName: { [Op.iLike]: `%${search}%` } }
        ];
      }
      
      if (role) {
        whereClause.role = role;
      }
      
      if (status) {
        whereClause.status = status;
      }

      const { count, rows } = await User.findAndCountAll({
        where: whereClause,
        attributes: [
          'id', 'uuid', 'email', 'firstName', 'lastName', 'username', 'phone',
          'role', 'status', 'lastLoginAt', 'emailVerified', 'createdAt', 'updatedAt',
          'fiatBalance', 'cryptoBalance', 'aiCredits', 'cesScore', 'strikes'
        ],
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      });

      // Log the activity
      await UserActivityService.logActivity(
        req.user?.id || 0, 
        'view_users', 
        { action: 'getAllUsers', page, limit, search, role, status }, 
        req
      );

      res.json({
        success: true,
        message: 'Users retrieved successfully',
        data: {
          users: rows,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalUsers: count,
            hasNext: page < Math.ceil(count / limit),
            hasPrev: page > 1
          }
        }
      });
    } catch (error) {
      console.error('Error retrieving users:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve users',
        error: (error as Error).message
      });
    }
  }

  /**
   * GET /api/admin/users/:id
   * Retrieve a specific user by ID
   */
  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      
      const user = await User.findByPk(id, {
        attributes: [
          'id', 'uuid', 'email', 'firstName', 'lastName', 'username', 'phone',
          'role', 'status', 'lastLoginAt', 'emailVerified', 'createdAt', 'updatedAt',
          'fiatBalance', 'cryptoBalance', 'aiCredits', 'cesScore', 'strikes'
        ]
      });

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      // Log the activity
      await UserActivityService.logActivity(
        req.user?.id || 0, 
        'view_user', 
        { action: 'getUserById', targetUserId: id }, 
        req
      );

      res.json({
        success: true,
        message: 'User retrieved successfully',
        data: user
      });
    } catch (error) {
      console.error('Error retrieving user:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve user',
        error: (error as Error).message
      });
    }
  }

  /**
   * POST /api/admin/users
   * Create a new user
   */
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const {
        email, password, firstName, lastName, username, phone,
        role = 'user', status = 'active'
      } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [
            { email },
            { username }
          ]
        }
      });

      if (existingUser) {
        res.status(409).json({
          success: false,
          message: 'User with this email or username already exists'
        });
        return;
      }

      const newUser = await User.create({
        email,
        password,
        firstName,
        lastName,
        username,
        phone,
        role,
        status
      });

      // Log the activity
      await UserActivityService.logActivity(
        req.user?.id || 0, 
        'create_user', 
        { action: 'createUser', targetUserId: newUser.id, userData: { email, role, status } }, 
        req
      );

      // Remove password from response
      const { password: _, ...userWithoutPassword } = newUser.toJSON() as any;

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: userWithoutPassword
      });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create user',
        error: (error as Error).message
      });
    }
  }

  /**
   * PUT /api/admin/users/:id
   * Update a user by ID
   */
  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const {
        email, firstName, lastName, username, phone, role, status,
        fiatBalance, cryptoBalance, aiCredits, cesScore, strikes
      } = req.body;

      const user = await User.findByPk(id);
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      // Store old values for activity log
      const oldValues = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        phone: user.phone,
        role: user.role,
        status: user.status,
        fiatBalance: user.fiatBalance,
        cryptoBalance: user.cryptoBalance,
        aiCredits: user.aiCredits,
        cesScore: user.cesScore,
        strikes: user.strikes
      };

      // Check if email or username is taken by another user
      if (email && email !== user.email) {
        const existingUser = await User.findOne({
          where: { email, id: { [Op.ne]: id } }
        });
        if (existingUser) {
          res.status(409).json({
            success: false,
            message: 'Email already taken by another user'
          });
          return;
        }
      }

      if (username && username !== user.username) {
        const existingUser = await User.findOne({
          where: { username, id: { [Op.ne]: id } }
        });
        if (existingUser) {
          res.status(409).json({
            success: false,
            message: 'Username already taken by another user'
          });
          return;
        }
      }

      await user.update({
        email: email || user.email,
        firstName: firstName !== undefined ? firstName : user.firstName,
        lastName: lastName !== undefined ? lastName : user.lastName,
        username: username !== undefined ? username : user.username,
        phone: phone !== undefined ? phone : user.phone,
        role: role || user.role,
        status: status || user.status,
        fiatBalance: fiatBalance !== undefined ? fiatBalance : user.fiatBalance,
        cryptoBalance: cryptoBalance !== undefined ? cryptoBalance : user.cryptoBalance,
        aiCredits: aiCredits !== undefined ? aiCredits : user.aiCredits,
        cesScore: cesScore !== undefined ? cesScore : user.cesScore,
        strikes: strikes !== undefined ? strikes : user.strikes
      });

      // Log the activity
      await UserActivityService.logActivity(
        req.user?.id || 0, 
        'update_user', 
        { 
          action: 'updateUser', 
          targetUserId: id, 
          oldValues, 
          newValues: req.body 
        }, 
        req
      );

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user.toJSON() as any;

      res.json({
        success: true,
        message: 'User updated successfully',
        data: userWithoutPassword
      });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update user',
        error: (error as Error).message
      });
    }
  }

  /**
   * DELETE /api/admin/users/:id
   * Delete a user by ID (soft delete)
   */
  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);

      const user = await User.findByPk(id);
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      // Log the activity
      await UserActivityService.logActivity(
        req.user?.id || 0, 
        'delete_user', 
        { action: 'deleteUser', targetUserId: id, userData: user.toJSON() }, 
        req
      );

      // Soft delete by updating status to 'deleted'
      await user.update({ status: 'deleted' });

      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete user',
        error: (error as Error).message
      });
    }
  }

  /**
   * POST /api/admin/users/:id/roles
   * Assign or update user roles
   */
  async assignRole(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const { role } = req.body;

      if (!role) {
        res.status(400).json({
          success: false,
          message: 'Role is required'
        });
        return;
      }

      const user = await User.findByPk(id);
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      const oldRole = user.role;
      await user.update({ role });

      // Log the activity
      await UserActivityService.logActivity(
        req.user?.id || 0, 
        'update_user_role', 
        { action: 'assignRole', targetUserId: id, oldRole, newRole: role }, 
        req
      );

      res.json({
        success: true,
        message: 'Role assigned successfully',
        data: { userId: id, role }
      });
    } catch (error) {
      console.error('Error assigning role:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to assign role',
        error: (error as Error).message
      });
    }
  }

  /**
   * GET /api/admin/users/:id/activity
   * Get user activity logs
   */
  async getUserActivity(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      
      // Log the activity
      await UserActivityService.logActivity(
        req.user?.id || 0, 
        'view_user_activity', 
        { action: 'getUserActivity', targetUserId: id }, 
        req
      );

      const activities = await UserActivityService.getUserActivities(id, 50);
      
      res.json({
        success: true,
        message: 'User activity retrieved successfully',
        data: {
          userId: id,
          activities
        }
      });
    } catch (error) {
      console.error('Error retrieving user activity:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve user activity',
        error: (error as Error).message
      });
    }
  }

  /**
   * POST /api/admin/users/:id/reset-password
   * Reset user password
   */
  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const { newPassword } = req.body;

      if (!newPassword) {
        res.status(400).json({
          success: false,
          message: 'New password is required'
        });
        return;
      }

      const user = await User.findByPk(id);
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      // Hash the new password before saving
      const bcrypt = await import('bcryptjs');
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      await user.update({ password: hashedPassword });

      // Log the activity
      await UserActivityService.logActivity(
        req.user?.id || 0, 
        'reset_user_password', 
        { action: 'resetPassword', targetUserId: id }, 
        req
      );

      res.json({
        success: true,
        message: 'Password reset successfully'
      });
    } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to reset password',
        error: (error as Error).message
      });
    }
  }
}

export default new UserManagementController();