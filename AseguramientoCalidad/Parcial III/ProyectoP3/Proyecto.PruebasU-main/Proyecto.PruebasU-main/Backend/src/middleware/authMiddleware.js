const jwt = require('jsonwebtoken');

/* istanbul ignore next */
const JWT_SECRET = process.env.JWT_SECRET || 'tu_jwt_secret_key_2025';

// Middleware que protege rutas usando JWT
function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ msg: 'No autorizado' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id;
        req.userEmail = decoded.email;
        next();
    } catch {
        return res.status(403).json({ msg: 'Token inválido' });
    }
}

module.exports = { authMiddleware, JWT_SECRET };
