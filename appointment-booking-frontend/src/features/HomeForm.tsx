import SearchForm from "@/components/ui/own/search-form";


export default function HomeForm()
{
    return(
        <>
        <div className="text-3xl md:text-6xl text-center mt-24">
        <p>Foglalj időpontot profikhoz,</p>
       

        </div>
        <div className="text-3xl md:text-6xl text-center pt-3.5 pb-20 ">
        <p>még ma!</p>
        </div>
        
        <div className="flex justify-center">
        <SearchForm/>
        </div>
       
        </>
    )
}