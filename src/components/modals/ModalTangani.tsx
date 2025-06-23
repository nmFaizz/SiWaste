"use client"
import { JSX, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import Textarea from "../forms/Textarea";
import Button from "../buttons/Button";
import useUserProfile from "@/hooks/useUserProfile";
import { ArrowRight } from "lucide-react";
import InputFile from "../forms/InputFile";
import { supabase } from "@/lib/supabase";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { queryClient } from "@/providers/ReactQueryProvider";

type LaporanFormValues = {
    deskripsi_laporan: string;
    foto_laporan: File | null;
}

type ModalLaporanReturn = {
    openModal: () => void;
}

type ModalLaporanProps = {
    children: (props: ModalLaporanReturn) => JSX.Element;
    id?: string;
}

export default function ModalTangani({
    children,
    id   
}: ModalLaporanProps) {
    const [open, setOpen] = useState<boolean>(false);

    const methods = useForm<LaporanFormValues>({
        mode: "onBlur",
        defaultValues: {
            deskripsi_laporan: "",
            foto_laporan: null,
        },
    })
    const { user } = useUserProfile();
    const { handleSubmit } = methods;

    const openModal: ModalLaporanReturn = {
        openModal: () => setOpen(!open),
    }

    const { mutate } = useMutation({
        mutationFn: async (data: LaporanFormValues) => {
            const { data: user } = await supabase.auth.getUser();

            const file = data.foto_laporan;
            const fileExt = file?.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `${user.user?.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("foto-laporan") 
                .upload(filePath, file as Blob, {
                    cacheControl: "3600",
                    upsert: false,
                });
            
            if (uploadError) {
                throw new Error(uploadError.message);
            }

            const { error: insertError } = await supabase
                .from("laporan")
                .update({
                    deskripsi: data.deskripsi_laporan,
                    foto_laporan: filePath,
                    status_bersih: true,
                })
                .eq("user_id", user.user?.id)
                .eq("laporan_id", id); 

            if (insertError) {
                throw new Error(insertError.message);
            }
        },
        onSuccess: () => {
            toast.success("Laporan berhasil diunggah!");
            queryClient.invalidateQueries({ queryKey: ["single-laporan"] as const });
            setOpen(false);
            methods.reset();
        },
        onError: (error) => {
            toast.error(`Gagal mengunggah laporan: ${error.message}`);
        }
    })

    const onSubmit: SubmitHandler<LaporanFormValues> = (data) => {
        const formDataWithLocation = {
            ...data,
        };

        mutate(formDataWithLocation);
    }

    return (
        <>
            {children(openModal)}
            <dialog open={open}>
                <div className="fixed top-0 left-0 w-full flex justify-center items-center min-h-screen bg-black/35 z-[9999]">
                    <FormProvider {...methods}>
                        <form
                            className="flex flex-col items-center border border-gray-main bg-white-main w-full max-w-[720px] p-5 mx-4 rounded-xl space-y-5 max-h-[90vh] overflow-y-auto" 
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <div 
                                className="w-full flex justify-end cursor-pointer"
                                onClick={() => setOpen(false)}
                            >
                                <ArrowRight />
                            </div>

                            <Textarea 
                                id="deskripsi_laporan"
                                label="Deskripsi Laporan"
                                validation={{
                                    required: "Deskripsi laporan tidak boleh kosong",
                                    minLength: {
                                        value: 10,
                                        message: "Deskripsi laporan minimal 10 karakter",
                                    },
                                    maxLength: {
                                        value: 500,
                                        message: "Deskripsi laporan maksimal 500 karakter",
                                    },
                                }}
                            />

                            <InputFile 
                                id="foto_laporan"
                                label="Foto Laporan"
                                capture="environment"
                                requireSquare
                            />

                            <div className="flex flex-col sm:flex-row items-center gap-5">
                                <div className="flex items-center gap-4 hover:bg-white-secondary p-3 rounded-xl">
                                    <figure className="rounded-full w-[50px] h-[50px] bg-gray-main">
                                        
                                    </figure>
                                    
                                    <div className="flex flex-col">
                                        <p className="font-bold">{user?.user_name}</p>
                                        <p>{user?.peran}</p>
                                    </div>
                                </div>
                                <Button 
                                    type="submit"
                                >
                                    Berikutnya
                                </Button>
                            </div>
                        </form>
                    </FormProvider>
                </div>
            </dialog>
        </>
    );
}