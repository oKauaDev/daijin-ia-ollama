import { z } from "zod";

const schemes = {
  routes: {
    chat: z.object({
      prompt: z.string().min(1, "O prompt é obrigatório"),
    }),
  },
};

export default schemes;
