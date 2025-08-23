import { Hourglass } from 'ldrs/react'
import 'ldrs/react/Hourglass.css'


export default function Loader()
{
    
    return (
         <div className="fixed inset-0 flex items-center justify-center z-50">
          <Hourglass size="45" bgOpacity="0.1" speed="1.75" color="#2cc39e" />
         </div>
    )
}