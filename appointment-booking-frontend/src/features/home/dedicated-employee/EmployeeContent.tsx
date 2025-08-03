import { getSpecificEmployeeContent } from "@/api/employee"
import { useEffect } from "react"
import { useParams } from "react-router-dom";


export default function EmployeeContent()
{
     const { slug } = useParams();


    useEffect( () => {


        const fetchEmployeeConntent = async () => {

            try{
                if (!slug) {
                    console.error("No slug provided in URL parameters.");
                    return;
                }

                const employeeContent = await getSpecificEmployeeContent(slug);
                console.log("Employee Content:", employeeContent);
            }catch (error) {
                console.error("Error fetching employee content:", error);
            }


        }
       
        fetchEmployeeConntent();

    }, [])


    return(
        <div>TEST</div>
    )
}