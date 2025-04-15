// import { generateText } from 'ai';
// import { anthropic } from '@ai-sdk/anthropic';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/zdemo/ai')({
  component: RouteComponent,
  loader: async () => {
    const text = "sus"
    // const { text } = await generateText({
    //   model: anthropic("claude-3-5-sonnet-latest"),
    //   system: 'You are a friendly assistant!',
    //   prompt: 'Why is the sky blue?',
    // });

    console.log(text);

    return {
      data: text
    }
  }
})



function RouteComponent() {
  const { data } = Route.useLoaderData()

  return (
    <>
      <div>Hello "/zdemo/ai"!</div>
      <div>{data}</div>
    </>
  )
}
