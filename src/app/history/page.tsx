"use client";
import Button from "@/components/buttons/Button";
import { bucketUrl } from "@/constants/bucket";
import MainLayout from "@/layouts/MainLayout";
import { supabase } from "@/lib/supabase"
import { Laporan } from "@/types/laporan";
import { useQuery } from "@tanstack/react-query"
import Image from "next/image";
import Link from "next/link";

export default function HistoryPage() {
    const { data: histories } = useQuery<Laporan[]>({
        queryKey: ["histories"],
        queryFn: async () => {
            const { data: user } = await supabase.auth.getUser()

            if (!user) {
                throw new Error("User not authenticated")
            }

            const { error: selectError, data } = await supabase
                .from("laporan")
                .select(`
                    *
                `)
                .eq("user_id", user.user?.id)

            if (selectError) {
                throw new Error(selectError.message)
            }

            return data;
        },
        staleTime: 1000 * 60 * 5, 
        refetchOnWindowFocus: false,
    })

    return (
        <MainLayout withNavbar>
            <h3 className="font-medium text-xl mb-4">Riwayat Laporan</h3>
            <div className="space-y-4">
                {histories?.length ? (
                    histories.map((history) => (
                        <div key={history.laporan_id} className="flex items-center gap-5 p-4 bg-white rounded-lg shadow-sm">
                            <figure className="h-[100px] w-[100px]">
                                <Image 
                                    src={(bucketUrl + history.foto_laporan) || "/images/no-image.png"}
                                    width={500}
                                    height={500}
                                    alt="Foto Laporan"
                                    className="w-full h-full object-cover"
                                />
                            </figure>

                            <div>
                                <h4 className="font-semibold text-lg">{history.judul}</h4>
                                <p className="text-gray-600">{history.deskripsi}</p>

                                <div className="space-x-2 mt-2">
                                    <div className={`mt-2 inline-block px-3 py-1 text-xs font-medium rounded-full ${history.status_bersih ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                        {history.status_bersih ? "BERSIH" : "BELUM BERSIH"}
                                    </div>
                                </div>

                                <Link href={`/laporan/${history.laporan_id}`} className="inline-block">
                                    <Button className="mt-3">
                                        Lihat Detail
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">Tidak ada riwayat laporan.</p>
                )}
            </div>
        </MainLayout>
    )
}