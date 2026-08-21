import { Request, Response } from "express";
import logger from '../utils/logger';
import { validationResult } from "express-validator";
import { BlockMute } from "../models/BlockMuteModel";

class BlockMuteController {
  async blockUser(req: Request, res: Response) {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      if (!req.user) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const blockerId = req.user.id; // Assuming user info is attached to req by auth middleware
      const { blockedUserId, muteType, reason } = req.body;

      // Check if already blocked/muted
      const existingBlock = await BlockMute.findOne({
        where: {
          blockerId,
          blockedUserId
        }
      });

      if (existingBlock) {
        return res.status(409).json({ error: "User is already blocked/muted" });
      }

      // Create block/mute record
      const blockRecord = await BlockMute.create({
        blockerId,
        blockedUserId,
        muteType,
        reason
      });

      return res.status(201).json(blockRecord);
    } catch (error) {
      logger.error("Error blocking user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async muteNotifications(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      if (!req.user) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const userIdParam = typeof req.params.userId === 'string' ? req.params.userId : req.params.userId[0];
      const blockerId = req.user.id;

      // Find or create a mute record
      const [muteRecord, created] = await BlockMute.findOrCreate({
        where: {
          blockerId,
          blockedUserId: userIdParam
        },
        defaults: {
          blockerId,
          blockedUserId: userIdParam,
          muteType: "notification",
          reason: "Muted notifications"
        }
      });

      if (!created) {
        // Update the mute type if record already existed
        await muteRecord.update({ muteType: "notification", reason: "Muted notifications" });
      }

      return res.status(200).json(muteRecord);
    } catch (error) {
      logger.error("Error muting notifications:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async muteUGC(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      if (!req.user) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const userIdParam = typeof req.params.userId === 'string' ? req.params.userId : req.params.userId[0];
      const blockerId = req.user.id;

      // Find or create a mute record
      const [muteRecord, created] = await BlockMute.findOrCreate({
        where: {
          blockerId,
          blockedUserId: userIdParam
        },
        defaults: {
          blockerId,
          blockedUserId: userIdParam,
          muteType: "ugc",
          reason: "Muted UGC"
        }
      });

      if (!created) {
        // Update the mute type if record already existed
        await muteRecord.update({ muteType: "ugc", reason: "Muted UGC" });
      }

      return res.status(200).json(muteRecord);
    } catch (error) {
      logger.error("Error muting UGC:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async muteAll(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      if (!req.user) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const userIdParam = typeof req.params.userId === 'string' ? req.params.userId : req.params.userId[0];
      const blockerId = req.user.id;

      // Find or create a mute record
      const [muteRecord, created] = await BlockMute.findOrCreate({
        where: {
          blockerId,
          blockedUserId: userIdParam
        },
        defaults: {
          blockerId,
          blockedUserId: userIdParam,
          muteType: "all",
          reason: "Muted all interactions"
        }
      });

      if (!created) {
        // Update the mute type if record already existed
        await muteRecord.update({ muteType: "all", reason: "Muted all interactions" });
      }

      return res.status(200).json(muteRecord);
    } catch (error) {
      logger.error("Error muting all:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  unblockUser = async (req: Request, res: Response) => {
    try {
      const { blockedUserId } = req.params;

      // Check if user is authenticated
      if (!req.user) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      // Find the block record
      const blockRecord = await BlockMute.findOne({
        where: {
          blockerId: req.user.id,
          blockedUserId
        }
      });

      if (!blockRecord) {
        res.status(404).json({ error: "Block record not found" });
        return;
      }

      // Delete the block record
      await blockRecord.destroy();

      res.status(200).json({
        message: "User unblocked successfully"
      });
    } catch (error) {
      logger.error("Error unblocking user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  muteUser = async (req: Request, res: Response) => {
    try {
      const { mutedUserId, muteReason, muteDuration } = req.body;
      const muterId = req.user?.id;

      // Validate input
      if (!mutedUserId || !muteReason || !muteDuration) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      // Check if user is authenticated
      if (!req.user) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      // Create the mute record
      const muteRecord = await BlockMute.create({
        blockerId: muterId!,
        blockedUserId: mutedUserId,
        muteType: 'all', // default to muting all
        reason: muteReason
      });

      res.status(201).json({
        message: "User muted successfully",
        muteRecord
      });
    } catch (error) {
      logger.error("Error muting user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  unmuteUser = async (req: Request, res: Response) => {
    try {
      const { mutedUserId } = req.params;

      // Check if user is authenticated
      if (!req.user) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      // Find the mute record
      const muteRecord = await BlockMute.findOne({
        where: {
          blockerId: req.user.id,
          blockedUserId: mutedUserId
        }
      });

      if (!muteRecord) {
        res.status(404).json({ error: "Mute record not found" });
        return;
      }

      // Delete the mute record
      await muteRecord.destroy();

      res.status(200).json({
        message: "User unmuted successfully"
      });
    } catch (error) {
      logger.error("Error unmuting user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  getBlockedUsers = async (req: Request, res: Response) => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      // Get all blocked users for the current user
      const blockedUsers = await BlockMute.findAll({
        where: {
          blockerId: req.user.id
        },
        attributes: ["blockedUserId", "reason", "createdAt"]
      });

      res.status(200).json({
        blockedUsers
      });
    } catch (error) {
      logger.error("Error fetching blocked users:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  // Method to match route expectations
  muteUgc = async (req: Request, res: Response) => {
    return this.muteUGC(req, res);
  };

  // Method to get both blocked and muted users
  getBlockedMutedUsers = async (req: Request, res: Response) => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      // Get all blocked users for the current user
      const blockedUsers = await BlockMute.findAll({
        where: {
          blockerId: req.user.id
        },
        attributes: ["blockedUserId", "createdAt"]
      });

      // Get all muted users for the current user
      const mutedUsers = await BlockMute.findAll({
        where: {
          blockerId: req.user.id
        },
        attributes: ["blockedUserId", "reason", "createdAt"]
      });

      res.status(200).json({
        blockedUsers,
        mutedUsers
      });
    } catch (error) {
      logger.error("Error fetching blocked and muted users:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  // Method to check block status of a specific user
  checkBlockStatus = async (req: Request, res: Response) => {
    try {
      const { targetUserId } = req.params;

      // Check if user is authenticated
      if (!req.user) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      // Find any block/mute record between the two users
      const blockMuteRecord = await BlockMute.findOne({
        where: {
          blockerId: req.user.id,
          blockedUserId: targetUserId
        }
      });

      if (!blockMuteRecord) {
        res.status(200).json({
          isBlocked: false,
          isMuted: false,
          muteType: null,
          reason: null
        });
        return;
      }

      res.status(200).json({
        isBlocked: true,
        isMuted: blockMuteRecord.muteType !== 'all', // Consider anything not 'all' as muted
        muteType: blockMuteRecord.muteType,
        reason: blockMuteRecord.reason
      });
    } catch (error) {
      logger.error("Error checking block status:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  getMutedUsers = async (req: Request, res: Response) => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      // Get all muted users for the current user
      const mutedUsers = await BlockMute.findAll({
        where: {
          blockerId: req.user.id
        },
        attributes: ["blockedUserId", "reason", "createdAt"]
      });

      res.status(200).json({
        mutedUsers
      });
    } catch (error) {
      logger.error("Error fetching muted users:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}

export default new BlockMuteController();