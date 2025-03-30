import {  Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList } from "../command"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../popover"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "../form"


import { z } from "zod"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown } from "lucide-react"
import { useForm } from "react-hook-form"
import { Button } from "../button"
import { cn } from "@/lib/utils"
import { useState } from "react"


const specialists = [
  {
    label: "John Doe",
    value: "john-doe",
    image: "/images/john.jpg",
    company: "TechCorp",
    rating: 4.7,
  },
  {
    label: "Anna Smith",
    value: "anna-smith",
    image: "/images/anna.jpg",
    company: "HealthPlus",
    rating: 4.9,
  },
  {
    label: "Marco Müller",
    value: "marco-muller",
    image: "/images/marco.jpg",
    company: "GreenCare",
    rating: 4.6,
  },
] as const;
 
const FormSchema = z.object({
  specialist: z.string({
    required_error: "Please select a specialist.",
  }),
})
 
export default function SearchForm() {

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })
 
  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast("Submitted succesfully!")
  }
  
  const [open, setOpen] = useState(false);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FormField
          control={form.control}
          name="specialist"
          render={({ field }) => {
            const selected = specialists.find((s) => s.value === field.value);

            return (
              <FormItem className="flex flex-col">
                <FormLabel>Szakember</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-[300px] justify-between h-10 text-1xl",
                          !field.value && "text-muted-foreground"
                        )}
                        onClick={() => setOpen(true)}
                      >
                        {selected ? (
                          <div className="flex items-center gap-2">
                            <img
                              src={selected.image}
                              alt={selected.label}
                              className="w-5 h-5 rounded-full object-cover"
                            />
                            <span>{selected.label}</span>
                          </div>
                        ) : (
                          "Válassz szakembert"
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] md:w-[500px] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Válassz szakembert..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>Nem található szakember.</CommandEmpty>
                        <CommandGroup className="">
                          {specialists.map((specialist) => (
                            <CommandItem
                              value={specialist.label}
                              key={specialist.value}
                              onSelect={() => {
                                form.setValue("specialist", specialist.value);
                                setOpen(false);
                              }}
                              className="py-2 md:text-2xl"
                            >
                              <div className="flex items-center gap-3 w-full">
                                <img
                                  src={specialist.image}
                                  alt={specialist.label}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="flex flex-col text-left">
                                  <span className="font-medium">
                                    {specialist.label}
                                  </span>
                                  <span className="text-base text-muted-foreground">
                                    {specialist.company}
                                  </span>
                                  <span className="text-sm text-yellow-500">
                                    ⭐ {specialist.rating}
                                  </span>
                                </div>
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    specialist.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}