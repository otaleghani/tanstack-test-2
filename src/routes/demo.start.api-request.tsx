import { useEffect, useState } from 'react'

import { ClientOnly, createFileRoute } from '@tanstack/react-router'

function getNames() {
  return fetch('/api/demo-names').then((res) => res.json())
}

export const Route = createFileRoute('/demo/start/api-request')({
  component: Home,
})

function Home() {
  const [names, setNames] = useState<Array<string>>([])
  useEffect(() => {
    getNames().then(setNames)
  }, [])

  return (
    <ClientOnly fallback={<>sus</>}>
      <div className="p-4">
        <div>{names.join(', ')}</div>
      </div>
    </ClientOnly>
  )
}
