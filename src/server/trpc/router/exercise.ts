import { z } from "zod";

import { t, authedProcedure } from "../trpc";

export const exerciseRouter = t.router({
  getExerciseById: authedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.exercise.findUnique({
        where: {
          id: input.id,
        },
      });
    }),

  updateExercise: authedProcedure
    .input(
      z.object({ id: z.string(), name: z.string(), description: z.string() })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.exercise.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
        },
      });
    }),

  deleteExerciseById: authedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.exercise.delete({
        where: {
          id: input.id,
        },
      });
    }),

  createExercise: authedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        workoutId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.exercise.create({
        data: {
          name: input.name,
          description: input.description,
          workoutId: input.workoutId,
        },
      });
    }),
});
