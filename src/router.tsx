import { createRouter as createTanstackRouter } from '@tanstack/react-router'
import { routerWithQueryClient } from '@tanstack/react-router-with-query'
import * as TanstackQuery from './integrations/tanstack-query/root-provider'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import './styles.css'
import { dehydrate, hydrate } from '@tanstack/react-query'

// Create a new router instance
export const createRouter = () => {
  const router = routerWithQueryClient(
    createTanstackRouter({
      routeTree,
      context: {
        ...TanstackQuery.getContext(),
      },
      scrollRestoration: true,
      defaultPreloadStaleTime: 0,
      dehydrate: () => {
        return {
          queryClientState: dehydrate(TanstackQuery.getContext().queryClient)
        }
      },
      hydrate: (dehydrate) => {
        hydrate(TanstackQuery.getContext().queryClient, dehydrate.queryClientState)
      },
      Wrap: (props: { children: React.ReactNode }) => {
        return <TanstackQuery.Provider>{props.children}</TanstackQuery.Provider>
      },
    }),
    TanstackQuery.getContext().queryClient,
  )

  return router
}

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
