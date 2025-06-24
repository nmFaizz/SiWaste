import { ArrowRight } from "lucide-react"

import ButtonLink from "@/components/buttons/ButtonLink"
import { UserPeran } from "@/types/user";
import Image from "next/image";
import { bucketUrl } from "@/constants/bucket";

type CardPelaporanProps = {
    user: {
        user_name: string;
        peran: UserPeran;
    }
    status_bersih: boolean;
    laporan_id: number;
    foto_laporan: string | null;
}

export default function CardPelaporan({
    laporan_id,
    user,
    status_bersih,
    foto_laporan,
}: CardPelaporanProps) {
    return (
        <div className="bg-white-main p-5 rounded-xl">
            <div className="flex flex-wrap gap-5 items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <figure className="rounded-full w-[50px] h-[50px] bg-black">
                        
                    </figure>

                    <div>
                        <h4 className="font-medium">{user.user_name}</h4>
                        <p>{user.peran}</p>
                    </div>
                </div>

                <div className={`border ${status_bersih ? "text-success-main border-success-main" : "text-error-main border-error-main"} px-4 py-0.5 rounded-full`}>
                    <p>{status_bersih ? "BERSIH" : "BELUM BERSIH"}</p>
                </div>
            </div>

            <div className="w-full flex justify-center py-4">
                <figure className="w-full max-w-[190px] h-[190px] rounded-lg bg-gray-main">
                    <Image 
                            src={foto_laporan ? bucketUrl + foto_laporan : "/images/no-image.png"}
                            alt="Laporan Foto"
                            width={500}
                            height={500}
                            className="w-full h-full object-cover"
                        />
                </figure>
            </div>

            <ButtonLink
                href={`/laporan/${laporan_id}`}
                rightIcon={ArrowRight}
                className="mt-4"
            >
                Lihat Detail
            </ButtonLink>
        </div>
    )
}