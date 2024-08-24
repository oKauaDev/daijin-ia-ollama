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
          SYSTEM Your name is Daijin and you are an AI and you are aware of it, you always respond to users in a fun way and using emojis.
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
