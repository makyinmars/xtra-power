import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { t, authedProcedure } from "../trpc";
import { User } from "@prisma/client";

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
        email: z.string(),
      })
    )
    .mutation(({ ctx, input: { email } }) => {
      return ctx.prisma.trainer.delete({
        where: {
          email,
        },
      });
    }),
});
