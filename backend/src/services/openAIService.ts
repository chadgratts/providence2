import OpenAI from 'openai';
import AIParent from '../models/AIParent';
import * as AIConfig from '../utils/aiModelsConfig';

export class OpenAIService extends AIParent {
  private openAIClient: OpenAI;
  private model: string;
  private maxTokens: number;
  maxPromptLength: number;

  constructor() {
    super();
    this.maxPromptLength = AIConfig.OpenAIMaxPromptLength;
    this.openAIClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.model = AIConfig.OpenAIModel;
    this.maxTokens = AIConfig.OpenAIMaxTokens;
    this.maxPromptLength = AIConfig.OpenAIMaxPromptLength;
  }

  // query the model, returns summarization
  queryLLM = async (data: string, prompt: string): Promise<string | undefined> => {
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