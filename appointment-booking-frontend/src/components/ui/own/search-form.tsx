
import { z } from "zod"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react"
import defaultImage from "@/assets/default.jpg"
import SpecialistSelectorForm from "./specialist-selector(not-used)"
import BaseSearchForm from "./base-search-form"


 let specialists = [
  {
    label: "John Doe",
    value: "john-doe",
    image: defaultImage,
    company: "TechCorp",
    rating: 4.7,
  },
  {
    label: "Anna Smith",
    value: "anna-smith",
    image:  defaultImage,
    company: "HealthPlus",
    rating: 4.9,
  },
  {
    label: "Marco Müller",
    value: "marco-muller",
    image:  defaultImage,
    company: "GreenCare",
    rating: 4.6,
  },
]

let companies = [
  {
    label: "AA",
    value: "aa",
    image: defaultImage,
    rating: 4.7,
  },
  {
    label: "BB",
    value: "bb",
    image:  defaultImage,
    rating: 4.9,
  },
  {
    label: "CC",
    value: "cc",
    image:  defaultImage,
    rating: 4.6,
  },
] 

let places = [
  {
    label: "Pécs",
    value: "pecs",
  },
  {
    label: "Budapest",
    value: "budapest",
  },
  {
    label: "Szeged",
    value: "szeged",
  },
] 


 
export default function SearchForm() {

  const FormSchema = z.object({
    specialist: z.string({
      required_error: "Please select a specialist.",
    }),
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })
 
  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast("Submitted succesfully!")
  }
  
  const [open, setOpen] = useState(false);

  return (
    <>
    <div className="space-y-5">
    <BaseSearchForm title={"Szakember"} type="specialist" options={specialists} onSelect={() => console.log("test")} />
    <BaseSearchForm title={"Üzlet"} type="company" options={companies} onSelect={() => console.log("test")} />
    <BaseSearchForm title={"Hely"} type="place" options={places} onSelect={() => console.log("test")} />
    </div>
    
    </>
  )

}