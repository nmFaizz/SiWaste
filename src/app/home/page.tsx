"use client"
import { useQuery } from "@tanstack/react-query"

import CardPelaporan from "@/components/cards/CardPelaporan"
import MainLayout from "@/layouts/MainLayout"
import { Laporan } from "@/types/laporan"
import { supabase } from "@/lib/supabase"
import MultipleMarkerMap from "@/components/MulipleMarkerMap"

export default function PageHome() {

    const { data: listLaporan } = useQuery<Laporan[]>({
        queryKey: ["laporan"],
        queryFn: async () => {
            const { data: laporan, error } = await supabase
                .from("laporan")
                .select(`
                    *,
                    lokasi (
                        lat,
                        long
                    ),
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
                <MultipleMarkerMap 
                    laporanList={listLaporan || []}
                />
            </div>

            <div className="mt-8">
                <h3 className="font-medium text-xl">
                    Laporan Terkini
                </h3>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {listLaporan?.slice().reverse().map((laporan) => (
                        <CardPelaporan 
                            key={laporan.laporan_id} 
                            laporan_id={laporan.laporan_id}
                            user={laporan.user}
                            status_bersih={laporan.status_bersih}
                            foto_laporan={laporan.foto_laporan}
                        />
                    ))}
                </div>
            </div>
        </MainLayout>
    )
}