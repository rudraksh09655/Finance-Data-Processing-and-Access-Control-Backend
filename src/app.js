require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');

const swaggerSpec = require('./swagger/swagger');
const errorHandler = require('./utils/errorHandler');

const authRoutes = require('./modules/auth/auth.routes');
const usersRoutes = require('./modules/users/users.routes');
const recordsRoutes = require('./modules/records/records.routes');
const dashboardRoutes = require('./modules/dashboard/dashboard.routes');

const app = express();

// Security & parsing
app.use(helmet());
app.use(cors());
app.use(express.json());

// API Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get('/health', (req, res) => {
    res.json({ success: true, message: 'Finance API is running', timestamp: new Date() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/records', recordsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found', data: null });
});

// Global error handler — must be last
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\n🚀 Finance API running at http://localhost:${PORT}`);
    console.log(`📄 Swagger docs at http://localhost:${PORT}/api-docs\n`);
});