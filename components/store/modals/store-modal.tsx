"use client"
import Modal from "../ui/modal"
import * as z from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useStoreModal } from "@/hooks/store/use-store-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema=z.object({
    name:z.string().min(1),

});


export const StoreModal=()=>{
    const storeModal=useStoreModal();
    const [Loading,setLoading]=useState(false)
    const form =useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
            name:"",
        }
    })
    const onSubmit=async(values:z.infer<typeof formSchema>)=>{
      try {
        setLoading(true);
        const response=await axios.post('api/stores',values);
        window.location.assign(`/${response.data.id}`)
      } catch (error) {
        toast.error("something went wrong")
      }finally{
        setLoading(false)
      }
    }
    
    return(
        <Modal
           title="create store"
           description="add a new store"
           isOpen={storeModal.isOpen}
           onClose={storeModal.onClose}
        >
         <div>
           <div className="space-y-4 py-2 pb-4">
             <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                   control={form.control}
                   name="name"
                   render={({field})=>(
                     <FormItem>
                        <FormLabel>
                            name
                        </FormLabel>
                        <FormControl>
                            <Input disabled={Loading} placeholder="E-commerce" {...field}/>
                        </FormControl>
                        <FormMessage/>
                     </FormItem>  
                   )}
                  >

                  </FormField>
                  <div className="pt-6 space-x-2 flex items-center justify-end">
                    <Button disabled={Loading} variant="outline" onClick={storeModal.onClose}>Cancel</Button>
                    <Button disabled={Loading} type="submit">Continue</Button>
                  </div>
                </form>
             </Form>
           </div>
         </div>
        </Modal>
    )
}