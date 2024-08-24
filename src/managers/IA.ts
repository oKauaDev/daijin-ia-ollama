import { Ollama } from "ollama";
import sendProgressBar from "../utils/sendProgressBar";

interface PromptInput {
  content: string;
}

export default class IA {
  private ollama: Ollama;

  constructor() {
    this.ollama = new Ollama({ fetch: fetch });
  }

  private async downloadBaseModel() {
    const download = await this.ollama.pull({
      model: "mistral",
      stream: true,
    });

    console.log(`◇ Baixando o modelo Mistral do Ollama...`);
    for await (const part of download) {
      sendProgressBar(part.total, part.completed);
    }

    console.log("\n");

    console.log("◇ Modelo do Ollama baixado com sucesso.");
  }

  async init() {
    const { models } = await this.ollama.list();
    const exists = models.find((model) => model.name === "daijin");

    if (!exists) {
      const mistral = models.find((model) => model.name === "mistral");

      if (!mistral) {
        await this.downloadBaseModel();
      }

      const modelfile = `
          FROM mistral
          SYSTEM Your name is Daijin and you are an AI and you know it, you always respond to users in a fun way, you must not use emojis or markdown, only text and you only respond in Portuguese, you respond in JSON format as follows: ' {"response": " ", "learn": []}' In "response" you send the response and in learn you send information that you can learn from the user, be careful not to return something you already know, so check , if you already know, don't put it in the array, if you have nothing to learn, return an empty array ([]), don't record unnecessary information, you don't need to store the user's language, you will always respond in Portuguese, here's an example where you it shouldn't record, it's just an example for you to understand how it will return, the user's prompt was this: "Hello, my name is Kauã", your response should be similar to this: '{"response": "Hi Kauã! everything well?", "learn": ["The user's name is Kauã"]}'. Remembering that this is just an example.
      `;

      const response = await this.ollama.create({
        model: "daijin",
        stream: true,
        modelfile: modelfile,
      });

      console.log("◇ Model do DaijinIA criado com sucesso.");
      return;
    }

    console.log("◇ Model do DaijinIA pego com sucesso.");
  }

  async prompt(input: PromptInput) {
    try {
      const response = await this.ollama.generate({
        model: "daijin",
        prompt: input.content,
        format: "json",
        stream: true,
      });

      let contentText: string = "";

      for await (const part of response) {
        contentText = contentText.concat(part.response);
      }

      return contentText;
    } catch {
      throw new Error("Ocorreu um erro ao tentar gerar o prompt");
    }
  }
}
