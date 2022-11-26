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
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User does not exist",
        });
      }

      if (user?.clientId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Client already exists",
        });
      } else {
        // update user with client id
        const userUpdate = await ctx.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            clientId: userId,
          },
        });

        return userUpdate;
      }
    }),

  addTrainer: authedProcedure
    .input(
      z.object({
        clientId: z.string(),
        trainerId: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { clientId, trainerId } }) => {
      // Update the user model with the trainerId and clientId
      const user = await ctx.prisma.user.update({
        where: {
          clientId,
        },

        data: {
          trainer: {
            connect: {
              id: trainerId,
            },
          },
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to add trainer",
        });
      }

      return user;
    }),

  removeTrainer: authedProcedure
    .input(
      z.object({
        clientId: z.string(),
        trainerId: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { clientId, trainerId } }) => {
      // Remove the trainer from the client, if the trainerId matches
      const client = await ctx.prisma.client.update({
        where: {
          id: clientId,
        },
        data: {
          trainerId: null,
        },
      });

      if (!client) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to remove trainer",
        });
      }

      // Remove the client from the trainer, if the clientId matches
      return client;
    }),

  // Fix this function
  getTrainer: authedProcedure
    .input(
      z.object({
        email: z.string().nullable().nullish(),
      })
    )
    .query(async ({ ctx, input: { email } }) => {
      if (email) {
        const client = await ctx.prisma.client.findUnique({
          where: {
            email,
          },
        });

        if (client && client.trainerId) {
          const trainer = await ctx.prisma.trainer.findUnique({
            where: {
              id: client.trainerId as string,
            },
          });
          return trainer;
        }
      }
    }),

  getClient: authedProcedure
    .input(
      z.object({
        email: z.string(),
      })
    )
    .query(({ ctx, input: { email } }) => {
      if (email) {
        const client = ctx.prisma.client.findUnique({
          where: {
            email,
          },
        });

        if (!client) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create client",
          });
        }

        return client;
      }
    }),

  deleteClient: authedProcedure
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

      const client = await ctx.prisma.client.delete({
        where: {
          id: user.clientId as string,
        },
      });

      if (!client) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete trainer",
        });
      }
    }),
});
