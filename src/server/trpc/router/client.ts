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
      const clientExist = await ctx.prisma.client.findUnique({
        where: {
          email: email as string,
        },
      });

      if (clientExist) {
        return await ctx.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            clientId: clientExist.id,
          },
        });
      }

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
        email: z.string(),
      })
    )
    .query(async ({ ctx, input: { email } }) => {
      const client = await ctx.prisma.client.findUnique({
        where: {
          email,
        },
      });

      if (client && client.trainerId) {
        const trainer = await ctx.prisma.trainer.findUnique({
          where: {
            id: client.trainerId,
          },
        });

        return trainer;
      }
    }),

  deleteClient: authedProcedure
    .input(
      z.object({
        email: z.string(),
      })
    )
    .mutation(({ ctx, input: { email } }) => {
      return ctx.prisma.client.delete({
        where: {
          email,
        },
      });
    }),
});
