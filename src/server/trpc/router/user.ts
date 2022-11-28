import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { t, authedProcedure } from "../trpc";

export const userRouter = t.router({
  getUserByEmail: authedProcedure
    .input(
      z.object({
        email: z.string().nullish(),
      })
    )
    .query(({ ctx, input: { email } }) => {
      if (email) {
        const user = ctx.prisma.user.findUnique({
          where: {
            email: email,
          },
        });

        if (!user) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to find user",
          });
        }

        return user;
      }
    }),

  updateUser: authedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .mutation(({ ctx, input: { id, name } }) => {
      const user = ctx.prisma.user.update({
        where: {
          id,
        },
        data: {
          name,
        },
      });

      return user;
    }),

  deleteUser: authedProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ ctx, input: { email } }) => {
      const user = await ctx.prisma.user.delete({
        where: {
          email,
        },
      });

      // If trainerId is not null, delete trainer
      if (user?.trainerId) {
        const trainer = await ctx.prisma.trainer.delete({
          where: {
            id: user.trainerId,
          },
        });

        return trainer;
      }

      return user;
    }),

  createUser: authedProcedure
    .input(
      z.object({
        id: z.string().nullish(),
        email: z.string().nullable().nullish(),
        name: z.string().nullable().nullish(),
        image: z.string().nullable().nullish(),
      })
    )
    .mutation(({ ctx, input: { id, email, name, image } }) => {
      const user = ctx.prisma.user.create({
        data: {
          id: id as string,
          email,
          name,
          image,
        },
      });

      return user;
    }),
});
