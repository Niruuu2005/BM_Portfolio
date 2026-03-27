import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/context/AuthContext'
import { queryClient } from '@/lib/queryClient'
import AppRouter from '@/routes/AppRouter'
import ErrorBoundary from '@/components/shared/ErrorBoundary'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ErrorBoundary>
            <AppRouter />
          </ErrorBoundary>
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'toast-surface',
              style: {
                background: 'var(--color-surface)',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border)',
                boxShadow: '0 20px 50px -24px var(--color-shadow)',
              },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)
