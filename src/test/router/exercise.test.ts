/**
 * Integration test for the `exercise` router
 */
import { createContextInner } from "src/server/trpc/context";
import { AppRouter, appRouter } from "src/server/trpc/router/index";
import { inferProcedureInput } from "@trpc/server";
import { Exercise } from "@prisma/client";

const workoutId = "cl97nb1ku01972j1i1ecsn83i";

const session = {
  user: {
    id: "cl8nn3l6a00061o1ibqq3gixi",
    name: "Franklin",
    email: "makyfj@hotmail.com",
  },
  expires: new Date().toDateString(),
};

test("Create an exercise and retrieve new exercise", async () => {
  const ctx = await createContextInner({
    session: session,
  });

  const caller = appRouter.createCaller(ctx);

  const input: inferProcedureInput<AppRouter["exercise"]["createExercise"]> = {
    name: "Dumbbell Bench Press",
    description: "Best exercise for chest",
    workoutId: workoutId,
  };

  const newExercise = await caller.exercise.createExercise(input);

  const exercise = (await caller.exercise.getExerciseById({
    id: newExercise.id,
  })) as Exercise;

  expect(newExercise).toMatchObject(exercise);
});
