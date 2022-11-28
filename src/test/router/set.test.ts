/**
 * Integration test for the `exercise` router
 */
import { inferProcedureInput } from "@trpc/server";
import { Workout } from "@prisma/client";

import { createContextInner } from "src/server/trpc/context";
import { AppRouter, appRouter } from "src/server/trpc/router/index";
import { session } from "src/utils/test-data";

test("Create new sets", async () => {
  const ctx = await createContextInner({ session });

  const caller = appRouter.createCaller(ctx);

  const workouts = (await caller.workout.getWorkouts()) as Workout[];

  if (workouts) {
    const workout = await caller.workout.getWorkoutById({
      id: workouts[0]?.id,
    });

    const input: inferProcedureInput<AppRouter["set"]["createSets"]> = {
      exerciseId: workout?.exercises[0]?.id as string,
      sets: [
        {
          weight: 100,
          reps: 10,
        },
        {
          weight: 200,
          reps: 20,
        },
      ],
    };

    const newSets = await caller.set.createSets(input);

    expect(newSets.count).toEqual(input.sets.length);
  }
});

test("Get sets by exercise id", async () => {
  const ctx = await createContextInner({ session });

  const caller = appRouter.createCaller(ctx);

  const workouts = (await caller.workout.getWorkouts()) as Workout[];

  if (workouts) {
    const workout = await caller.workout.getWorkoutById({
      id: workouts[0]?.id,
    });

    const input: inferProcedureInput<AppRouter["set"]["getSetsByExerciseId"]> =
      {
        exerciseId: workout?.exercises[0]?.id as string,
      };

    const sets = await caller.set.getSetsByExerciseId(input);

    expect(sets.length).toEqual(2);
  }
});

test("Update sets", async () => {
  const ctx = await createContextInner({ session });

  const caller = appRouter.createCaller(ctx);

  const workouts = (await caller.workout.getWorkouts()) as Workout[];

  if (workouts) {
    const workout = await caller.workout.getWorkoutById({
      id: workouts[0]?.id,
    });

    const sets = await caller.set.getSetsByExerciseId({
      exerciseId: workout?.exercises[0]?.id as string,
    });

    const input: inferProcedureInput<AppRouter["set"]["updateSets"]> = {
      sets: [
        {
          id: sets[0]?.id as string,
          weight: 100,
          reps: 10,
        },
        {
          id: sets[1]?.id as string,
          weight: 200,
          reps: 20,
        },
      ],
    };

    const updatedSets = await caller.set.updateSets(input);

    expect(updatedSets.count).toEqual(input.sets.length);
  }
});

test("Delete set by id", async () => {
  const ctx = await createContextInner({ session });

  const caller = appRouter.createCaller(ctx);

  const workouts = (await caller.workout.getWorkouts()) as Workout[];

  if (workouts) {
    const workout = await caller.workout.getWorkoutById({
      id: workouts[0]?.id,
    });

    const sets = await caller.set.getSetsByExerciseId({
      exerciseId: workout?.exercises[0]?.id as string,
    });

    const input: inferProcedureInput<AppRouter["set"]["deleteSetById"]> = {
      id: sets[0]?.id as string,
    };

    const deletedSet = await caller.set.deleteSetById(input);

    expect(deletedSet.id).toEqual(input.id);
  }
});
