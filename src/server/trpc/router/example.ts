import { t } from "../trpc";
import { z } from "zod";

export const exampleRouter = t.router({
  hello: t.procedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
        id: "123",
      };
    }),
  getAll: t.procedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),
  getById: t.procedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.example.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
});
