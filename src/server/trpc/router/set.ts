import { t, authedProcedure } from "../trpc";
import { z } from "zod";

export const setRouter = t.router({
  getSetsByExerciseId: authedProcedure
    .input(
      z.object({
        exerciseId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.set.findMany({
        where: {
          exerciseId: input.exerciseId,
        },
      });
    }),
  createSets: authedProcedure
    .input(
      z.object({
        exerciseId: z.string(),
        sets: z.array(
          z.object({
            weight: z.number(),
            reps: z.number(),
          })
        ),
      })
    )
    .mutation(({ ctx, input: { exerciseId, sets } }) => {
      return ctx.prisma.set.createMany({
        data: sets.map((set) => ({
          exerciseId,
          weight: set.weight,
          reps: set.reps,
        })),
      });
    }),
  updateSets: authedProcedure
    .input(
      z.object({
        sets: z.array(
          z.object({
            id: z.string(),
            weight: z.number(),
            reps: z.number(),
          })
        ),
      })
    )
    .mutation(({ ctx, input: { sets } }) => {
      return ctx.prisma.set.updateMany({
        data: sets.map((set) => ({
          weight: set.weight,
          reps: set.reps,
        })),
        where: {
          id: {
            in: sets.map((set) => set.id),
          },
        },
      });
    }),
  deleteSetById: authedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ ctx, input: { id } }) => {
      return ctx.prisma.set.delete({
        where: {
          id,
        },
      });
    }),
});
