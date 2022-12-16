import { inferProcedureInput } from "@trpc/server";
import { User } from "@prisma/client";

import { createContextInner } from "src/server/trpc/context";
import { AppRouter, appRouter } from "src/server/trpc/router/index";
import { session } from "src/utils/test-data";

test("Create user", async () => {
  const ctx = await createContextInner({ session });
  const caller = appRouter.createCaller(ctx);

  const input: inferProcedureInput<AppRouter["user"]["createUser"]> = {
    id: session?.user?.id,
    email: session?.user?.email,
    name: session?.user?.name,
    image: session?.user?.image,
  };

  // Check if user exists
  const userExists = await caller.user.getUserByEmail({
    email: input.email as string,
  });

  if (userExists) {
    // Expect user to exist
    expect(userExists).toBeTruthy();
  } else {
    const user = await caller.user.createUser(input);

    expect(user.email).toEqual(input.email);
  }
});

test("Get user by email", async () => {
  const ctx = await createContextInner({ session });

  const caller = appRouter.createCaller(ctx);

  const input: inferProcedureInput<AppRouter["user"]["getUserByEmail"]> = {
    email: "ffdevinmars@gmail.com",
  };

  const user = (await caller.user.getUserByEmail(input)) as User;

  expect(user.email).toEqual(ctx.session?.user?.email);
});

test("Update user name", async () => {
  const ctx = await createContextInner({ session });

  const caller = appRouter.createCaller(ctx);

  const user = (await caller.user.getUserByEmail({
    email: "ffdevinmars@gmail.com",
  })) as User;

  const input: inferProcedureInput<AppRouter["user"]["updateUser"]> = {
    id: user.id,
    name: "Test User",
  };

  const userUpdated = (await caller.user.updateUser(input)) as User;

  expect(userUpdated.name).toEqual(input.name);
});

test("Delete user", async () => {
  const ctx = await createContextInner({ session });

  const caller = appRouter.createCaller(ctx);

  const user = (await caller.user.getUserByEmail({
    email: "ffdevinmars@gmail.com",
  })) as User;

  const input: inferProcedureInput<AppRouter["user"]["deleteUser"]> = {
    email: user.email as string,
  };

  const userDeleted = (await caller.user.deleteUser(input)) as User;

  expect(userDeleted.email).toEqual(input.email);
});
