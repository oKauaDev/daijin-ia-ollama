import { Ollama } from "ollama";
import sendProgressBar from "../utils/sendProgressBar";
import Config from "../constants/Config";

interface PromptInput {
  content: string;
}

const model = Config.mode === "production" ? "llama3.1" : "moondream";

export default class IA {
  private ollama: Ollama;

  constructor() {
    this.ollama = new Ollama({ fetch: fetch });
  }

  async download() {
    const download = await this.ollama.pull({
      model: model,
      stream: true,
    });

    console.log(`◇ Baixando o modelo ${model} do Ollama...`);
    for await (const part of download) {
      sendProgressBar(part.total, part.completed);
    }

    console.log("\n");

    console.log("◇ Modelo do Ollama baixado com sucesso.");
  }

  async prompt(input: PromptInput) {
    try {
      const response = await this.ollama.generate({
        template: `Your name is Daijin and you are an AI and you are aware of it, today is ${new Date().toLocaleDateString()} day, you always respond to users in a fun way and using emojis.`,
        model: model,
        prompt: input.content,
        stream: true,
      });

      let contentText: string = "";

      for await (const part of response) {
        console.log(part.response);
        contentText = contentText.concat(part.response);
      }

      return contentText;
    } catch {
      throw new Error("Ocorreu um erro ao tentar gerar o prompt");
    }
  }
}
