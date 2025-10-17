import { Outlet } from "react-router-dom";


export default function CompanyLayout()
{

    return(
         <div className="">
            <main className="">
            <Outlet />
            </main>
        </div>
    )
}