import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { t, authedProcedure } from "../trpc";

export const clientRouter = t.router({
  createClient: authedProcedure
    .input(
      z.object({
        name: z.string().nullable(),
        email: z.string().nullable(),
        image: z.string().nullable(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { name, email, image, userId } }) => {
      const client = await ctx.prisma.client.create({
        data: {
          name,
          email,
          image,
          userId,
        },
      });

      if (!client) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create client",
        });
      } else {
        // Update the user's client Id
        await ctx.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            clientId: client.id,
          },
        });

        return client;
      }
    }),

  addTrainer: authedProcedure
    .input(
      z.object({
        userId: z.string(),
        trainerId: z.string(),
      })
    )
    .mutation(({ ctx, input: { userId, trainerId } }) => {
      const clientUpdate = ctx.prisma.client.update({
        where: {
          userId: userId,
        },
        data: {
          trainerId: trainerId,
        },
      });

      const trainerUpdate = ctx.prisma.trainer.update({
        where: {
          id: trainerId,
        },
        data: {
          clients: {
            connect: {
              userId: userId,
            },
          },
        },
      });

      return Promise.all([clientUpdate, trainerUpdate]);
    }),

  getTrainer: authedProcedure
    .input(
      z.object({
        trainerId: z.string(),
      })
    )
    .query(({ ctx, input: { trainerId } }) => {
      const trainer = ctx.prisma.trainer.findUnique({
        where: {
          id: trainerId,
        },
        include: {
          clients: true,
        },
      });

      return trainer;
    }),
});
