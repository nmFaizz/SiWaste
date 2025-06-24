"use client";
import Button from "@/components/buttons/Button";
import MainLayout from "@/layouts/MainLayout";
import { supabase } from "@/lib/supabase";
import { Laporan } from "@/types/laporan";
import { useQuery } from "@tanstack/react-query";
import { Flag, Hand } from "lucide-react";
import Image from "next/image";
import { bucketUrl } from "@/constants/bucket"
import ModalTangani from "@/components/modals/ModalTangani";

export default function SingleLaporanClient({
    id,
}: { id: string }) {
    const { data: laporan } = useQuery<Laporan>({
        queryKey: ["single-laporan"],
        queryFn: async () => {
            const { data } = await supabase
                .from("laporan")
                .select(`
                    *,
                    user:user (
                        user_name
                    )
                `)
                .eq("laporan_id", id)
                .single();
                
            return data;
        }
    })

    return (
        <MainLayout 
            withNavbar
            widthSize="720"
            className="space-y-10"
        >
            <div>
                <h3 className="font-medium text-xl mb-3">Detail Laporan</h3>

                <div className="p-8 rounded-xl flex flex-col items-center gap-5 justify-center bg-white-main">
                    <div className="flex flex-col items-center gap-5">
                        <figure className="bg-gray-main w-[180px] h-[180px]">
                            <Image 
                                src={bucketUrl + laporan?.foto_laporan || "/images/no-image.png"}
                                alt="Foto Laporan"
                                width={180}
                                height={180}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </figure>

                        <div className="flex flex-col items-center text-center">
                            <h3 className="font-medium text-2xl">{laporan?.judul}</h3>
                            <p className="text-xl">{laporan?.user.user_name}</p>

                            <div className={`mt-3 border ${laporan?.status_bersih ? "border-success-main text-success-main" : "text-error-main border-error-main"} px-4 py-0.5 rounded-full w-max`}>
                                <p className="text-xs">{laporan?.status_bersih ? "BERSIH" : "BELUM BERSIH"}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-3 max-w-[350px]">
                        <Button leftIcon={Flag} variant="danger" className="flex items-center justify-center">
                            Laporkan
                        </Button>

                        <ModalTangani id={id}>
                            {({ openModal }) => (
                                <Button
                                    onClick={openModal}
                                    leftIcon={Hand}
                                    className="flex items-center justify-center"
                                >
                                    Tangani
                                </Button>
                            )}
                        </ModalTangani>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="font-medium text-xl mb-3">Lokasi</h3>
                <div className="relative w-full h-96">
                    <iframe
                        className="absolute top-0 left-0 w-full h-full rounded-xl"
                        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12080.73732861526!2d-74.0059418!3d40.7127847!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM40zMDA2JzEwLjAiTiA3NMKwMjUnMzcuNyJX!5e0!3m2!1sen!2sus!4v1648482801994!5m2!1sen!2sus"
                        frameBorder="0"
                        style={{ border: 0 }}
                        allowFullScreen
                        aria-hidden="false"
                        tabIndex={0}
                        title="Google Map"
                    ></iframe>
                </div>
            </div>

            <div>
                <h3 className="font-medium text-xl mb-3">Keterangan</h3>

                <div className="w-full min-h-[222px] p-5 border border-gray-main rounded-xl bg-white-main">
                    <p className="text-gray-main">{laporan?.deskripsi}</p>
                </div>
            </div>
        </MainLayout>
    )
}