import OpenAI from 'openai';
import * as AIConfig from '../utils/aiModelsConfig';

export class OpenAIService {
  private openAIClient: OpenAI;
  private model: string;
  private maxTokens: number;
  maxPromptLength: number;

  constructor() {
    this.maxPromptLength = AIConfig.OpenAIMaxPromptLength;
    this.openAIClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.model = AIConfig.OpenAIModel;
    this.maxTokens = AIConfig.OpenAIMaxTokens;
    this.maxPromptLength = AIConfig.OpenAIMaxPromptLength;
  }

  splitIntoChunks = (data: string) => { // add string[] to the function signature
    const chunks: string[] = [];
    let startIndex = 0;

    while (startIndex < data.length) {
      chunks.push(data.slice(startIndex, startIndex + this.maxPromptLength));
      startIndex += this.maxPromptLength
    }

    return chunks; // array of strings
  };

  summarizeSessionChunks = async (chunks: string[]): Promise<(string | undefined)[]> => {
    const promises = chunks.map(chunk => this.queryOpenAI(chunk, AIConfig.SessionChunkPrompt)); // 'Summarize the following rrweb data into one summary'
    const summaries = await Promise.allSettled(promises); // we made a query for every chunk. Now we settle
    return summaries.map(summary => summary.status === 'fulfilled' ? summary.value : []).flat();
  }

  summarizeSession = async (data: string) => { // add Promise<string> to the function signature
    const chunks = this.splitIntoChunks(data);
    let summaries = await this.summarizeSessionChunks(chunks); // now we have a summary for every chunk
    if (summaries.length > 1) {
      console.log('THIS WILL NOT GET LOGGED');
      const joinedSummaries = summaries.join(' ');
      return await this.queryOpenAI(joinedSummaries, AIConfig.SessionSummariesPrompt) // summarizing the summaries
    } else {
      return summaries[0];
    }
  };

  // query the model, returns summarization
  queryOpenAI = async (data: string, prompt: string): Promise<string | undefined> => {

    try {
      const response = await this.openAIClient.chat.completions.create({
        messages: [{ role: 'user', content: `${prompt} ${data}` }],
        model: this.model,
        max_tokens: this.maxTokens
      });

      return response.choices[0].message.content || '';
    } catch (error) {
      console.error('OpenAI query error:', error);
      throw error;
    }
  }
}