import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useTRPC } from '@/integrations/trpc/react'
import { Client, Account, Databases } from 'appwrite';
import { createServerFn } from '@tanstack/react-start';
import { useEffect } from 'react';

const client = new Client();

client
  .setEndpoint('http://testing-appwrite-8bd71e-162-55-208-228.traefik.me/v1')
  .setProject('67f3dc4300331f625765');

export const Route = createFileRoute('/zdemo/trpc')({
  component: RouteComponent,
})

// const account = new Account(client)
// const promise = await account.createEmailPasswordSession("o.taleghani@talesign.com", "Oliver1997Oli");


const appwriteTest = createServerFn({ method: "GET" })
  .handler(async () => {
    const databases = new Databases(client)
    const list = await databases.listDocuments("67f3e470000c74f747a0", "67f3e4df000b75c70369")

    return list
  })



function RouteComponent() {
  useEffect(() => {
    const channel = "databases.Default.collections.users"
    client.subscribe(channel, (response) => {
      // console.log(response)
    })
  }, [])

  const trpc = useTRPC()
  const { data, status } = useQuery(trpc.guitar.list.queryOptions())
  const { data: appwriteData } = useQuery({
    queryKey: ["sus"],
    queryFn: appwriteTest
  })

  console.log(appwriteData)


  if (status === "pending") {
    return (<>Loading...</>)
  }


  return (
    <>
      {data?.map((guitar) => (
        <div key={guitar.id}>
          {guitar.name}
        </div>
      ))}
    </>
  )
}
