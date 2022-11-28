import { t, authedProcedure } from "../trpc";
import { z } from "zod";

export const setRouter = t.router({
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
    .mutation(async ({ ctx, input: { sets } }) => {
      const updatedSets = await Promise.all(
        sets.map((set) => {
          return ctx.prisma.set.update({
            where: {
              id: set.id,
            },
            data: {
              weight: set.weight,
              reps: set.reps,
            },
          });
        })
      );

      return {
        count: updatedSets.length,
      };
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
