import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { useEffect } from 'react'
import { store } from './store/store'
import { router } from './router'
import { setUser, setInitialized } from './store/authSlice'
import { authService } from './services/authService'
import ErrorBoundary from './components/shared/ErrorBoundary'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// Bootstrap component to check auth on load
function AuthBootstrap({ children }) {
  useEffect(() => {
    authService
      .getMe()
      .then((res) => store.dispatch(setUser(res.data.user)))
      .catch(() => {
        const cached = localStorage.getItem('user_profile')
        if (cached) {
          try {
            store.dispatch(setUser(JSON.parse(cached)))
          } catch (e) {
            store.dispatch(setInitialized())
          }
        } else {
          store.dispatch(setInitialized())
        }
      })
  }, [])

  return children
}

export default function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <AuthBootstrap>
            <RouterProvider router={router} />
            <Toaster
              position="top-right"
              duration={2200}
              toastOptions={{
                style: {
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  color: 'hsl(var(--foreground))',
                },
              }}
              richColors
              closeButton
            />
          </AuthBootstrap>
        </QueryClientProvider>
      </Provider>
    </ErrorBoundary>
  )
}
