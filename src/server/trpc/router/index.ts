// src/server/trpc/router/index.ts
import { t } from "../trpc";
import { exampleRouter } from "./example";
import { authRouter } from "./auth";
import { workoutRouter } from "./workout";

export const appRouter = t.router({
  example: exampleRouter,
  auth: authRouter,
  workout: workoutRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
