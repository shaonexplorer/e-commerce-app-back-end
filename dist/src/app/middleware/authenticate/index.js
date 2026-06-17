"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = (roles) => (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken;
        if (!token) {
            throw new Error("Authentication token is missing");
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (roles.length && !roles.includes(decoded.userRole)) {
            throw new Error("You are not authorized to access this resource");
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.authenticate = authenticate;
