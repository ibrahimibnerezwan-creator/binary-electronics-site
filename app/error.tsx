'use client'
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="container mx-auto px-4 py-32 space-y-6"><h1 className="text-3xl font-bold">This page could not load</h1><p>Please retry. Your saved information has not been cleared.</p><button onClick={reset} className="rounded-lg bg-primary-500 px-6 py-3 text-black">Try again</button></main>
}
