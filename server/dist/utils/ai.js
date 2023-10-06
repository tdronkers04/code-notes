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
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = require("langchain/llms/openai");
const output_parsers_1 = require("langchain/output_parsers");
const prompts_1 = require("langchain/prompts");
const zod_1 = require("zod");
const analysisSchema = zod_1.z.object({
    language: zod_1.z
        .string()
        .describe('the programming languge used to write the code snippet'),
    summary: zod_1.z.string().describe('a summary of what the code snippet does'),
});
const parser = output_parsers_1.StructuredOutputParser.fromZodSchema(analysisSchema);
function getPrompt(snippet) {
    return __awaiter(this, void 0, void 0, function* () {
        const formatInstructions = parser.getFormatInstructions();
        const prompt = new prompts_1.PromptTemplate({
            template: 'Analyze the following code snippet. Follow the instructions and format your response to match the format instructions, no matter what! \n{formatInstructions}\n{snippet}',
            inputVariables: ['snippet'],
            partialVariables: { formatInstructions },
        });
        const input = yield prompt.format({
            snippet: snippet,
        });
        return input;
    });
}
function analyze(snippet) {
    return __awaiter(this, void 0, void 0, function* () {
        const input = yield getPrompt(snippet);
        const model = new openai_1.OpenAI({
            temperature: 0,
            modelName: 'gpt-3.5-turbo',
        });
        const result = yield model.call(input);
        try {
            return parser.parse(result);
        }
        catch (error) {
            throw new Error(`there was an error parsing the analysis: ${error}`);
        }
    });
}
exports.default = analyze;
