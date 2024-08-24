import { ZodError } from "zod";

export default function generateZodError(error: ZodError) {
  const messages: string[] = [];
  error.issues.forEach((issue) => {
    messages.push(`${issue.path[0] ? `${issue.path[0]} ` : ""}${issue.message}`.toLowerCase());
  });

  return messages.join(", ");
}
