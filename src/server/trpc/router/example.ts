import { t } from "../trpc";
import { z } from "zod";

export const exampleRouter = t.router({
  hello: t.procedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: input.text,
        id: "123",
      };
    }),
  getAll: t.procedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),
  getById: t.procedure
    .input(z.object({ id: z.string(), text: z.string() }))
    .query(({ input }) => {
      if (input.id) {
        return {
          id: input.id,
          text: input.text,
        };
      }
    }),
});
