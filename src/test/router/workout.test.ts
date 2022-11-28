/**
 * Integration test example for the `workout` router
 */
import { inferProcedureInput } from "@trpc/server";
import { Workout } from "@prisma/client";

import { createContextInner } from "src/server/trpc/context";
import { AppRouter, appRouter } from "src/server/trpc/router/index";
import { session } from "src/utils/test-data";

test("Create a new workout", async () => {
  const ctx = await createContextInner({ session });
  const caller = appRouter.createCaller(ctx);

  const user = await caller.user.getUserByEmail({
    email: session?.user?.email,
  });

  if (user) {
    const inputWorkout: inferProcedureInput<
      AppRouter["workout"]["createWorkout"]
    > = {
      userId: user.id,
      name: "Test Workout Name",
      description: "Test Workout Description",
    };

    const newWorkout = await caller.workout.createWorkout(inputWorkout);

    expect(newWorkout.name).toEqual(inputWorkout.name);
  }
});

test("Get current user workouts", async () => {
  const ctx = await createContextInner({ session });

  const caller = appRouter.createCaller(ctx);

  const workouts = (await caller.workout.getWorkouts()) as Workout[];

  expect(workouts.length).toBeGreaterThan(0);
});

test("Get single workout by id", async () => {
  const ctx = await createContextInner({ session });

  const caller = appRouter.createCaller(ctx);

  const workouts = (await caller.workout.getWorkouts()) as Workout[];

  if (workouts.length > 0) {
    const input: inferProcedureInput<AppRouter["workout"]["getWorkoutById"]> = {
      id: workouts[0]?.id,
    };

    const workout = await caller.workout.getWorkoutById(input);

    expect(workout?.id).toEqual(workouts[0]?.id);
  }
});

test("Update workout", async () => {
  const ctx = await createContextInner({ session });

  const caller = appRouter.createCaller(ctx);

  const workouts = (await caller.workout.getWorkouts()) as Workout[];

  if (workouts.length > 0) {
    const input: inferProcedureInput<AppRouter["workout"]["updateWorkout"]> = {
      id: workouts[0]?.id as string,
      name: "Test Workout Name Updated",
      description: "Test Workout Description Updated",
    };

    const workout = await caller.workout.updateWorkout(input);

    expect(workout?.name).toEqual(input.name);
  }
});

test("Delete workout by id", async () => {
  const ctx = await createContextInner({ session });

  const caller = appRouter.createCaller(ctx);

  const workouts = (await caller.workout.getWorkouts()) as Workout[];

  if (workouts.length > 0) {
    const input: inferProcedureInput<
      AppRouter["workout"]["deleteWorkoutById"]
    > = {
      id: workouts[0]?.id as string,
    };

    const workout = await caller.workout.deleteWorkoutById(input);

    expect(workout?.id).toEqual(workouts[0]?.id);
  }
});
