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

  getUser: authedProcedure.query(({ ctx }) => {
    const { session, prisma } = ctx;
    if (session && session.user) {
      const email = session.user.email as string;
      return prisma.user.findUnique({
        where: {
          email,
        },
      });
    }
  }),

  createUser: authedProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
      })
    )
    .mutation(({ ctx, input: { name, email } }) => {
      const user = ctx.prisma.user.create({
        data: {
          name: name,
          email: email,
        },
      });

      return user;
    }),

  updateTypeUser: authedProcedure
    .input(
      z.object({
        id: z.string(),
        clientId: z.string().nullable(),
        trainerId: z.string().nullable(),
      })
    )
    .mutation(({ ctx, input: { id, clientId, trainerId } }) => {
      if (clientId) {
        const updatedUser = ctx.prisma.user.update({
          where: {
            id,
          },
          data: {
            clientId,
          },
        });
        return updatedUser;
      } else {
        const updatedUser = ctx.prisma.user.update({
          where: {
            id,
          },
          data: {
            trainerId,
          },
        });
        return updatedUser;
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
});
