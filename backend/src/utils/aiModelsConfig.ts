export const OpenAIMaxTokens = 3000;
export const OpenAICharsPerToken = 4;
export const OpenAIMaxPromptLength = OpenAIMaxTokens * OpenAICharsPerToken;
export const OpenAIModel = 'gpt-4o-mini';
export const SessionChunkPrompt = 'Summarize the following rrweb data into one summary: ';
export const SessionSummariesPrompt = 'Summarize the following rrweb summaries into one short paragraph';