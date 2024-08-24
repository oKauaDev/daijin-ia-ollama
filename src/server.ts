import express from "express";

import { Router, Request, Response } from "express";
import IA from "./managers/IA";
import schemes from "./schemes/routes";
import { ZodError } from "zod";
import generateZodError from "./utils/generateZodError";
import getVpsIp from "./utils/getVpsIp";
import Config from "./constants/Config";

async function main() {
  const app = express();
  const route = Router();
  const DaijinIA = new IA();
  await DaijinIA.download();

  console.log("◇ Ligando o servidor...");

  app.use(express.json());

  route.get("/", (req: Request, res: Response) => {
    res.json({
      status: 200,
      node: process.versions.node,
      responseTime: new Date().toLocaleTimeString(),
      nodeVersion: process.versions.node,
      localIP: getVpsIp(),
    });
  });

  route.post("/chat", async (req: Request, res: Response) => {
    try {
      const body = req.body;

      const parse = schemes.routes.chat.parse(body);

      const response = await DaijinIA.prompt({
        content: parse.prompt,
      });

      res.json({ result: response });
      return;
    } catch (e) {
      if (e instanceof ZodError) {
        const zError = generateZodError(e);

        res.status(400);
        res.json({ error: zError, status: 400 });
        return;
      }

      if (e instanceof Error) {
        res.status(500);
        res.json({ error: e.message, status: 500 });
        return;
      }

      res.status(400);
      res.json({ error: "We crashed into some rocks, try again later.", status: 400 });
    }
  });

  app.use(route);

  app.listen(Config.port, () => {
    console.log(`◇ Servidor ligado na url ${getVpsIp()}:3000`);
  });
}

main();
