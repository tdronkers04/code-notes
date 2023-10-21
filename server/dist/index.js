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
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const db_1 = require("./utils/db");
const logger_1 = __importDefault(require("./utils/logger"));
const ai_1 = __importDefault(require("./utils/ai"));
const app = (0, express_1.default)();
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 8000;
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000,
    max: 50,
});
app.use(limiter);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(logger_1.default);
app.get('/api/notes', (0, clerk_sdk_node_1.ClerkExpressWithAuth)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const clerkUser = yield clerk_sdk_node_1.users.getUser(req.auth.userId || '');
    const match = yield db_1.prisma.user.findUnique({
        where: {
            clerkId: clerkUser.id,
        },
    });
    if (!match) {
        yield db_1.prisma.user.create({
            data: {
                clerkId: clerkUser.id || '',
                email: (clerkUser === null || clerkUser === void 0 ? void 0 : clerkUser.emailAddresses[0].emailAddress) || '',
            },
        });
    }
    const notes = yield db_1.prisma.notes.findMany({
        where: {
            userId: clerkUser.id,
        },
        orderBy: {
            createdAt: 'asc',
        },
    });
    res.status(200).json(notes);
}));
app.get('/api/notes/:id/analysis', (0, clerk_sdk_node_1.ClerkExpressWithAuth)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const noteAnalysis = yield db_1.prisma.analysis.findUnique({
        where: {
            noteId: id,
        },
    });
    res.status(200).json(noteAnalysis);
}));
app.post('/api/notes', (0, clerk_sdk_node_1.ClerkExpressWithAuth)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const clerkUser = yield clerk_sdk_node_1.users.getUser(req.auth.userId || '');
    const newNote = yield db_1.prisma.notes.create({
        data: {
            userId: clerkUser.id,
            code: req.body.code,
            title: 'untitled',
        },
    });
    const analysis = yield (0, ai_1.default)(newNote.code);
    yield db_1.prisma.analysis.create({
        data: {
            noteId: newNote.id,
            language: analysis.language,
            paradigm: analysis.paradigm,
            summary: analysis.summary,
            recommendation: analysis.recommendation,
        },
    });
    res.status(201).json(newNote);
}));
app.delete('/api/notes/:id', (0, clerk_sdk_node_1.ClerkExpressWithAuth)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const clerkUser = yield clerk_sdk_node_1.users.getUser(req.auth.userId || '');
    const { id } = req.params;
    yield db_1.prisma.notes.delete({
        where: {
            id: id,
            userId: clerkUser.id,
        },
    });
    res.status(204).send();
}));
app.listen(port, () => {
    console.log(`⚡️[server]: Server is listening on port ${port} of ${host}`);
});
