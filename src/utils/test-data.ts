import { Session } from "next-auth";

export const generateRandomEmail = () => {
  return `${Math.random().toString(36).substring(7)}@example.com`;
};

export const generateRandomName = () => {
  return Math.random().toString(36).substring(7);
};

export const session: Session | null = {
  user: {
    id: "clb060a4x000n1imyz7olx08s",
    email: "ffdevinmars@gmail.com",
    image:
      "https://lh3.googleusercontent.com/a/ALm5wu0xITvq1unyMDM_0SCHaFkc2TSJ2Py-VUKHmNw0=s96-c",
  },
  expires: "2024-09-01T21:00:00.000Z",
};
