/**
 * @swagger
 * tags:
 *   name: AI
 *   description: AI Assistant API
 *
 * /api/ai/assist:
 *   post:
 *     summary: Chat with AI assistant
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: AI response
 *
 * /api/ai/generate-code:
 *   post:
 *     summary: Generate code with AI
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Generated code
 *
 * /api/ai/history:
 *   get:
 *     summary: Get AI chat history
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Chat history
 *
 * /api/ai/code-history:
 *   get:
 *     summary: Get AI code generation history
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Code generation history
 *
 * /api/ai/stats:
 *   get:
 *     summary: Get AI usage stats and credit balance
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usage stats
 */
