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

  async download() {
    const download = await this.ollama.pull({
      model: "llama3.1",
      stream: true,
    });

    console.log("◇ Baixando o modelo LLama3.1 do Ollama...");
    for await (const part of download) {
      sendProgressBar(part.total, part.completed);
    }

    console.log("\n");

    console.log("◇ Modelo do Ollama baixado com sucesso.");
  }

  async prompt(input: PromptInput) {
    try {
      const response = await this.ollama.generate({
        model: "moondream",
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
