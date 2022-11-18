import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { t } from "../trpc";

export const sessionRouter = t.router({
  getSession: t.procedure
    .input(
      z.object({
        email: z.string().nullish(),
      })
    )
    .query(({ ctx, input: { email } }) => {
      if (email) {
        return ctx.session;
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to find user",
        });
      }
    }),
});
