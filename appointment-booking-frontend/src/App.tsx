import { ThemeProvider } from './components/layout/ThemeProvider'
import AppRoutes from './routes/AppRoutes'
import { Toaster } from 'sonner'

function App() {
    return(
        <>
         <Toaster position="top-center" richColors />
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AppRoutes />
        </ThemeProvider>
        </>
    )
}

export default App
