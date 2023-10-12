"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const path = __importStar(require("path"));
require("dotenv/config");
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
const db_1 = require("./utils/db");
const logger_1 = __importDefault(require("./utils/logger"));
const ai_1 = __importDefault(require("./utils/ai"));
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(express_1.default.json());
app.use(logger_1.default);
app.use(express_1.default.static(path.join(__dirname, '../../client/dist')));
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
app.get('/notes/:id/analysis', (0, clerk_sdk_node_1.ClerkExpressWithAuth)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const noteAnalysis = yield db_1.prisma.analysis.findUnique({
        where: {
            noteId: id,
        },
    });
    res.status(200).json(noteAnalysis);
}));
app.post('/new-note', (0, clerk_sdk_node_1.ClerkExpressWithAuth)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
app.delete('/notes/:id', (0, clerk_sdk_node_1.ClerkExpressWithAuth)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist', 'index.html'));
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
