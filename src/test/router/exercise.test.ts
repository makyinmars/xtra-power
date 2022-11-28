/**
 * Integration test for the `exercise` router
 */
import { inferProcedureInput } from "@trpc/server";
import { Workout } from "@prisma/client";

import { createContextInner } from "src/server/trpc/context";
import { AppRouter, appRouter } from "src/server/trpc/router/index";
import { session } from "src/utils/test-data";

test("Create new exercise", async () => {
  const ctx = await createContextInner({ session });

  const caller = appRouter.createCaller(ctx);

  const workouts = (await caller.workout.getWorkouts()) as Workout[];

  if (workouts) {
    const inputExercise: inferProcedureInput<
      AppRouter["exercise"]["createExercise"]
    > = {
      name: "Test Exercise Name",
      description: "Test Exercise Description",
      workoutId: workouts[0]?.id as string,
    };

    const newExercise = await caller.exercise.createExercise(inputExercise);

    expect(newExercise.name).toEqual(inputExercise.name);
  }
});

test("Get single exercise by id", async () => {
  const ctx = await createContextInner({ session });

  const caller = appRouter.createCaller(ctx);

  const workouts = (await caller.workout.getWorkouts()) as Workout[];

  if (workouts) {
    const workout = await caller.workout.getWorkoutById({
      id: workouts[0]?.id,
    });

    const input: inferProcedureInput<AppRouter["exercise"]["getExerciseById"]> =
      {
        id: workout?.exercises[0]?.id as string,
      };

    const exercise = await caller.exercise.getExerciseById(input);

    expect(exercise?.id).toEqual(input.id);
  }
});

test("Update exercise", async () => {
  const ctx = await createContextInner({ session });

  const caller = appRouter.createCaller(ctx);

  const workouts = (await caller.workout.getWorkouts()) as Workout[];

  if (workouts) {
    const workout = await caller.workout.getWorkoutById({
      id: workouts[0]?.id,
    });

    const input: inferProcedureInput<AppRouter["exercise"]["updateExercise"]> =
      {
        id: workout?.exercises[0]?.id as string,
        name: "Updated Exercise Name",
        description: "Updated Exercise Description",
      };

    const updatedExercise = await caller.exercise.updateExercise(input);

    expect(updatedExercise.name).toEqual(input.name);
  }
});

test("Delete exercise by id", async () => {
  const ctx = await createContextInner({ session });

  const caller = appRouter.createCaller(ctx);

  const workouts = (await caller.workout.getWorkouts()) as Workout[];

  if (workouts) {
    const workout = await caller.workout.getWorkoutById({
      id: workouts[0]?.id,
    });

    const input: inferProcedureInput<
      AppRouter["exercise"]["deleteExerciseById"]
    > = {
      id: workout?.exercises[0]?.id as string,
    };

    const deletedExercise = await caller.exercise.deleteExerciseById(input);

    expect(deletedExercise.id).toEqual(input.id);
  }
});
