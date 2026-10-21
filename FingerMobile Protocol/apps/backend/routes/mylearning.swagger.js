/**
 * @swagger
 * tags:
 *   name: mylearning
 *   description: Auto-generated endpoints for mylearning
 */

/**
 * @swagger
 * /mylearning/courses:
 *   get:
 *     summary: GET /courses
 *     tags: [mylearning]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 *   post:
 *     summary: POST /courses
 *     tags: [mylearning]
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
 * /mylearning/courses/{courseId}:
 *   get:
 *     summary: GET /courses/:courseId
 *     tags: [mylearning]
 *     parameters:
 *       - in: path
 *         name: courseId
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
 * /mylearning/courses/{courseId}/enroll:
 *   post:
 *     summary: POST /courses/:courseId/enroll
 *     tags: [mylearning]
 *     parameters:
 *       - in: path
 *         name: courseId
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
 * /mylearning/students/{studentId}/courses:
 *   get:
 *     summary: GET /students/:studentId/courses
 *     tags: [mylearning]
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

/**
 * @swagger
 * /mylearning/instructors/{instructorId}/courses:
 *   get:
 *     summary: GET /instructors/:instructorId/courses
 *     tags: [mylearning]
 *     parameters:
 *       - in: path
 *         name: instructorId
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
 * /mylearning/courses/{courseId}/modules:
 *   post:
 *     summary: POST /courses/:courseId/modules
 *     tags: [mylearning]
 *     parameters:
 *       - in: path
 *         name: courseId
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
 *   get:
 *     summary: GET /courses/:courseId/modules
 *     tags: [mylearning]
 *     parameters:
 *       - in: path
 *         name: courseId
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
 * /mylearning/categories:
 *   get:
 *     summary: GET /categories
 *     tags: [mylearning]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */
