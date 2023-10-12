"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.timestamp = void 0;
const winston_1 = __importDefault(require("winston"));
const morgan_1 = __importDefault(require("morgan"));
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};
const level = () => {
    const env = process.env.NODE_ENV || 'development';
    const isDevelopment = env === 'development';
    return isDevelopment ? 'debug' : 'warn';
};
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};
winston_1.default.addColors(colors);
const format = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }), winston_1.default.format.colorize({ all: true }), winston_1.default.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`));
const transports = [
    new winston_1.default.transports.Console(),
    new winston_1.default.transports.File({
        filename: 'logs/error.log',
        level: 'error',
    }),
];
const Logger = winston_1.default.createLogger({
    level: level(),
    levels,
    format,
    transports,
});
const stream = {
    write: (message) => Logger.http(message),
};
const skip = () => {
    const env = process.env.NODE_ENV || 'development';
    return env !== 'development';
};
const loggerMiddleware = (0, morgan_1.default)(':method :url :status :res[content-length] - :response-time ms', { stream, skip });
const timestamp = () => {
    const date = new Date(Date.now());
    const month = date.getMonth().toString().padStart(2, '0');
    const day = date.getDay().toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const milliseconds = date.getMilliseconds().toString().padStart(3, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}:${milliseconds}`;
};
exports.timestamp = timestamp;
exports.default = loggerMiddleware;
