import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { t, authedProcedure } from "../trpc";

export const workoutRouter = t.router({
  getWorkouts: authedProcedure.query(async ({ ctx }) => {
    if (ctx.session.user) {
      const user = await ctx.prisma.user.findUnique({
        where: {
          email: ctx.session.user.email as string,
        },
      });

      return await ctx.prisma.workout.findMany({
        where: {
          userId: user?.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }
  }),
  getWorkoutById: authedProcedure
    .input(z.object({ id: z.string().nullable().nullish() }))
    .query(({ ctx, input: { id } }) => {
      if (id) {
        return ctx.prisma.workout.findFirst({
          where: {
            id,
          },
          include: {
            exercises: true,
          },
        });
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Workout does not exist",
        });
      }
    }),
  updateWorkout: authedProcedure
    .input(
      z.object({ id: z.string(), name: z.string(), description: z.string() })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.workout.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
        },
      });
    }),
  deleteWorkoutById: authedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.workout.delete({
        where: {
          id: input.id,
        },
      });
    }),
  createWorkout: authedProcedure
    .input(
      z.object({
        userId: z.string(),
        name: z.string(),
        description: z.string(),
      })
    )
    .mutation(({ ctx, input: { userId, name, description } }) => {
      return ctx.prisma.workout.create({
        data: {
          name,
          description,
          userId,
        },
      });
    }),
});
