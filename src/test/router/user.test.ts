import { createContextInner } from "src/server/trpc/context";
import { AppRouter, appRouter } from "src/server/trpc/router/index";
import { inferProcedureInput } from "@trpc/server";
import { User } from "@prisma/client";

test("Create a user and retrieve the new user", async () => {
  const session = {
    user: {
      id: "1",
      name: "Test User",
      email: "test-1@gmail.com",
    },
    expires: new Date().toDateString(),
  };

  const ctx = await createContextInner({
    session: session,
  });

  const caller = appRouter.createCaller(ctx);

  const input: inferProcedureInput<AppRouter["user"]["createUser"]> = {
    name: "test",
    email: "jonDoe@gmail.com",
  };

  const user = await caller.user.createUser(input);

  const newUser = (await caller.user.getUserByEmail({
    email: user.email as string,
  })) as User;

  expect(user).toMatchObject(newUser);

  await caller.user.deleteUser({ id: newUser.id });
});

test("Update a user and retrieve the updated user", async () => {
  const session = {
    user: {
      id: "2",
      name: "Test User",
      email: "test-2@gmail.com",
    },
    expires: new Date().toDateString(),
  };
  const ctx = await createContextInner({
    session: session,
  });

  const caller = appRouter.createCaller(ctx);

  const input: inferProcedureInput<AppRouter["user"]["createUser"]> = {
    name: "test",
    email: "janeDoe@gmail.com",
  };

  const newUser = await caller.user.createUser(input);

  const updateInput: inferProcedureInput<AppRouter["user"]["updateUser"]> = {
    id: newUser.id,
    name: "test2",
  };

  const updatedUser = await caller.user.updateUser(updateInput);

  const user = (await caller.user.getUserByEmail({
    email: updatedUser.email as string,
  })) as User;

  expect(updatedUser).toMatchObject(user);

  await caller.user.deleteUser({ id: newUser.id });
});

test("Delete a user", async () => {
  const session = {
    user: {
      id: "3",
      name: "Test User",
      email: "test-3@gmail.com",
    },
    expires: new Date().toDateString(),
  };

  const ctx = await createContextInner({
    session: session,
  });

  const caller = appRouter.createCaller(ctx);

  const input: inferProcedureInput<AppRouter["user"]["createUser"]> = {
    name: "test",
    email: "franklin@gmail.com",
  };

  const newUser = await caller.user.createUser(input);

  const deletedUser = await caller.user.deleteUser({ id: newUser.id });

  expect(deletedUser).toMatchObject(newUser);
});
