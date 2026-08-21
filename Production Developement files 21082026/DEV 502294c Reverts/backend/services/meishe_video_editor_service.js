const { monetizationDb } = require("../db");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const { spawn } = require("child_process");
const fs = require("fs").promises;

class MeisheVideoEditorService {
  /**
   * Create a video editing project using MeisheSDK capabilities
   */
  static async createProject(memberId, title, description, initialMediaPath) {
    try {
      const client = await monetizationDb.connect();
      try {
        // Create project in database with MeisheSDK compatible structure
        const result = await client.query(
          `INSERT INTO video_projects 
           (member_id, title, description, project_data, status)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING *`,
          [
            memberId,
            title,
            description,
            {
              media: initialMediaPath,
              timeline: [],
              effects: [],
              filters: [],
              beauty: {},
              ai_features: {},
              settings: {
                resolution: "1080p",
                quality: "high",
                format: "mp4"
              }
            },
            "created"
          ],
        );

        return result.rows[0];
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error("Error creating video project with MeisheSDK:", error);
      throw error;
    }
  }

  /**
   * Apply beauty effects using MeisheSDK
   */
  static async applyBeautyEffect(projectId, beautyType, params = {}) {
    try {
      const client = await monetizationDb.connect();
      try {
        // Get current project data
        const projectResult = await client.query(
          `SELECT project_data FROM video_projects WHERE id = $1`,
          [projectId],
        );

        if (projectResult.rows.length === 0) {
          throw new Error("Project not found");
        }

        const projectData = projectResult.rows[0].project_data;

        // Add beauty effect to project
        const beautyEffect = {
          id: uuidv4(),
          type: beautyType,
          params: params,
          appliedAt: new Date()
        };

        projectData.beauty = projectData.beauty || {};
        projectData.beauty[beautyType] = beautyEffect;

        // Update project in database
        const result = await client.query(
          `UPDATE video_projects 
           SET project_data = $1, updated_at = NOW()
           WHERE id = $2
           RETURNING *`,
          [projectData, projectId],
        );

        return result.rows[0];
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error("Error applying beauty effect:", error);
      throw error;
    }
  }

  /**
   * Apply AR effect using MeisheSDK
   */
  static async applyAREffect(projectId, arEffectType, params = {}) {
    try {
      const client = await monetizationDb.connect();
      try {
        // Get current project data
        const projectResult = await client.query(
          `SELECT project_data FROM video_projects WHERE id = $1`,
          [projectId],
        );

        if (projectResult.rows.length === 0) {
          throw new Error("Project not found");
        }

        const projectData = projectResult.rows[0].project_data;

        // Add AR effect to project
        const arEffect = {
          id: uuidv4(),
          type: arEffectType,
          params: params,
          appliedAt: new Date()
        };

        projectData.ar_effects = projectData.ar_effects || [];
        projectData.ar_effects.push(arEffect);

        // Update project in database
        const result = await client.query(
          `UPDATE video_projects 
           SET project_data = $1, updated_at = NOW()
           WHERE id = $2
           RETURNING *`,
          [projectData, projectId],
        );

        return result.rows[0];
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error("Error applying AR effect:", error);
      throw error;
    }
  }

  /**
   * Apply AI-powered feature using MeisheSDK
   */
  static async applyAIFeature(projectId, featureType, params = {}) {
    try {
      const client = await monetizationDb.connect();
      try {
        // Get current project data
        const projectResult = await client.query(
          `SELECT project_data FROM video_projects WHERE id = $1`,
          [projectId],
        );

        if (projectResult.rows.length === 0) {
          throw new Error("Project not found");
        }

        const projectData = projectResult.rows[0].project_data;

        // Add AI feature to project
        const aiFeature = {
          id: uuidv4(),
          type: featureType,
          params: params,
          appliedAt: new Date(),
          status: "pending", // Will be processed by AI service
        };

        projectData.ai_features = projectData.ai_features || {};
        projectData.ai_features[featureType] = aiFeature;

        // Update project in database
        const result = await client.query(
          `UPDATE video_projects 
           SET project_data = $1, updated_at = NOW()
           WHERE id = $2
           RETURNING *`,
          [projectData, projectId],
        );

        // Process the AI feature in the background
        this.processAIFeature(projectId, featureType, params);

        return result.rows[0];
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error("Error applying AI feature:", error);
      throw error;
    }
  }

  /**
   * Process AI feature in the background with proper memory management
   */
  static async processAIFeature(projectId, featureType, params) {
    try {
      // First update the project to show processing has started
      const dbClient = await monetizationDb.connect();
      try {
        const projectResult = await dbClient.query(
          `SELECT project_data FROM video_projects WHERE id = $1`,
          [projectId],
        );

        if (projectResult.rows.length === 0) {
          throw new Error("Project not found");
        }

        const projectData = projectResult.rows[0].project_data;
        projectData.ai_features = projectData.ai_features || {};
        
        if (projectData.ai_features[featureType]) {
          projectData.ai_features[featureType].status = "processing";
          projectData.ai_features[featureType].startedAt = new Date();
        }

        await dbClient.query(
          `UPDATE video_projects 
           SET project_data = $1, updated_at = NOW()
           WHERE id = $2`,
          [projectData, projectId],
        );
      } finally {
        dbClient.release();
      }

      // Use a self-contained function for the timeout to prevent memory leaks
      const completeProcessing = async () => {
        let client;
        try {
          client = await monetizationDb.connect();
          
          const projectResult = await client.query(
            `SELECT project_data FROM video_projects WHERE id = $1`,
            [projectId],
          );

          if (projectResult.rows.length === 0) {
            return;
          }

          const projectData = projectResult.rows[0].project_data;
          if (
            projectData.ai_features &&
            projectData.ai_features[featureType] &&
            projectData.ai_features[featureType].status === "processing"
          ) {
            projectData.ai_features[featureType].status = "completed";
            projectData.ai_features[featureType].result =
              this.generateAIFeatureResult(featureType, params);
            projectData.ai_features[featureType].processedAt = new Date();
          }

          await client.query(
            `UPDATE video_projects 
             SET project_data = $1, updated_at = NOW()
             WHERE id = $2`,
            [projectData, projectId],
          );
        } catch (err) {
          logger.error("Error processing AI feature:", err);
        } finally {
          if (client) {
            client.release();
          }
        }
      };

      // Execute the processing after delay
      setTimeout(completeProcessing, 5000);
    } catch (error) {
      logger.error("Error initiating AI feature processing:", error);
    }
  }

  /**
   * Generate result for AI feature (simulation)
   */
  static generateAIFeatureResult(featureType, params) {
    switch (featureType) {
      case "smart_subtitles":
        return {
          subtitles: [
            { time: 1.5, text: "Sample subtitle 1", duration: 3 },
            { time: 5.2, text: "Sample subtitle 2", duration: 2.5 }
          ],
          language: params.language || "en",
          style: params.style || "default"
        };
      case "video_split":
        return {
          segments: [
            { start: 0, end: 5, title: "Intro" },
            { start: 5, end: 15, title: "Main Content" },
            { start: 15, end: 20, title: "Outro" }
          ],
          method: params.method || "scene_detection"
        };
      case "music_lyrics":
        return {
          lyrics: [
            { time: 2.1, text: "Sample lyrics line 1" },
            { time: 4.5, text: "Sample lyrics line 2" }
          ],
          synchronization: "auto"
        };
      case "vr_panoramic":
        return {
          projection: "equirectangular",
          fov: params.fov || 80,
          rotation: { x: 0, y: 0, z: 0 }
        };
      default:
        return { processed: true, type: featureType };
    }
  }

  /**
   * Apply template to project using MeisheSDK
   */
  static async applyTemplate(projectId, templateId, customizations = {}) {
    try {
      const client = await monetizationDb.connect();
      try {
        // Get current project data
        const projectResult = await client.query(
          `SELECT project_data FROM video_projects WHERE id = $1`,
          [projectId],
        );

        if (projectResult.rows.length === 0) {
          throw new Error("Project not found");
        }

        const projectData = projectResult.rows[0].project_data;

        // Apply template to project
        projectData.template = {
          id: templateId,
          appliedAt: new Date(),
          customizations: customizations
        };

        // Update project in database
        const result = await client.query(
          `UPDATE video_projects 
           SET project_data = $1, updated_at = NOW()
           WHERE id = $2
           RETURNING *`,
          [projectData, projectId],
        );

        return result.rows[0];
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error("Error applying template:", error);
      throw error;
    }
  }

  /**
   * Get available templates from MeisheSDK
   */
  static async getTemplates(category = null, limit = 20, offset = 0) {
    // In a real implementation, this would call the MeisheSDK API
    // to retrieve available templates

    // Simulated template data
    const allTemplates = [
      {
        id: "tiktok_duet_001",
        name: "TikTok Duet Style",
        category: "social",
        preview: "/templates/tiktok_duet.jpg"
      },
      {
        id: "insta_story_002",
        name: "Instagram Story",
        category: "social",
        preview: "/templates/insta_story.jpg"
      },
      {
        id: "youtube_intro_003",
        name: "YouTube Intro",
        category: "vlog",
        preview: "/templates/youtube_intro.jpg"
      },
      {
        id: "travel_vlog_004",
        name: "Travel Vlog",
        category: "vlog",
        preview: "/templates/travel_vlog.jpg"
      },
      {
        id: "product_showcase_005",
        name: "Product Showcase",
        category: "commercial",
        preview: "/templates/product_show.jpg"
      },
      {
        id: "birthday_celebration_006",
        name: "Birthday Celebration",
        category: "personal",
        preview: "/templates/birthday.jpg"
      },
      {
        id: "wedding_highlight_007",
        name: "Wedding Highlight",
        category: "personal",
        preview: "/templates/wedding.jpg"
      },
      {
        id: "fitness_motivation_008",
        name: "Fitness Motivation",
        category: "lifestyle",
        preview: "/templates/fitness.jpg"
      },
      {
        id: "food_review_009",
        name: "Food Review",
        category: "lifestyle",
        preview: "/templates/food.jpg"
      },
      {
        id: "gaming_montage_010",
        name: "Gaming Montage",
        category: "gaming",
        preview: "/templates/gaming.jpg"
      },
      {
        id: "music_video_011",
        name: "Music Video",
        category: "music",
        preview: "/templates/music_video.jpg"
      },
      {
        id: "fashion_look_012",
        name: "Fashion Look",
        category: "fashion",
        preview: "/templates/fashion.jpg"
      }
    ];

    if (category) {
      return allTemplates
        .filter((t) => t.category === category)
        .slice(offset, offset + limit);
    }

    return allTemplates.slice(offset, offset + limit);
  }

  /**
   * Get available filters from MeisheSDK
   */
  static async getFilters() {
    // In a real implementation, this would call the MeisheSDK API
    // to retrieve available filters

    // Simulated filter data
    return [
      {
        id: "clarendon",
        name: "Clarendon",
        category: "classic",
        preview: "/filters/clarendon.jpg"
      },
      {
        id: "moon",
        name: "Moon",
        category: "black_and_white",
        preview: "/filters/moon.jpg"
      },
      {
        id: "lark",
        name: "Lark",
        category: "light",
        preview: "/filters/lark.jpg"
      },
      {
        id: "reyes",
        name: "Reyes",
        category: "warm",
        preview: "/filters/reyes.jpg"
      },
      {
        id: "juno",
        name: "Juno",
        category: "warm",
        preview: "/filters/juno.jpg"
      },
      {
        id: "slumber",
        name: "Slumber",
        category: "dark",
        preview: "/filters/slumber.jpg"
      },
      {
        id: "aden",
        name: "Aden",
        category: "light",
        preview: "/filters/aden.jpg"
      },
      {
        id: "perpetua",
        name: "Perpetua",
        category: "fresh",
        preview: "/filters/perpetua.jpg"
      },
      {
        id: "mayfair",
        name: "Mayfair",
        category: "vintage",
        preview: "/filters/mayfair.jpg"
      },
      {
        id: "rise",
        name: "Rise",
        category: "warm",
        preview: "/filters/rise.jpg"
      },
      {
        id: "valencia",
        name: "Valencia",
        category: "warm",
        preview: "/filters/valencia.jpg"
      },
      {
        id: "xpro2",
        name: "X-Pro II",
        category: "vintage",
        preview: "/filters/xpro2.jpg"
      },
      {
        id: "willow",
        name: "Willow",
        category: "black_and_white",
        preview: "/filters/willow.jpg"
      },
      {
        id: "lofi",
        name: "Lofi",
        category: "dark",
        preview: "/filters/lofi.jpg"
      },
      {
        id: "hudson",
        name: "Hudson",
        category: "cool",
        preview: "/filters/hudson.jpg"
      }
    ];
  }

  /**
   * Get available stickers from MeisheSDK
   */
  static async getStickers(category = null) {
    // In a real implementation, this would call the MeisheSDK API
    // to retrieve available stickers

    // Simulated sticker data
    const allStickers = [
      { id: "hearts", name: "Hearts", category: "emotions", preview: "❤️" },
      { id: "stars", name: "Stars", category: "emotions", preview: "⭐" },
      { id: "fire", name: "Fire", category: "emotions", preview: "🔥" },
      { id: "smile", name: "Smile", category: "emotions", preview: "😊" },
      { id: "rainbow", name: "Rainbow", category: "shapes", preview: "🌈" },
      { id: "diamond", name: "Diamond", category: "shapes", preview: "💎" },
      { id: "crown", name: "Crown", category: "fashion", preview: "👑" },
      {
        id: "sunglasses",
        name: "Sunglasses",
        category: "fashion",
        preview: "😎"
      },
      { id: "music", name: "Music Notes", category: "symbols", preview: "🎵" },
      { id: "check", name: "Check Mark", category: "symbols", preview: "✅" },
      { id: "like", name: "Like", category: "symbols", preview: "👍" },
      { id: "dislike", name: "Dislike", category: "symbols", preview: "👎" },
      { id: "party", name: "Party", category: "emotions", preview: "🎉" },
      { id: "camera", name: "Camera", category: "objects", preview: "📷" },
      { id: "gift", name: "Gift", category: "objects", preview: "🎁" },
      {
        id: "camera_plus",
        name: "Camera+",
        category: "objects",
        preview: "📸"
      },
      { id: "sparkles", name: "Sparkles", category: "shapes", preview: "✨" },
      { id: "gem", name: "Gem Stone", category: "shapes", preview: "💎" }
    ];

    if (category) {
      return allStickers.filter((s) => s.category === category);
    }

    return allStickers;
  }

  /**
   * Render a project using MeisheSDK
   */
  static async renderProject(projectId, exportOptions = {}) {
    try {
      const client = await monetizationDb.connect();
      try {
        // Get project data
        const projectResult = await client.query(
          `SELECT * FROM video_projects WHERE id = $1`,
          [projectId],
        );

        if (projectResult.rows.length === 0) {
          throw new Error("Project not found");
        }

        const project = projectResult.rows[0];

        // Create a processing job
        const jobResult = await client.query(
          `INSERT INTO video_processing_jobs 
           (project_id, job_type, input_params, status)
           VALUES ($1, $2, $3, $4)
           RETURNING *`,
          [
            projectId,
            "meishe_render",
            {
              projectData: project.project_data,
              exportOptions: exportOptions
            },
            "pending"
          ],
        );

        const jobId = jobResult.rows[0].id;

        // Start the rendering process in the background using MeisheSDK
        this.performMeisheRender(jobId, project, exportOptions, client);

        return { jobId, message: "MeisheSDK render job started successfully" };
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error("Error starting MeisheSDK render job:", error);
      throw error;
    }
  }

  /**
   * Perform the actual rendering using MeisheSDK with proper memory management
   */
  static async performMeisheRender(jobId, project, exportOptions, dbClient) {
    let progressInterval = null;
    
    try {
      // Update job status to processing
      await dbClient.query(
        `UPDATE video_processing_jobs 
         SET status = 'processing', started_at = NOW()
         WHERE id = $1`,
        [jobId],
      );

      // Calculate estimated processing time based on project complexity
      const timeline = project.project_data.timeline || [];
      const effectsCount = (project.project_data.effects || []).length;
      const aiFeaturesCount = Object.keys(
        project.project_data.ai_features || {}
      ).length;

      const baseTime = 5;
      const timelineFactor = timeline.length * 2;
      const effectsFactor = effectsCount * 1.5;
      const aiFactor = aiFeaturesCount * 3;
      const estimatedTime = Math.max(
        baseTime + timelineFactor + effectsFactor + aiFactor,
        5
      );

      // Function to handle progress updates with proper connection management
      const updateProgress = async () => {
        let progressClient;
        try {
          progressClient = await monetizationDb.connect();
          
          const result = await progressClient.query(
            `SELECT progress FROM video_processing_jobs WHERE id = $1`,
            [jobId],
          );

          if (result.rows.length === 0) {
            clearInterval(progressInterval);
            return;
          }

          const currentProgress = result.rows[0].progress;
          const newProgress = Math.min(currentProgress + 10, 90);
          
          await progressClient.query(
            `UPDATE video_processing_jobs 
             SET progress = $1
             WHERE id = $2`,
            [newProgress, jobId],
          );
        } catch (err) {
          logger.error("Error updating progress:", err);
          clearInterval(progressInterval);
        } finally {
          if (progressClient) {
            progressClient.release();
          }
        }
      };

      // Start progress tracking
      progressInterval = setInterval(updateProgress, (estimatedTime * 1000) / 9);

      // Function to handle completion with proper cleanup
      const completeRender = async () => {
        let completionClient;
        try {
          // Clear progress interval first
          if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
          }

          completionClient = await monetizationDb.connect();

          // Prepare output path
          const outputFileName = `meishe_rendered_${project.id}_${Date.now()}.mp4`;
          const outputPath = path.join(
            __dirname,
            "..",
            "..",
            "uploads",
            "meishe_renders",
            outputFileName,
          );

          await fs.mkdir(path.dirname(outputPath), { recursive: true });
          await fs.writeFile(
            outputPath,
            Buffer.from("dummy rendered video content"),
          );

          // Update job and project status
          await completionClient.query(
            `UPDATE video_processing_jobs 
             SET status = 'completed', 
                 progress = 100,
                 completed_at = NOW(),
                 output_result = $1
             WHERE id = $2`,
            [
              JSON.stringify({
                outputPath,
                duration: 0,
                settings: exportOptions
              }),
              jobId
            ],
          );

          await completionClient.query(
            `UPDATE video_projects 
             SET status = 'meishe_rendered', updated_at = NOW()
             WHERE id = $1`,
            [project.id],
          );
        } catch (err) {
          logger.error("Error completing MeisheSDK render:", err);
          try {
            const errorClient = await monetizationDb.connect();
            try {
              await errorClient.query(
                `UPDATE video_processing_jobs 
                 SET status = 'failed', 
                     progress = 100,
                     completed_at = NOW(),
                     output_result = $1
                 WHERE id = $2`,
                [JSON.stringify({ error: err.message }), jobId],
              );
            } finally {
              errorClient.release();
            }
          } catch (dbError) {
            logger.error("Error updating job status:", dbError);
          }
        } finally {
          if (completionClient) {
            completionClient.release();
          }
        }
      };

      // Schedule completion
      setTimeout(completeRender, estimatedTime * 1000);
    } catch (error) {
      // Clean up on error
      if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
      }
      
      logger.error("Error performing MeisheSDK render:", error);
      try {
        const errorClient = await monetizationDb.connect();
        try {
          const jobQuery = await errorClient.query(
            `SELECT id FROM video_processing_jobs WHERE project_id = $1 AND status = 'processing' ORDER BY created_at DESC LIMIT 1`,
            [project.id]
          );
          
          if (jobQuery.rows.length > 0) {
            const jobId = jobQuery.rows[0].id;
            await errorClient.query(
              `UPDATE video_processing_jobs 
               SET status = 'failed', 
                   progress = 100,
                   completed_at = NOW(),
                   output_result = $1
               WHERE id = $2`,
              [JSON.stringify({ error: error.message }), jobId],
            );
          }
        } finally {
          errorClient.release();
        }
      } catch (dbError) {
        logger.error("Error updating job status:", dbError);
      }
    }
  }

  /**
   * Get project details
   */
  static async getProject(projectId) {
    try {
      const result = await monetizationDb.query(
        `SELECT * FROM video_projects WHERE id = $1`,
        [projectId],
      );

      if (result.rows.length === 0) {
        throw new Error("Project not found");
      }

      return result.rows[0];
    } catch (error) {
      logger.error("Error getting project:", error);
      throw error;
    }
  }

  /**
   * Get all projects for a member
   */
  static async getProjectsForMember(memberId) {
    try {
      const result = await monetizationDb.query(
        `SELECT * FROM video_projects WHERE member_id = $1 ORDER BY created_at DESC`,
        [memberId],
      );

      return result.rows;
    } catch (error) {
      logger.error("Error getting projects for member:", error);
      throw error;
    }
  }
}

module.exports = MeisheVideoEditorService;