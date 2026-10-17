import {  Command,
    CommandEmpty,
    CommandGroup,
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
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown, type LucideIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { Button } from "../button"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { CompanyDTO, PlaceDTO, SpecialistDTO } from "@/API"
//import { BaseItemInterface } from "@/lib/specialist-types"


interface SearchFormPropInterface<T>
{
    title: string;
    type: string;
    icon?: LucideIcon;
    options: T[];
    selected?: T;
    onSelect: (selected: T | undefined)  => void;
    onChange: (input: string) => void;
}


 
export default function BaseSearchForm<T extends SpecialistDTO & CompanyDTO & PlaceDTO>({ title, icon: Icon, options, selected, onSelect, onChange }: SearchFormPropInterface<T>) {

  const FormSchema = z.object({
    type: z.string({
      required_error: "Please select a type",
    }),
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })
 

  const [open, setOpen] = useState(false);

  return (
    <Form {...form}>
      <form onClick={() => {
  if (selected) {
    onChange("");
    onSelect(undefined);
    form.setValue("type", "");
  }
}} className="w-full">
      <FormField
          control={form.control}
          name="type"
          render={({ field }) => {
            return (
              <FormItem className="flex flex-col gap-1.5">
                <FormLabel className="px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</FormLabel>
                
                <Popover open={open} onOpenChange={(nextOpen) => {
                    setOpen(nextOpen);
                    if(!selected)
                    {                
                    onChange("");
                    onSelect(undefined);
                    form.setValue("type", ""); 
                    }
                                       
                  }}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "h-12 w-full justify-between gap-2 rounded-xl px-3 text-base font-normal md:h-14",
                          !field.value && "text-muted-foreground"
                        )}
                        onClick={() => setOpen(true)}
                      >
                        {selected ? (
                          <div className="flex min-w-0 items-center gap-2">
                            {selected.image ?
                            <img
                            src={selected.image}
                            alt={selected.label}
                            className="size-7 shrink-0 rounded-full object-cover"
                          />
                            : Icon && <Icon className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                            }
                            
                            <span className="truncate text-foreground">{selected.label}</span>
                          </div>
                        ) : (
                          <div className="flex min-w-0 items-center gap-2">
                            {Icon && <Icon className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />}
                            <span className="truncate">{title} keresése…</span>
                          </div>
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-(--radix-popover-trigger-width) min-w-72 overflow-hidden rounded-xl p-0">
                    <Command>
                      <input type="text" autoFocus className="w-full border-b bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground" placeholder={title + " keresése…"} onChange={(e) =>onChange(e.target.value)}>
                      </input>
                      <CommandList>
                        <CommandEmpty>{"Nem található "+ title}</CommandEmpty>
                        <CommandGroup className="">
                          {options.map((option) => (
                            <CommandItem
                              value={option.label}
                              key={option.id}
                             onSelect={() => {
                                if (option.value === selected?.value) {
                                  form.setValue("type", "");
                                  console.log("ONDESELECT: " , option);
                                  onSelect(undefined); // deselect
                                  onChange("");
                                } else {
                                  form.setValue("type", option.value ?? "");
                                  onSelect(option);
                                  console.log("ONSELECT: " , option);
                                  onChange(option.value ?? ""); 
                                }
                                setOpen(false);
                              }}
                              
                              className="cursor-pointer py-2"
                            >
                              <div className="flex items-center gap-3 w-full">
                                {option.image && 
                                <img
                                src={option.image}
                                alt={option.label}
                                className="size-9 shrink-0 rounded-full object-cover"
                              />                           
                                }                           
                                <div className="flex flex-col text-left">
                                  <span className="font-medium">
                                    {option.label}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {option.company}
                                  </span>
                                  {option.rating && (
                                    <span className="text-xs text-amber-500">
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