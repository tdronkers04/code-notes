"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
const db_1 = require("./utils/db");
const logger_1 = __importDefault(require("./utils/logger"));
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(express_1.default.json());
app.use(logger_1.default);
app.get('/notes', (0, clerk_sdk_node_1.ClerkExpressWithAuth)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const clerkUser = yield clerk_sdk_node_1.users.getUser(req.auth.userId || '');
    const match = yield db_1.prisma.user.findUnique({
        where: {
            clerkId: clerkUser.id,
        },
    });
    // if user does not exist in DB, create user
    if (!match) {
        yield db_1.prisma.user.create({
            data: {
                clerkId: clerkUser.id || '',
                email: (clerkUser === null || clerkUser === void 0 ? void 0 : clerkUser.emailAddresses[0].emailAddress) || '',
            },
        });
    }
    // query notes associated with user
    const notes = yield db_1.prisma.note.findMany({
        where: {
            userId: clerkUser.id,
        },
        orderBy: {
            createdAt: 'asc',
        },
    });
    res.json(notes);
}));
app.post('/new-note', (0, clerk_sdk_node_1.ClerkExpressWithAuth)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const clerkUser = yield clerk_sdk_node_1.users.getUser(req.auth.userId || '');
    yield db_1.prisma.note.create({
        data: {
            userId: clerkUser.id,
            code: req.body.code,
        },
    });
    const notes = yield db_1.prisma.note.findMany({
        where: {
            userId: clerkUser.id,
        },
        orderBy: {
            createdAt: 'asc',
        },
    });
    res.json(notes);
}));
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
