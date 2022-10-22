import { t, authedProcedure } from "../trpc";
import { z } from "zod";

export const workoutRouter = t.router({
  getWorkouts: authedProcedure.query(({ ctx }) => {
    return ctx.prisma.workout.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  getWorkoutById: authedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.workout.findFirst({
        where: {
          id: input.id,
        },
        include: {
          exercises: true,
        },
      });
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
        clientId: z.string(),
        name: z.string(),
        description: z.string(),
      })
    )
    .mutation(({ ctx, input: { clientId, name, description } }) => {
      return ctx.prisma.workout.create({
        data: {
          name,
          description,
          clientId,
        },
      });
    }),
});
