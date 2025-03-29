import { ThemeProvider } from './components/layout/ThemeProvider'
import AppRoutes from './routes/AppRoutes'

function App() {
    return(
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AppRoutes />
        </ThemeProvider>
    )
}

export default App
