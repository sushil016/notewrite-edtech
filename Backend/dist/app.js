"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const profileRoutes_1 = __importDefault(require("./routes/profileRoutes"));
const settingsRoutes_1 = __importDefault(require("./routes/settingsRoutes"));
const category_1 = __importDefault(require("./routes/category"));
const course_1 = __importDefault(require("./routes/course"));
const payment_1 = __importDefault(require("./routes/payment"));
const section_1 = __importDefault(require("./routes/section"));
const subsection_1 = __importDefault(require("./routes/subsection"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
exports.prisma = new client_1.PrismaClient();
// Middleware
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['set-cookie'],
}));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Add request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, {
        query: req.query,
        params: req.params,
        body: req.method === 'POST' ? req.body : undefined
    });
    next();
});
// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is running'
    });
});
// Routes
app.use('/api/v1/auth', authRoutes_1.default);
app.use('/api/v1/profile', profileRoutes_1.default);
app.use('/api/v1/settings', settingsRoutes_1.default);
app.use('/api/v1/categories', category_1.default);
app.use('/api/v1/courses', course_1.default);
app.use('/api/v1/payments', payment_1.default);
app.use('/api/v1/sections', section_1.default);
app.use('/api/v1/subsections', subsection_1.default);
// Add a test route to check token
app.get('/api/test-auth', (req, res) => {
    console.log('Cookies received:', req.cookies);
    res.json({ cookies: req.cookies });
});
// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json(Object.assign({ success: false, message: err.message || 'Internal server error' }, (process.env.NODE_ENV === 'development' && { stack: err.stack })));
});
exports.default = app;
