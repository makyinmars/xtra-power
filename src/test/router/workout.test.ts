/**
 * Integration test example for the `workout` router
 */
import { createContextInner } from "src/server/trpc/context";
import { AppRouter, appRouter } from "src/server/trpc/router/index";
import { inferProcedureInput } from "@trpc/server";
import { Workout } from "@prisma/client";

const session = {
  user: {
    id: "1",
    name: "Test User",
    email: "test@gmail.com",
  },
  expires: new Date().toDateString(),
};

test("Create a workout and retrieve new workout", async () => {
  const ctx = await createContextInner({
    session: session,
  });

  const caller = appRouter.createCaller(ctx);

  const input: inferProcedureInput<AppRouter["workout"]["createWorkout"]> = {
    name: "test",
    description: "test",
  };

  const newWorkout = await caller.workout.createWorkout(input);

  const workout = (await caller.workout.getWorkoutById({
    id: newWorkout.id,
  })) as Workout;

  expect(newWorkout).toMatchObject(workout);
});

test("Update a workout and retrieve the updated workout", async () => {
  const ctx = await createContextInner({
    session: session,
  });

  const caller = appRouter.createCaller(ctx);

  const input: inferProcedureInput<AppRouter["workout"]["createWorkout"]> = {
    name: "test",
    description: "test",
  };

  const newWorkout = await caller.workout.createWorkout(input);

  const updateInput: inferProcedureInput<
    AppRouter["workout"]["updateWorkout"]
  > = {
    id: newWorkout.id,
    name: "test2",
    description: "test2",
  };

  const updatedWorkout = await caller.workout.updateWorkout(updateInput);

  const workout = (await caller.workout.getWorkoutById({
    id: updatedWorkout.id,
  })) as Workout;

  expect(updatedWorkout).toMatchObject(workout);
});

test("Delete a workout", async () => {
  const ctx = await createContextInner({
    session: session,
  });
  const caller = appRouter.createCaller(ctx);

  const input: inferProcedureInput<AppRouter["workout"]["createWorkout"]> = {
    name: "test",
    description: "test",
  };

  const newWorkout = await caller.workout.createWorkout(input);

  const deletedWorkout = await caller.workout.deleteWorkoutById({
    id: newWorkout.id,
  });

  expect(deletedWorkout).toMatchObject(newWorkout);
});
