import { formOptions, mergeForm, useForm, useTransform } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { createServerValidate, getFormData, ServerValidateError } from '@tanstack/react-form/start'
import { useStore } from '@tanstack/react-store'
import { setResponseStatus } from '@tanstack/react-start/server'

const getFormDataFromServer = createServerFn({ method: "GET" }).handler(async () => {
  return getFormData();
})

export const Route = createFileRoute('/zdemo/form')({
  component: RouteComponent,
  loader: async () => ({
    state: await getFormDataFromServer()
  })
})

const formOpt = formOptions({
  defaultValues: {
    firstName: "",
    lastName: "",
    email: ""
  }
})

const serverValidate = createServerValidate({
  ...formOpt,
  onServerValidate: ({ value }) => {
    console.log(value.lastName)
    if (value.lastName === "NANDO") {
      return "Server validation: You cannot place NANDO"
    }
  }
})

export const hadleForm = createServerFn({
  method: "POST",
  response: "full"
})
  .validator((data: unknown) => {
    if (!(data instanceof FormData)) {
      throw new Error("Invalid form data")
    }
    console.log(data)
    return data
  })
  .handler(async (ctx) => {
    try {
      const validatedData = await serverValidate(ctx.data)
      console.log("Validated data: ", validatedData)
    } catch (e) {
      if (e instanceof ServerValidateError) {
        return e.response
      }
      console.log(e)
      setResponseStatus(500)
      return "There was an internal error"
    }
    return "Form submitted successfully"
  })


function RouteComponent() {
  const { state } = Route.useLoaderData();

  const form = useForm({
    ...formOpt,
    transform: useTransform((baseForm) => mergeForm(baseForm, state), [state]),
    // onSubmit: async ({ value }) => {
    //   console.log(value)
    // }
  })

  const formErrors = useStore(form.store, (formState) => formState.errors)

  return (
    <form action={hadleForm.url} method='post' encType='multipart/form-data'>
      {formErrors.map((error) => (
        <p key={error as never as string}>{error}</p>
      ))}
      <form.Field
        name="firstName"
        children={(field) => {
          return <div>
            <label htmlFor={field.name} className="block">{field.name}</label>
            <input
              id={field.name}
              name={field.name}
              type='text'
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </div>
        }}
      />
      <form.Field
        name='lastName'
        children={(field) => {
          return (
            <div>
              <label htmlFor={field.name} className="block">{field.name}</label>
              <input
                id={field.name}
                name={field.name}
                type='text'
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )
        }}
      />
      <form.Subscribe
        selector={(formState) => [formState.canSubmit, formState.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <button type="submit" disabled={!canSubmit}>
            {isSubmitting ? '...' : 'Submit'}
          </button>
        )}
      </form.Subscribe>
    </form>
  )
}
