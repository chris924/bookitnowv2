import { Ring } from 'ldrs/react'
import 'ldrs/react/Ring.css'

export default function Loader()
{
    return (
         <div className="fixed inset-0 flex items-center justify-center z-50">
        <Ring size={50} speed={1.5} bgOpacity={0.25} />
         </div>
    )
}