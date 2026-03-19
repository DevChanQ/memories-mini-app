import { createRoot } from 'react-dom/client'
import '../index.css'
import { ThemeProvider } from '@/components/theme-provider'
import { HashRouter } from 'react-router'
import { AdminApp } from './admin-app'
console.log('Admin app is running')
const isAllowedHost = () => {
  const host = window.location.host
  return host === 'admin.onememory.xyz' || host.startsWith('localhost') || host.startsWith('127.0.0.1')
}

const root = document.getElementById('root')!

if (!isAllowedHost()) {
  createRoot(root).render(
    <div className="flex items-center justify-center h-screen bg-background text-foreground">
      <p className="text-lg font-medium">Not authorized</p>
    </div>
  )
} else {
  createRoot(root).render(
    <ThemeProvider defaultTheme="dark">
      <HashRouter>
        <AdminApp />
      </HashRouter>
    </ThemeProvider>
  )
}
