import { lazy, Suspense, type ReactNode } from 'react'
import { createBrowserRouter } from 'react-router-dom'

// const Home = lazy(async () => ({ default: (await import('../views/home.tsx')).Home }))

function lazyLoad(importFunc: () => Promise<{ default: React.ComponentType<any> }>) {
  const LazyComponent = lazy(importFunc)
  return withSuspense(<LazyComponent />)
}

function withSuspense(element: ReactNode) {
  return <Suspense fallback={<div>loading...</div>}>{element}</Suspense>
}

export const router = createBrowserRouter([
  // {
  //   path: '/',
  //   element: withSuspense(<Home />),
  // },
])
