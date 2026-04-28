import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer "))
            return res.status(401).json({ message: "Token requerido" });

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            id: decoded.sub,
            email: decoded.email,
            role: decoded.role   // usar "role" tal como se emite en C#
        };

        next();
    } catch (error) {
        return res.status(401).json({ message: "Token inválido" });
    }
};