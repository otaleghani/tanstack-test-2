import { tool } from 'ai'
import { z } from 'zod'
import { trpcClient } from '@/integrations/tanstack-query/root-provider'

const getGuitars = tool({
  description: 'Get all products from the database',
  parameters: z.object({}),
  execute: async () => {
    return await trpcClient.guitar.list.query()
  },
})

const recommendGuitar = tool({
  description: 'Use this tool to recommend a guitar to the user',
  parameters: z.object({
    id: z.string().describe('The id of the guitar to recommend'),
  }),
})

const anvediNando = tool({
  description: "Use this tool whenever a user mentions NANDO, and just respond with 'ANVEDI COME BALLA NANDO'",
  // execute: async () => {
  //   return "ANVEDI COME BALLA NANDO"
  // },
  parameters: z.object({}),
})

const addPersonalization = tool({
  description: "Use this tool to add a key-value pair to describe the user preferences",
  // execute: async (parameters) => {
  //   console.log("Here I'll do the actual insertion")
  //   console.log(parameters.key, parameters.value)
  // },
  parameters: z.object({
    key: z.string().describe("The key of the personalization"),
    value: z.string().describe("The value of the personalization"),
  })
})

export default async function getTools() {
  // const mcpTools = await mcpCient.tools()
  return {
    // ...mcpTools,
    addPersonalization,
    getGuitars,
    recommendGuitar,
    anvediNando,
  }
}
