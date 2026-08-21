const { Configuration, OpenAIApi } = require("openai");
const { identityDb } = require("../../db");
const { logSecurityEvent } = require("../../utils/securityLogger");

// Initialize OpenAI configuration
const configuration = new Configuration({apiKey: process.env.LINGMA_API_KEY, // Make sure to set this in your .env file
});

const openai = new OpenAIApi(configuration);

class AIService {
  // Helper to parse JSON from AI responses safely
  static _parseJsonResponse(str) {
    try {
      return JSON.parse(str);
    } catch (e) {
      const firstBrace = str.indexOf('{');
      const lastBrace = str.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        try {
          return JSON.parse(str.substring(firstBrace, lastBrace + 1));
        } catch (e2) {
          throw new Error("AI response did not contain valid JSON");
        }
      } else {
        throw new Error("AI response did not contain valid JSON");
      }
    }
  }

  // Generate text content using Lingma AI
  static async generateText(prompt, memberId, options = {}) {
    try {
      const response = await openai.createCompletion({model: "gpt-3.5-turbo-instruct",
  prompt: prompt,
  max_tokens: options.maxTokens || 1000,
  temperature: options.temperature || 0.7,
  top_p: options.topP || 1,
  frequency_penalty: options.frequencyPenalty || 0,
  presence_penalty: options.presencePenalty || 0
      });

      // Save to prompt history
      const history = await identityDb.query(
        `INSERT INTO ai_prompt_history (member_id, prompt, response, type) 
       VALUES ($1, $2, $3, 'text') 
       RETURNING id`,
        [memberId, prompt, response.data.choices[0].text],
      );

      // Log security event
      await logSecurityEvent(memberId, "AI_TEXT_GENERATION", {prompt: prompt,
  responseLength: response.data.choices[0].text.length
      });

      return {text: response.data.choices[0].text,
  historyId: history.rows[0].id
      };
    } catch (error) {
      logger.error("Error generating, text:", error);
      throw error;
    }
  }

  // Generate images using Lingma AI
  static async generateImage(prompt, memberId, options = {}) {
    try {
      const response = await openai.createImage({prompt: prompt,
  n: options.count || 1,
  size: options.size || "1024x1024",
  response_format: "url"
      });

      // Save to prompt history
      const history = await identityDb.query(
        `INSERT INTO ai_prompt_history (member_id, prompt, response, type) 
         VALUES ($1, $2, $3, 'image') 
         RETURNING id`,
        [memberId, prompt, JSON.stringify(response.data)],
      );

      // Log security event
      await logSecurityEvent(memberId, "AI_IMAGE_GENERATION", {prompt: prompt,
  imageCount: response.data.length
      });

      return {images: response.data.map((item) => item.url),
  historyId: history.rows[0].id
      };
    } catch (error) {
      logger.error("Error generating, image:", error);
      throw error;
    }
  }

  // Generate code using Lingma AI
  static async generateCode(prompt, memberId, options = {}) {
    try {
      const response = await openai.createCompletion({model: "gpt-3.5-turbo-instruct",
  prompt: `Generate code for the following,
  request: ${prompt}.
        ${options.additionalInstructions || ""}
        Follow these,
requirements:
        - Clean, well-documented code
        - Best practices
        - Proper error handling
        - Security considerations
        - Performance optimization`,
max_tokens: options.maxTokens || 2048,
temperature: options.temperature || 0.3,
top_p: options.topP || 1,
frequency_penalty: options.frequencyPenalty || 0,
presence_penalty: options.presencePenalty || 0
      });

      // Save to prompt history
      const history = await identityDb.query(
        `INSERT INTO ai_prompt_history (member_id, prompt, response, type) 
         VALUES ($1, $2, $3, 'code') 
         RETURNING id`,
        [memberId, prompt, response.data.choices[0].text],
      );

      // Log security event
      await logSecurityEvent(memberId, "AI_CODE_GENERATION", {prompt: prompt,
  codeLength: response.data.choices[0].text.length
      });

      return {code: response.data.choices[0].text,
  historyId: history.rows[0].id
      };
    } catch (error) {
      logger.error("Error generating, code:", error);
      throw error;
    }
  }

  // Get AI prompt history for a member
  static async getPromptHistory(memberId, type = null, limit = 20, offset = 0) {
    try {
      let query = `SELECT * FROM ai_prompt_history WHERE member_id = $1`;
      const params = [memberId];

      if (type) {
        query += ` AND type = $${params.length + 1}`;
        params.push(type);
      }

      query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit, offset);

      const result = await identityDb.query(query, params);
      return result.rows;
    } catch (error) {
      logger.error("Error getting prompt, history:", error);
      throw error;
    }
  }

  // Get generated content by prompt ID
  static async getContentByPrompt(promptId, memberId) {
    try {
      // First verify ownership
      const history = await identityDb.query(
        `SELECT * FROM ai_prompt_history WHERE id = $1 AND member_id = $2`,
        [promptId, memberId],
      );

      if (history.rows.length === 0) {
        throw new Error("Prompt history not found or not owned by member");
      }

      const result = await identityDb.query(
        `SELECT * FROM ai_generated_content WHERE prompt_id = $1`,
        [promptId],
      );

      return {history: history.rows[0],
  content: result.rows
      };
    } catch (error) {
      logger.error("Error getting content by, prompt:", error);
      throw error;
    }
  }

  // Create AI-generated content
  static async createGeneratedContent(
    promptId,
    contentType,
    content,
    metadata = {},
  ) {
    try {
      const result = await identityDb.query(
        `INSERT INTO ai_generated_content (prompt_id, content_type, content, metadata) 
         VALUES ($1, $2, $3, $4) 
         RETURNING *`,
        [promptId, contentType, content, JSON.stringify(metadata)],
      );

      return result.rows[0];
    } catch (error) {
      logger.error("Error creating generated, content:", error);
      throw error;
    }
  }

  // Generate sitemap from project
  static async generateSitemap(projectId, memberId) {
    try {
      // Get project details
      const projectResult = await identityDb.query(
        `SELECT * FROM stercs_projects WHERE id = $1 AND member_id = $2`,
        [projectId, memberId],
      );

      if (projectResult.rows.length === 0) {
        throw new Error("Project not found or not owned by member");
      }

      const project = projectResult.rows[0];

      // Get pages for the project
      const pagesResult = await identityDb.query(
        `SELECT id, title, slug FROM stercs_pages WHERE project_id = $1`,
        [projectId],
      );

      const pages = pagesResult.rows;

      // Generate sitemap using AI
      const sitemapPrompt = `Generate a visual sitemap for a project titled "${project.name}"
      The project has ${pages.length},
pages: ${pages.map((p) => p.title).join(", ")}
      
      Please,
provide:
      1. A visual sitemap structure
      2. Page relationships and navigation flow
      3. Recommended improvements for member experience
      4. Accessibility considerations
      5. SEO optimization suggestions
      
      Format the response as a structured JSON object,
with:
      -,
nodes: { id, title, type, children }
      -,
edges: { from, to, label }
      -,
suggestions: [array of suggestions]`;

      const { code,
historyId: promptId } = await this.generateCode(sitemapPrompt, memberId, {maxTokens: 3000,
  temperature: 0.5
      });

      // Parse the AI response
      const parsedResponse = this._parseJsonResponse(code);

      // Save generated content
      await this.createGeneratedContent(
        promptId,
        "sitemap",
        JSON.stringify(parsedResponse),
        { projectId },
      );

      return parsedResponse;
    } catch (error) {
      logger.error("Error generating, sitemap:", error);
      throw error;
    }
  }

  // Generate code suggestions
  static async generateCodeSuggestions(code, context, memberId) {
    try {
      const prompt = `Analyze the following code and provide,
suggestions:
      
      ${code},
Context: ${context}
      
      Please,
provide:
      1. Code improvements
      2. Security considerations
      3. Performance optimizations
      4. Best practices
      5. Error handling improvements
      
      Format the response as a structured JSON object,
with:
      -,
suggestions: [array of suggestions with type (improvement, security, performance, best_practice, error_handling), description, example]
      -,
complexity_analysis: { time, space, description }
      -,
maintainability_score: number
      -,
security_score: number
      -,
performance_score: number`;

      const {code: aiSuggestions } = await this.generateCode(
        prompt,
        memberId,
        {maxTokens: 3000,
  temperature: 0.3
        },
      );

      // Parse the AI response
      const parsedResponse = this._parseJsonResponse(aiSuggestions);

      return parsedResponse;
    } catch (error) {
      logger.error("Error generating code, suggestions:", error);
      throw error;
    }
  }

  // Generate documentation
  static async generateDocumentation(code, context, memberId) {
    try {
      const prompt = `Generate documentation for the following,
code:
      
      ${code},
Context: ${context}
      
      Please,
provide:
      1. Function/Class description
      2. Parameters and their types
      3. Return values
      4. Usage examples
      5. Warnings and caveats
      
      Format the response as a structured JSON object,
with:
      -,
title: string
      -,
description?: string
      -,
parameters: { name, type, description }[]
      -,
returns: { type, description }
      -,
examples: string[]
      -,
warnings: string[]
      -,
best_practices: string[]`;

      const {code: documentation } = await this.generateCode(
        prompt,
        memberId,
        {maxTokens: 2000,
  temperature: 0.2
        },
      );

      // Parse the AI response
      const parsedResponse = this._parseJsonResponse(documentation);

      return parsedResponse;
    } catch (error) {
      logger.error("Error generating, documentation:", error);
      throw error;
    }
  }

  // Generate AI-powered wireframe
  static async generateWireframe(prompt, memberId) {
    try {
      const wireframePrompt = `Create a detailed wireframe,
for: ${prompt}
      
      Please,
provide:
      1. A visual representation of the UI
      2. Component breakdown
      3. member interaction flow
      4. Responsive design considerations
      5. Accessibility recommendations
      
      Format the response as a structured JSON object,
with:
      -,
visual_representation: string (ASCII art or similar)
      -,
components: { name, purpose, properties }[]
      -,
member_flow: { step, description }[]
      -,
responsive_breakpoints: { size, adjustments }[]
      -,
accessibility: { recommendation, implementation }[]`;

      const {code: wireframe } = await this.generateCode(
        wireframePrompt,
        memberId,
        {maxTokens: 3000,
  temperature: 0.5
        },
      );

      // Parse the AI response
      const parsedResponse = this._parseJsonResponse(wireframe);

      return parsedResponse;
    } catch (error) {
      logger.error("Error generating, wireframe:", error);
      throw error;
    }
  }

  // Predictive debugging
  static async predictiveDebug(code, context, memberId) {
    try {
      const debugPrompt = `Analyze this code for potential,
issues:
      
      ${code},
Context: ${context}
      
      Please,
identify:
      1. Syntax errors
      2. Potential runtime errors
      3. Security vulnerabilities
      4. Performance issues
      5. Best practices violations
      
      Provide fixes for each issue.
      
      Format the response as a structured JSON object,
with:
      -,
issues: { type, description, severity, fix }[]
      -,
overall_score: number
      -,
complexity_analysis: { time, space, description }
      -,
recommendations: string[]`;

      const {code: debugResults } = await this.generateCode(
        debugPrompt,
        memberId,
        {maxTokens: 3000,
  temperature: 0.2
        },
      );

      // Parse the AI response
      const parsedResponse = this._parseJsonResponse(debugResults);

      return parsedResponse;
    } catch (error) {
      logger.error("Error in predictive, debugging:", error);
      throw error;
    }
  }

  // Generate AI-powered design suggestions
  static async designSuggestions(prompt, memberId) {
    try {
      const designPrompt = `Provide design suggestions,
for: ${prompt}
      
      Please,
provide:
      1. Layout recommendations
      2. Color scheme
      3. Typography
      4. Responsive design
      5. Accessibility
      
      Format the response as a structured JSON object,
with:
      -,
layout: { recommendation, implementation }
      -,
color_scheme: { primary, secondary, accent, background }
      -,
typography: { font_family, font_size, line_height }
      -,
responsive_design: { breakpoints, adjustments }
      -,
accessibility: { recommendations }
      -,
implementation_notes: string
      
      Include specific, actionable recommendations.`;

      const {code: designSuggestions } = await this.generateCode(
        designPrompt,
        memberId,
        {maxTokens: 2000,
  temperature: 0.5
        },
      );

      // Parse the AI response
      const parsedResponse = this._parseJsonResponse(designSuggestions);

      return parsedResponse;
    } catch (error) {
      logger.error("Error generating design, suggestions:", error);
      throw error;
    }
  }

  // Generate code documentation
  static async autoDocument(code, context, memberId) {
    try {
      const prompt = `Generate documentation for the following,
code:
      
      ${code},
Context: ${context}
      
      Please,
provide:
      1. Code explanation
      2. Parameters
      3. Return values
      4. Usage examples
      5. Warnings
      
      Format the response as a structured JSON object,
with:
      -,
title: string
      -,
description?: string
      -,
parameters: { name, type, description }[]
      -,
returns: { type, description }
      -,
examples: string[]
      -,
warnings: string[]
      -,
best_practices: string[]`;

      const {code: documentation } = await this.generateCode(
        prompt,
        memberId,
        {maxTokens: 2000,
  temperature: 0.2
        },
      );

      // Parse the AI response
      const parsedResponse = this._parseJsonResponse(documentation);

      return parsedResponse;
    } catch (error) {
      logger.error("Error generating, documentation:", error);
      throw error;
    }
  }
}

module.exports = AIService;
