import { t } from "../trpc";
import { z } from "zod";

export const workoutRouter = t.router({
  getWorkouts: t.procedure.query(({ ctx }) => {
    return ctx.prisma.workout.findMany();
  }),
  getWorkoutById: t.procedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.workout.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
  updateWorkout: t.procedure
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
  deleteWorkoutById: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.workout.delete({
        where: {
          id: input.id,
        },
      });
    }),
  createWorkout: t.procedure
    .input(z.object({ name: z.string(), description: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.workout.create({
        data: {
          name: input.name,
          description: input.description,
        },
      });
    }),
});
