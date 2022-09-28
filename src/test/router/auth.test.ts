/**
 * Integration test example for the `auth` router
 */
import { createContextInner } from "src/server/trpc/context";
import { AppRouter, appRouter } from "src/server/trpc/router/index";
import { inferProcedureOutput } from "@trpc/server";

test("Check if user is logged in and get the user's session", async () => {
  const ctx = await createContextInner({
    session: {
      user: {
        id: "1",
      },
      expires: new Date().toDateString(),
    },
  });

  const caller = appRouter.createCaller(ctx);

  const output: inferProcedureOutput<AppRouter["auth"]["getSession"]> = {
    user: {
      id: "1",
    },
    expires: new Date().toDateString(),
  };

  const session = await caller.auth.getSession();

  expect(session).toMatchObject(output);
});

test("Get secret message when logged in", async () => {
  const ctx = await createContextInner({
    session: {
      user: {
        id: "1",
      },
      expires: new Date().toDateString(),
    },
  });

  const caller = appRouter.createCaller(ctx);

  const output: inferProcedureOutput<AppRouter["auth"]["getSecretMessage"]> =
    "You are logged in and can see this secret message!";

  const secretMessage = await caller.auth.getSecretMessage();

  expect(secretMessage).toMatchSnapshot(output)
});
