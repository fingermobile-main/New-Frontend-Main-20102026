/**
 * @swagger
 * tags:
 *   name: grading-system
 *   description: Auto-generated endpoints for grading-system
 */

/**
 * @swagger
 * /grading-system:
 *   get:
 *     summary: GET /
 *     tags: [grading-system]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 *   post:
 *     summary: POST /
 *     tags: [grading-system]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */

/**
 * @swagger
 * /grading-system/{id}:
 *   get:
 *     summary: GET /:id
 *     tags: [grading-system]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */

/**
 * @swagger
 * /grading-system/grades:
 *   post:
 *     summary: POST /grades
 *     tags: [grading-system]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */

/**
 * @swagger
 * /grading-system/grades/{id}:
 *   put:
 *     summary: PUT /grades/:id
 *     tags: [grading-system]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 *   delete:
 *     summary: DELETE /grades/:id
 *     tags: [grading-system]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */

/**
 * @swagger
 * /grading-system/students/{studentId}/grades:
 *   get:
 *     summary: GET /students/:studentId/grades
 *     tags: [grading-system]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */
