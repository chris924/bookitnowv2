import { Moon, Sun } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/layout/ThemeProvider"
 
export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  function ToggleTheme()
  {
    if(theme == "light")
    {
        setTheme("dark")
    }
    else if(theme == "dark")
    {
        setTheme("light")
    }

  }
 
  return (
          <Button variant="outline" size="icon" onClick={() => ToggleTheme()} className="md:h-12 md:w-12 rounded-3xl"  >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
  )
}