const router = require('express').Router();
const { register, login } = require('./auth.controller');
const { validate, registerSchema, loginSchema } = require('./auth.validator');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 */
router.post('/register', validate(registerSchema), register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login and receive a JWT token
 *     tags: [Auth]
 */
router.post('/login', validate(loginSchema), login);

module.exports = router;