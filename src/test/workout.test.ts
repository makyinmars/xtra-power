/**
 * Integration test example for the `post` router
 */
import { createContextInner } from "src/server/trpc/context";
import { AppRouter, appRouter } from "src/server/trpc/router/index";
import { inferProcedureInput } from "@trpc/server";

test("add greeting and get id", async () => {
  const ctx = await createContextInner({
    session: null,
  });
  const caller = appRouter.createCaller(ctx);

  const input: inferProcedureInput<AppRouter["example"]["hello"]> = {
    text: "hello test",
  };

  const greeting = await caller.example.hello(input);
  const byId = await caller.example.getById({ id: greeting.id });

  expect(byId).toMatchObject(input);
});
