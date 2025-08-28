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
import { useState } from "react"


export type UserDetailsFormProps = {

  userData: UserDataResponseDTO;

}

export default function UserDetailsForm({userData}: UserDetailsFormProps)
{
  const [modifyUserData, setModifyUserData] = useState(true);


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

})

 const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {

    console.log(values)
  }

  function onClick(values: z.infer<typeof formSchema>) {

    console.log(values)
  }
 
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Profile Card */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={userData.avatarUrl} alt="profile" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
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
        <FormField
            control={form.control}
            name="name"
            
            render={({ field }) => (
              <FormItem>
                <FormLabel>Név</FormLabel>
                <FormControl>
                  <Input placeholder={userData.name} {...field} disabled={modifyUserData}/>
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
                  <Input placeholder={userData.username} {...field} disabled={modifyUserData} />
                </FormControl>
                <FormDescription>Ez a felhasználó neved.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder={userData.email} {...field} disabled={modifyUserData} />
                </FormControl>
                <FormDescription>A Felhasználóval való kapcsolat fenntartásához</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Save Changes</Button>
          <Button type="button" onClick={() => setModifyUserData(prev => !prev)}>Adatok módosítása</Button>
        </form>
      </Form>
    </div>
  )

}