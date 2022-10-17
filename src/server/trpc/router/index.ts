// src/server/trpc/router/index.ts
import { t } from "../trpc";
import { exampleRouter } from "./example";
import { authRouter } from "./auth";
import { workoutRouter } from "./workout";
import { userRouter } from "./user";
import { exerciseRouter } from "./exercise";
import { setRouter } from "./set";

export const appRouter = t.router({
  example: exampleRouter,
  auth: authRouter,
  workout: workoutRouter,
  exercise: exerciseRouter,
  set: setRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
