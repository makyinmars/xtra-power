/**
 * Integration test example for the `example` router
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

  const hello = await caller.example.hello(input);
  const byId = await caller.example.getById({
    id: hello.id,
    text: hello.greeting,
  });

  expect(byId).toMatchObject(input);
});
