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

  getTrainers: authedProcedure.query(({ ctx }) => {
    const trainers = ctx.prisma.trainer.findMany({});

    if (!trainers) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get trainers",
      });
    }

    return trainers;
  }),

  getMyClients: authedProcedure
    .input(
      z.object({
        email: z.string().nullable().nullish(),
      })
    )
    .query(async ({ ctx, input: { email } }) => {
      const trainer = await ctx.prisma.trainer.findUnique({
        where: {
          email: email as string,
        },
      });

      // Get the clients that clientId is not null and trainerId is the same as the trainer's id
      const myClients = await ctx.prisma.user.findMany({
        where: {
          clientId: {
            not: null,
          },
          trainerId: trainer?.id,
        },
      });

      return myClients;
    }),

  getClients: authedProcedure.query(({ ctx }) => {
    const clients = ctx.prisma.user.findMany({
      where: {
        clientId: {
          not: null,
        },
      },
    });

    return clients;
  }),
  removeClient: authedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { userId } }) => {
      const trainer = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id as string,
        },
        select: {
          trainerId: true,
        },
      });

      const client = await ctx.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          clientId: null,
        },
      });

      console.log("Client id", client);

      await ctx.prisma.trainer.update({
        where: {
          id: trainer?.trainerId as string,
        },
        data: {
          users: {
            disconnect: {
              id: userId,
            },
          },
        },
      });

      return client;
    }),

  addClient: authedProcedure
    .input(
      z.object({
        userId: z.string(),
        clientId: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { userId, clientId } }) => {
      const trainer = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id as string,
        },
        select: {
          trainerId: true,
        },
      });

      const client = await ctx.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          clientId: clientId,
          trainer: {
            connect: {
              id: trainer?.trainerId as string,
            },
          },
        },
      });

      return client;
    }),
});
