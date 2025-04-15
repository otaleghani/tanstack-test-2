import { createFileRoute } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

export const Route = createFileRoute('/zdemo/form-query')({
  component: RouteComponent,
  // To have default values you'll basically use a loader to fetch them before redering
  loader: async () => {
    const data = await fetch("https://jsonplaceholder.typicode.com/posts/1")
      .then((res) => res.json())
      .then((json) => { return json })
    console.log(data)
    return {
      data
    }
  }
})

const DataSchema = z.object({
  name: z.string(),
  surname: z.string(),
})

export const handleServerSubmit = createServerFn({ method: "POST" })
  .validator(DataSchema)
  .handler(async ({ data }) => {
    console.log(data)
  })

function RouteComponent() {
  const { data } = Route.useLoaderData();

  // console.log(data)
  const form = useForm({
    defaultValues: {
      name: data?.id ?? "",
      surname: data?.userId ?? "",
    },

    onSubmit: async ({ formApi, value }) => {
      console.log("Submitting...");
      console.log(value.name);
      await handleServerSubmit({ data: value })
      formApi.reset();
    }
  })

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.Field
          name='name'
          children={(field) => {
            return (
              <div>
                <label htmlFor={field.name}>First Name:</label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )
          }}
        />
        <form.Field
          name='surname'
          children={(field) => {
            return (
              <div>
                <label htmlFor={field.name}>First Name:</label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )
          }}
        />
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <>
              <button type="submit" disabled={!canSubmit}>
                {isSubmitting ? '...' : 'Submit'}
              </button>
              <button type="reset" onClick={() => form.reset()}>
                Reset
              </button>
            </>
          )}
        />
      </form>
    </div>
  )
}
