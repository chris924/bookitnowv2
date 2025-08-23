
import { Hourglass } from 'ldrs/react'
import 'ldrs/react/Hourglass.css'

export default function Loader()
{
    
    return (
         <div className="fixed inset-0 flex items-center justify-center z-50">
       <Hourglass size="60" bgOpacity="0.1" speed="2" color="green" />
         </div>
    )
}