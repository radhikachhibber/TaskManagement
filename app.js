import {Router} from 'express';
import {login, logout, register} from './controllers/authController.js';

const router = Router();

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Log in a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: securepassword123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid email or password
 */
router.post('/login', (req, res) => login(req, res));

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Radhika
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: strongpassword123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */
router.post('/register', (req, res) => register(req, res));

/**
 * @swagger
 * /api/logout:
 *   get:
 *     summary: Log out a user
 *     tags: [User]
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
router.get('/logout', (req, res) => logout(req, res));

export default router;