"use client"
import { JSX, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import Input from "@/components/forms/Input";
import Textarea from "../forms/Textarea";
import Button from "../buttons/Button";
import useUserProfile from "@/hooks/useUserProfile";
import { ArrowRight } from "lucide-react";

type LaporanFormValues = {
    judul_laporan: string;
    deskripsi_laporan: string;
}

type ModalLaporanReturn = {
    openModal: () => void;
}

type ModalLaporanProps = {
    children: (props: ModalLaporanReturn) => JSX.Element;
}

export default function ModalLaporan({
    children,   
}: ModalLaporanProps) {
    const [open, setOpen] = useState<boolean>(false);
    const methods = useForm<LaporanFormValues>({
        defaultValues: {
            judul_laporan: "",
            deskripsi_laporan: "",
        },
    })
    const { user } = useUserProfile();

    const openModal: ModalLaporanReturn = {
        openModal: () => setOpen(!open),
    }

    return (
        <>
            {children(openModal)}
            <dialog open={open}>
                <div className="fixed top-0 left-0 w-full flex justify-center items-center min-h-screen bg-black/35">
                    <div className="flex flex-col items-center border border-gray-main bg-white-main w-full max-w-[720px] p-5 mx-4 rounded-xl space-y-5">
                        <FormProvider {...methods}>
                            <div 
                                className="w-full flex justify-end cursor-pointer"
                                onClick={() => setOpen(false)}
                            >
                                <ArrowRight />
                            </div>

                            <Input 
                                id="judul_laporan"
                                label="Judul Laporan"
                                
                            />
                            <Textarea 
                                id="deskripsi_laporan"
                                label="Deskripsi Laporan"
                            />

                            <div className="flex flex-col sm:flex-row items-center gap-5">
                                <div className="flex items-center gap-4 hover:bg-white-secondary p-3 rounded-xl">
                                    <figure className="rounded-full w-[50px] h-[50px] bg-gray-main">
                                        
                                    </figure>

                                    <p className="font-bold">{user?.user_name}</p>
                                </div>
                                <Button type="submit">
                                    BERIKUTNYA
                                </Button>
                            </div>
                        </FormProvider>
                    </div>
                </div>
            </dialog>
        </>
    );
}