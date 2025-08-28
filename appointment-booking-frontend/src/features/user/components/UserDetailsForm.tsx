import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"
import { UserDataResponseDTO } from "@/lib/profile-types"
import { useRef, useState } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


import defaultAvatar from "@/assets/default.jpg"
import { PopoverArrow } from "@radix-ui/react-popover"


export type UserDetailsFormProps = {

  userData: UserDataResponseDTO;

}

export default function UserDetailsForm({userData}: UserDetailsFormProps)
{
  const [enableModifyUserData, setEnableModifyUserData] = useState(false);
  const [showHint, setShowHint] = useState(false);
  
   const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log("Selected:", file);
    }
  };


  const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),

  email: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),

  avatar: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),

})

 const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      avatar: ""
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {

    console.log(values)
  }

  function onClick(values: z.infer<typeof formSchema>) {

    console.log(values)
  }

  function handleCancel()
  {
    setEnableModifyUserData(false);
    setShowHint(false);
    form.reset();
  }

  function handleModifyClick()
  {
    setEnableModifyUserData(true);
    setShowHint(true);

    setTimeout(() => setShowHint(false), 2000);
  }
 
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Profile Card */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Popover open={showHint}>
             <PopoverContent side="left" sideOffset={5}>
              <p className="text-xs">Kattints a képre a profilkép módosításhoz!</p>
              <PopoverArrow className="fill-background" />
            </PopoverContent>
             <PopoverTrigger asChild>
          <Avatar className="w-16 h-16 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <AvatarImage src={userData.avatarUrl} alt="profile" />
             <AvatarFallback>
              <img src={defaultAvatar} alt="default avatar" className="w-full h-full object-cover" />
            </AvatarFallback>
          </Avatar>
          </PopoverTrigger>
          </Popover>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          <div>
            <CardTitle className="text-xl">{userData.name}</CardTitle>
            <p className="text-sm text-muted-foreground">Felhasználó</p>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Itt találod a fiókodhoz tartozó adatokat.</p>
        </CardContent>
      </Card>

      {/* Edit Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">  
        {enableModifyUserData ?  <Button type="button" onClick={() => handleCancel()}>Vissza</Button> : <Button type="button" onClick={() => handleModifyClick()}>Adatok módosítása</Button> }
        <FormField
            control={form.control}
            name="name"
            
            render={({ field }) => (
              <FormItem>
                <FormLabel>Név</FormLabel>
                <FormControl>
                  <Input placeholder={userData.name} {...field} disabled={!enableModifyUserData}/>
                </FormControl>
                <FormDescription>Ez a teljes neved.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            
            render={({ field }) => (
              <FormItem>
                <FormLabel>Felhasználónév</FormLabel>
                <FormControl>
                  <Input placeholder={userData.username} {...field} disabled={!enableModifyUserData} />
                </FormControl>
                <FormDescription>Ez a felhasználóneved.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

           
          <Button type="submit">Mentés</Button>
          
        </form>
      </Form>
    </div>
  )

}