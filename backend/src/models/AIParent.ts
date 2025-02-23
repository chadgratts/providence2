import * as AIConfig from '../utils/aiModelsConfig';

export default abstract class AIParent {
  abstract maxPromptLength: number;
  abstract queryLLM(data: string, prompt: string): Promise<string | undefined>;
  
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
    const promises = chunks.map(chunk => this.queryLLM(chunk, AIConfig.SessionChunkPrompt)); // 'Summarize the following rrweb data into one summary'
    const summaries = await Promise.allSettled(promises); // we made a query for every chunk. Now we settle
    return summaries.map(summary => summary.status === 'fulfilled' ? summary.value : []).flat();
  }

  summarizeSession = async (data: string) => { // add Promise<string> to the function signature
    const chunks = this.splitIntoChunks(data);
    let summaries = await this.summarizeSessionChunks(chunks); // now we have a summary for every chunk
    if (summaries.length > 1) {
      console.log('THIS WILL NOT GET LOGGED');
      const joinedSummaries = summaries.join(' ');
      return await this.queryLLM(joinedSummaries, AIConfig.SessionSummariesPrompt) // summarizing the summaries
    } else {
      return summaries[0];
    }
  };
}