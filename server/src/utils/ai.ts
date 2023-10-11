import { timestamp } from './logger';
import { OpenAI } from 'langchain/llms/openai';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { PromptTemplate } from 'langchain/prompts';
import { z } from 'zod';

const analysisSchema = z.object({
  language: z
    .string()
    .describe('the programming languge used to write the code snippet'),
  paradigm: z
    .string()
    .describe('the programming paradigm employed by the code snippet'),
  summary: z.string().describe('a summary of what the code snippet does'),
  recommendation: z
    .string()
    .describe(
      'a recommendation for how to improve the performance or readability of the code',
    ),
});

type Analysis = z.infer<typeof analysisSchema>;

const parser = StructuredOutputParser.fromZodSchema(analysisSchema);

async function getPrompt(snippet: string) {
  const formatInstructions = parser.getFormatInstructions();

  const prompt = new PromptTemplate({
    template:
      'Analyze the following code snippet. Follow the instructions and format your response to match the format instructions, no matter what! \n{formatInstructions}\n{snippet}',
    inputVariables: ['snippet'],
    partialVariables: { formatInstructions },
  });

  const input = await prompt.format({
    snippet: snippet,
  });

  return input;
}

export default async function analyze(snippet: string): Promise<Analysis> {
  const input = await getPrompt(snippet);
  const model = new OpenAI({
    temperature: 0,
    modelName: 'gpt-4',
  });

  console.log(`⚡️[server]: gpt api call initiated @ ${timestamp()}`);
  const result = await model.call(input);
  console.log(`⚡️[server]: gpt api call completed @ ${timestamp()}`);

  try {
    return parser.parse(result);
  } catch (error) {
    throw new Error(`there was an error parsing the analysis: ${error}`);
  }
}
