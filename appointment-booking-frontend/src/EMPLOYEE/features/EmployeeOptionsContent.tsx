import { EmployeeDetailsChangeDTO, UserDetailsChangeDTO } from "@/API";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { showToast } from "@/components/ui/own/ShowToast";
import { useApi } from "@/hooks/useApi";
import { handleAPIError } from "@/lib/utils";
import { useEmployeeStore, useUserStore } from "@/stores/AuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Popover, PopoverArrow, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { useMutation } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import defaultAvatar from "@/assets/default.jpg"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";


export default function EmployeeOptionsContent()
{

    const [enableModifyEmployeeData, setEnableModifyEmployeeData] = useState(false);
    const [showHint, setShowHint] = useState(false);
      
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {employee} = useEmployeeStore();

    const api = useApi();

    const avatarChangeMutation = useMutation({
    
    mutationFn: (file: File) =>  api.user.uploadUserAvatar({ uploadUserAvatarRequest: { avatar: file }}),
    onSuccess: (response) => {
      if(response)
      {
     //   setUserData({...userData, avatarUrl: response.data})
        useEmployeeStore.getState().updateEmployeeAvatar(response);
        showToast.success("Sikeres profilkép módosítás!");
      }
    },
    onError: handleAPIError

   })

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        avatarChangeMutation.mutate(file);
    }

  };


  const formSchema = z.object({
  username: z.string().min(2, {
    message: "A felhasználónévnek legalább 2 karakter hosszúnak kell lennie.",
  }),
  name: z.string().min(2, {
    message: "A névnek legalább 2 karakter hosszúnak kell lennie.",
  }),

  about: z.string().min(15, {
    message: "A bionak legalább 15 karakter hosszúnak kell lennie.",
  }),

  email: z.string().min(5, {
    message: "Az emailnek legalább 15 karakter hosszúnak kell lennie.",
  }),

  phoneNumber: z.string().min(11, {
    message: "A telefonszámnak legalább 11 karakter hosszúnak kell lennie.",
  }),

    status: z.enum(["ACTIVE", "NOT_ACTIVE"])
})

 const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
 
      name: employee?.name,
      username: employee?.username,
      about: employee?.about,
      email: employee?.email,
      phoneNumber: employee?.phoneNumber,
      status: employee?.status
      
    },
  })

  const changeUserDetailsMutation = useMutation({
    mutationFn: (dto: UserDetailsChangeDTO) => api.employee.changeEmployeeDetails({employeeDetailsChangeDTO: dto}),  //changeUserDetails(dto),
    onSuccess: (data) => {
   //   setUserData(data.data);
      useEmployeeStore.getState().updateEmployeeObject(data)
      showToast.success("Adatok sikeresen frissítve!");
      setEnableModifyEmployeeData(false);
    },
    onError: handleAPIError,
  })

async function onSubmit(values: z.infer<typeof formSchema>) {

  const dto: EmployeeDetailsChangeDTO = {
    name: values.name,
    username: values.username,
    about: values.about,
    email: values.email,
    phoneNumber: values.phoneNumber,
    status: values.status

  }
  console.log("DTO IS: ", dto)
  changeUserDetailsMutation.mutate(dto);

  }
  

  function handleCancel()
  {
    setEnableModifyEmployeeData(false);
    setShowHint(false);
    form.reset();
  }

  function handleModifyClick()
  {
    setEnableModifyEmployeeData(true);
    setShowHint(true);

    setTimeout(() => setShowHint(false), 2000);
  }

    return(
       <>
    {changeUserDetailsMutation.isPending || avatarChangeMutation.isPending  ? <Loader/> : ""}
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
            <AvatarImage src={employee?.avatarUrl} alt="profile" />
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
            <CardTitle className="text-xl">{employee?.name}</CardTitle>
            <p className="text-sm text-muted-foreground">Alkalmazott</p>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Itt találod a fiókodhoz tartozó adatokat.</p>
        </CardContent>
      </Card>

      {/* Edit Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">  
        {enableModifyEmployeeData ?  <Button type="button" onClick={() => handleCancel()}>Vissza</Button> : <Button type="button" onClick={() => handleModifyClick()}>Adatok módosítása</Button> }
        <FormField
            control={form.control}
            name="name"
            
            render={({ field }) => (
              <FormItem>
                <FormLabel>Név</FormLabel>
                <FormControl>
                  <Input placeholder={employee?.name} {...field} disabled={!enableModifyEmployeeData}/>
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
                  <Input placeholder={employee?.username} {...field} disabled={!enableModifyEmployeeData} />
                </FormControl>
                <FormDescription>Ez a felhasználóneved.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input placeholder={employee?.email} {...field} disabled={!enableModifyEmployeeData} />
                </FormControl>
                <FormDescription>Ez az e-mail cím.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="about"
            
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Input placeholder={employee?.about} {...field} disabled={!enableModifyEmployeeData} />
                </FormControl>
                <FormDescription>Ez a bio.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefonszám</FormLabel>
                <FormControl>
                  <Input placeholder={employee?.phoneNumber} {...field} disabled={!enableModifyEmployeeData} />
                </FormControl>
                <FormDescription>Ez a telefonszám.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            
            render={({ field }) => (
              <FormItem>
                <FormLabel>Státusz</FormLabel>
                <FormControl>
                 <Select disabled={!enableModifyEmployeeData} onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-full max-w-48">
                        <SelectValue placeholder="Válassz státuszt"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                        <SelectLabel>Státusz</SelectLabel>
                        <SelectItem value="ACTIVE">Aktív</SelectItem>
                        <SelectItem value="NOT_ACTIVE">Nem aktív</SelectItem>         
                        </SelectGroup>
                    </SelectContent>
                    </Select>
                </FormControl>
                <FormDescription>Ez a státusz.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

           
          <Button type="submit" className="bg-green-200" disabled={!enableModifyEmployeeData}>Mentés</Button>
          
        </form>
      </Form>
    </div>
    </>
    )
}