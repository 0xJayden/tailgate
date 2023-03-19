import { z } from "zod";
import { procedure, router } from "../trpc";
import { prisma } from "@/utils/prisma";

export const appRouter = router({
  hello: procedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query(({ input }) => {
      return {
        greeting: `hello ${input.text}`,
      };
    }),
  addUser: procedure
    .input(
      z.object({
        address: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const existingUser = await prisma.user.findFirst({
        where: { address: input.address },
      });

      if (existingUser) return;

      const user = await prisma?.user.create({
        data: {
          address: input.address,
          // timeEntered: new Date().getTime(),
          // room: { connect: { id: 1 } },
        },
      });

      return {
        success: "true",
      };
    }),
  removeUser: procedure
    .input(z.object({ address: z.string() }))
    .mutation(async ({ input }) => {
      const user = await prisma.user.findFirst({
        where: { address: input.address },
      });

      const id = user?.id;

      if (!id) return;
      await prisma.user.delete({
        where: {
          id,
        },
      });
    }),
  getUsers: procedure.query(async () => {
    const users = await prisma.user.findMany();
    return { users };
  }),
  sendMessage: procedure
    .input(z.object({ address: z.string(), message: z.string() }))
    .mutation(async ({ input }) => {
      await prisma.message.create({
        data: {
          userAddress: input.address,
          message: input.message,
          room: { connect: { id: 1 } },
        },
      });
    }),
});

export type AppRouter = typeof appRouter;
