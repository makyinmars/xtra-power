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
        },
      });

      if (!trainer) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create trainer",
        });
      } else {
        const trainerUpdated = await ctx.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            trainerId: trainer.id,
          },
        });

        return trainerUpdated;
      }
    }),

  getTrainers: authedProcedure.query(async ({ ctx }) => {
    const trainers = await ctx.prisma.trainer.findMany({
      include: {
        user: true,
      },
    });

    if (!trainers) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get trainers",
      });
    }

    return trainers;
  }),

  getTrainerClients: authedProcedure
    .input(
      z.object({
        trainerId: z.string(),
      })
    )
    .query(({ ctx, input: { trainerId } }) => {
      const clients = ctx.prisma.client.findMany({
        where: {
          trainerId: trainerId,
        },
        include: {
          user: true,
        },
      });

      return clients;
    }),

  deleteTrainer: authedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { id } }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          id,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete trainer",
        });
      }

      const trainer = await ctx.prisma.trainer.delete({
        where: {
          id: user.trainerId as string,
        },
      });

      if (!trainer) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete trainer",
        });
      }
    }),
});
