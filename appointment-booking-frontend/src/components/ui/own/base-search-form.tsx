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

interface BaseItemInterface
{
    label: string,
    value: string,
    image?: string,
    company?: string,
    rating?: number
}

interface SearchFormPropInterface<T extends BaseItemInterface>
{
    title: string;
    type: string;
    options: T[];
    onSelect: (selected: T)  => void;
}


 
export default function BaseSearchForm<T extends BaseItemInterface>({ title, type, options, onSelect }: SearchFormPropInterface<T>) {

  const FormSchema = z.object({
    type: z.string({
      required_error: "Please select a type",
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FormField
          control={form.control}
          name="type"
          render={({ field }) => {
            const selected = options.find((s : BaseItemInterface) => s.value === field.value);

            return (
              <FormItem className="flex flex-col">
                <FormLabel>{title}</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-[300px] h-[60px] md:h-[70px] md:w-[350px] justify-between text-xl md:text-2xl",
                          !field.value && "text-muted-foreground"
                        )}
                        onClick={() => setOpen(true)}
                      >
                        {selected ? (
                          <div className="flex items-center gap-2">
                            {selected.image &&
                            <img
                            src={selected.image}
                            alt={selected.label}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                            }
                            
                            <span>{selected.label}</span>
                          </div>
                        ) : (
                            title
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] md:w-[500px] p-0">
                    <Command>
                      <CommandInput
                        placeholder={title}
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>{"Nem található "+ title}</CommandEmpty>
                        <CommandGroup className="">
                          {options.map((option: BaseItemInterface) => (
                            <CommandItem
                              value={option.label}
                              key={option.value}
                              onSelect={() => {
                                form.setValue("type", option.value);
                                setOpen(false);
                              }}
                              className="py-2 md:text-2xl"
                            >
                              <div className="flex items-center gap-3 w-full">
                                {option.image && 
                                <img
                                src={option.image}
                                alt={option.label}
                                className="w-12 h-12 rounded-full object-cover"
                              />                           
                                }                           
                                <div className="flex flex-col text-left">
                                  <span className="font-medium">
                                    {option.label}
                                  </span>
                                  <span className="text-base text-muted-foreground">
                                    {option.company}
                                  </span>
                                  {option.rating && (
                                    <span className="text-sm text-yellow-500">
                                        ⭐ {option.rating}
                                    </span>
                                    )}                              
                                </div>
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    option.value === field.value
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
      </form>
    </Form>
  )
}