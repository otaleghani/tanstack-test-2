import { TRPCError } from '@trpc/server'
import { createTRPCRouter, publicProcedure } from './init'
import type { TRPCRouterRecord } from '@trpc/server'
import guitars from '@/data/example-guitars'
import { z } from 'zod'

const guitarRouter = {
  list: publicProcedure.query(async () => guitars),
  byId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const guitar = guitars.find((guitar) => guitar.id === input.id);
      if (!guitar) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return guitar;
    })
} satisfies TRPCRouterRecord

const peopleRouter = {
  list: publicProcedure.query(async () =>
    fetch('https://swapi.dev/api/people')
      .then((res) => res.json())
      .then((d) => d.results as Array<{ name: string }>),
  ),
} satisfies TRPCRouterRecord

export const trpcRouter = createTRPCRouter({
  people: peopleRouter,
  guitar: guitarRouter
})

export type TRPCRouter = typeof trpcRouter
