"use client"
import { useQuery } from "@tanstack/react-query"

import CardPelaporan from "@/components/cards/CardPelaporan"
import MainLayout from "@/layouts/MainLayout"
import { Laporan } from "@/types/laporan"
import { supabase } from "@/lib/supabase"

export default function PageHome() {

    const { data: listLaporan } = useQuery<Laporan[]>({
        queryKey: ["laporan"],
        queryFn: async () => {
            const { data: laporan, error } = await supabase
                .from("laporan")
                .select(`
                    *,
                    user:user (
                        user_name,
                        peran
                    )
                `)

            if (error) {
                throw new Error(error.message);
            }

            return laporan;
        },
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    })

    return (
        <MainLayout withNavbar>
            <h3 className="font-medium text-xl">
                Peta Sebaran Sampah
            </h3>
            <div className="relative w-full h-96 mt-3">
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

            <div className="mt-8">
                <h3 className="font-medium text-xl">
                    Laporan Terdekat
                </h3>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {listLaporan?.map((laporan) => (
                        <CardPelaporan 
                            key={laporan.laporan_id} 
                            laporan_id={laporan.laporan_id}
                            user={laporan.user}
                            status_bersih={laporan.status_bersih}
                        />
                    ))}
                </div>
            </div>
        </MainLayout>
    )
}