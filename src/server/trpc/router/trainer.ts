import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { t, authedProcedure } from "../trpc";

export const trainerRouter = t.router({
  createTrainer: authedProcedure
    .input(
      z.object({
        name: z.string().nullish(),
        email: z.string().nullish(),
        image: z.string().nullish(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { name, email, image, userId } }) => {
      const trainer = await ctx.prisma.trainer.create({
        data: {
          name,
          email,
          image,
          userId,
        },
      });

      if (!trainer) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create trainer",
        });
      } else {
        await ctx.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            trainerId: trainer.id,
          },
        });

        return trainer;
      }
    }),
});
