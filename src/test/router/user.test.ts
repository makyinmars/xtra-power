import { createContextInner } from "src/server/trpc/context";
import { AppRouter, appRouter } from "src/server/trpc/router/index";
import { inferProcedureInput } from "@trpc/server";
import { User } from "@prisma/client";

const session = {
  user: {
    id: "1",
    name: "Test User",
    email: "test@gmail.com",
  },
  expires: new Date().toDateString(),
};

test("Create a user and retrieve the new user", async () => {
  const ctx = await createContextInner({
    session: session,
  });

  const caller = appRouter.createCaller(ctx);

  const input: inferProcedureInput<AppRouter["user"]["createUser"]> = {
    name: "test",
    email: "jonDoe@gmail.com",
    type: "Trainer",
  };

  const user = await caller.user.createUser(input);

  const newUser = (await caller.user.getUserByEmail({
    email: user.email,
  })) as User;

  expect(user).toMatchObject(newUser);
});

test("Update a user and retrieve the updated user", async () => {
  const ctx = await createContextInner({
    session: session,
  });

  const caller = appRouter.createCaller(ctx);

  const input: inferProcedureInput<AppRouter["user"]["createUser"]> = {
    name: "test",
    email: "janeDoe@gmail.com",
    type: "Trainer",
  };

  const newUser = await caller.user.createUser(input);

  const updateInput: inferProcedureInput<AppRouter["user"]["updateUser"]> = {
    id: newUser.id,
    name: "test2",
    type: "Trainee",
  };

  const updatedUser = await caller.user.updateUser(updateInput);

  const user = (await caller.user.getUserByEmail({
    email: updatedUser.email,
  })) as User;

  expect(updatedUser).toMatchObject(user);
});

test("Delete a user", async () => {
  const ctx = await createContextInner({
    session: session,
  });

  const caller = appRouter.createCaller(ctx);

  const input: inferProcedureInput<AppRouter["user"]["createUser"]> = {
    name: "test",
    email: "franklin@gmail.com",
    type: "Trainer",
  };

  const newUser = await caller.user.createUser(input);

  const deletedUser = await caller.user.deleteUser({ id: newUser.id });

  expect(deletedUser).toMatchObject(newUser);
});
