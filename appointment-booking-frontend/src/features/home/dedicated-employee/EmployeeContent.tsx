import { getSpecificEmployeeContent } from "@/api/employee"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { SpecialistPageDTO } from "@/lib/specialist-types";
import EmployeeServicesTable from "./components/EmployeeServices";
import EmployeeDetails from "./components/EmployeeDetails";


export default function EmployeeContent()
{
     const { slug } = useParams();

     const [employeeData, setEmployeeData] = useState<SpecialistPageDTO | undefined>();


    useEffect( () => {


        const fetchEmployeeConntent = async () => {

            try{
                if (!slug) {
                    console.error("No slug provided in URL parameters.");
                    return;
                }

                const employeeContent = await getSpecificEmployeeContent(slug);
                console.log("Employee Content:", employeeContent);
                setEmployeeData(employeeContent);
                
            }catch (error) {
                console.error("Error fetching employee content:", error);
            }

            console.log("Employee data:", employeeData);
        }
       
        fetchEmployeeConntent();

    }, [])


    return(
        <>
        {employeeData && <EmployeeDetails employeeData={employeeData.employeeGetResponseDTO} />}
        {employeeData &&  <EmployeeServicesTable employeeServices={employeeData.employeeServices}/>}
        </>
    )
}