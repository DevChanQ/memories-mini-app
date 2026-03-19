import { createContext, useContext, useState, type ReactNode } from 'react'
import { Routes, Route, Navigate } from 'react-router'
import { LoginPage } from './login-page'
import { DashboardPage } from './dashboard-page'

interface AuthContextType {
  apiKey: string | null
  login: (key: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  apiKey: null,
  login: () => {},
  logout: () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

function AuthProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKey] = useState<string | null>(
    () => sessionStorage.getItem('admin-api-key')
  )

  const login = (key: string) => {
    sessionStorage.setItem('admin-api-key', key)
    setApiKey(key)
  }

  const logout = () => {
    sessionStorage.removeItem('admin-api-key')
    setApiKey(null)
  }

  return (
    <AuthContext.Provider value={{ apiKey, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { apiKey } = useAuth()
  if (!apiKey) return <Navigate to="/" replace />
  return <>{children}</>
}

export function AdminApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  )
}
