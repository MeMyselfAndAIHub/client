import { OpenAI } from "langchain/llms/openai";
import { loadQAStuffChain, loadQAMapReduceChain } from "langchain/chains";
import { Document } from "langchain/document";

export class LangChain {
  // using StuffDocumentsChain
  async askMemory(memoryInput: string, question: string) {
    const llm = new OpenAI({
      temperature: 0.9,
      openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    });
    const chain = loadQAStuffChain(llm);

    const memoryDocs = [new Document({ pageContent: memoryInput })];

    const response = await chain.call({
      input_documents: memoryDocs,
      question: question,
    });

    return response;
  }
}
