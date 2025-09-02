import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './components/layout/ThemeProvider'
import AppRoutes from './routes/AppRoutes'
import { Toaster } from 'sonner'

const queryClient = new QueryClient();

function App() {
    return(
        <>
        <QueryClientProvider client={queryClient}>
         <Toaster position="top-center" richColors />
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AppRoutes />
        </ThemeProvider>
        </QueryClientProvider>
        </>
    )
}

export default App
