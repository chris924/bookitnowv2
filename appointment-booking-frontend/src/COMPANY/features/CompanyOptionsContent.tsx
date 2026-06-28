import { CompanyUpdateDTO } from "@/API";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { showToast } from "@/components/ui/own/ShowToast";
import { useApi } from "@/hooks/useApi";
import { handleAPIError } from "@/lib/utils";
import { useCompanyStore } from "@/stores/AuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Popover, PopoverArrow, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { useMutation } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import defaultAvatar from "@/assets/default.jpg"
import PasswordChangeCard from "@/components/auth/PasswordChangeCard"


export default function CompanyOptionsContent()
{

    const [enableModifyCompanyData, setEnableModifyCompanyData] = useState(false);
    const [showHint, setShowHint] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const {company} = useCompanyStore();

    const api = useApi();

    const avatarChangeMutation = useMutation({

    mutationFn: (file: File) =>  api.company.uploadCompanyAvatar({ uploadUserAvatarRequest: { avatar: file }}),
    onSuccess: (response) => {
      if(response)
      {
        useCompanyStore.getState().updateCompanyAvatar(response);
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

  name: z.string().min(2, {
    message: "A névnek legalább 2 karakter hosszúnak kell lennie.",
  }),

  email: z.string().min(5, {
    message: "Az emailnek legalább 5 karakter hosszúnak kell lennie.",
  }),

  description: z.string().min(11, {
    message: "A leírásnak legalább 11 karakter hosszúnak kell lennie.",
  }),

    serviceName: z.string().min(5, {
    message: "A szolgáltatás nevének legalább 5 karakter hosszúnak kell lennie.",
  }),

  serviceDescription: z.string().min(1, {
    message: "A szolgáltatás leírásának legalább 1 karakter hosszúnak kell lennie.",
  }),
})

 const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {

      name: company?.name,
      email: company?.email,
      description: company?.description,
      serviceName: company?.serviceName,
      serviceDescription: company?.serviceDescription

    },
  })

  const changeCompanyDetailsMutation = useMutation({
    mutationFn: (dto: CompanyUpdateDTO) => api.company.changeCompanyDetails({companyUpdateDTO: dto}),
    onSuccess: (data) => {
      useCompanyStore.getState().updateCompanyObject(data)
      showToast.success("Adatok sikeresen frissítve!");
      setEnableModifyCompanyData(false);
    },
    onError: handleAPIError,
  })

async function onSubmit(values: z.infer<typeof formSchema>) {

  const dto: CompanyUpdateDTO = {
    name: values.name,
    email: values.email,
    description: values.description,
    serviceName: values.serviceName,
    serviceDescription: values.serviceDescription

  }
  changeCompanyDetailsMutation.mutate(dto);

  }


  function handleCancel()
  {
    setEnableModifyCompanyData(false);
    setShowHint(false);
    form.reset();
  }

  function handleModifyClick()
  {
    setEnableModifyCompanyData(true);
    setShowHint(true);

    setTimeout(() => setShowHint(false), 2000);
  }

    return(
       <>
    {changeCompanyDetailsMutation.isPending || avatarChangeMutation.isPending  ? <Loader/> : ""}
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
            <AvatarImage src={company?.avatarUrl} alt="profile" />
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
            <CardTitle className="text-xl">{company?.name}</CardTitle>
            <p className="text-sm text-muted-foreground">Cég</p>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Itt találod a fiókodhoz tartozó adatokat.</p>
        </CardContent>
      </Card>

      {/* Edit Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {enableModifyCompanyData ?  <Button type="button" onClick={() => handleCancel()}>Vissza</Button> : <Button type="button" onClick={() => handleModifyClick()}>Adatok módosítása</Button> }
        <FormField
            control={form.control}
            name="name"

            render={({ field }) => (
              <FormItem>
                <FormLabel>Név</FormLabel>
                <FormControl>
                  <Input placeholder={company?.name} {...field} disabled={!enableModifyCompanyData}/>
                </FormControl>
                <FormDescription>Ez a cég neve.</FormDescription>
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
                  <Input placeholder={company?.email} {...field} disabled={!enableModifyCompanyData} />
                </FormControl>
                <FormDescription>Ez az e-mail cím.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"

            render={({ field }) => (
              <FormItem>
                <FormLabel>Leírás</FormLabel>
                <FormControl>
                  <Input placeholder={company?.description} {...field} disabled={!enableModifyCompanyData} />
                </FormControl>
                <FormDescription>Ez a cég leírása.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="serviceName"

            render={({ field }) => (
              <FormItem>
                <FormLabel>Szolgáltatás neve</FormLabel>
                <FormControl>
                  <Input placeholder={company?.serviceName} {...field} disabled={!enableModifyCompanyData} />
                </FormControl>
                <FormDescription>Ez a szolgáltatás neve.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="serviceDescription"

            render={({ field }) => (
              <FormItem>
                <FormLabel>Szolgáltatás leírása</FormLabel>
                <FormControl>
                  <Input placeholder={company?.serviceDescription} {...field} disabled={!enableModifyCompanyData} />
                </FormControl>
                <FormDescription>Ez a szolgáltatás leírása.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />


          <Button type="submit" className="bg-green-200" disabled={!enableModifyCompanyData}>Mentés</Button>

        </form>
      </Form>

      <PasswordChangeCard onChangePassword={(dto) => api.companyAuth.changePassword2(dto)} />
    </div>
    </>
    )
}
