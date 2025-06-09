import Button from "@/components/buttons/Button"
import { ArrowRight } from "lucide-react"

export default function CardPelaporan() {
    return (
        <div className="border border-gray-main p-5 rounded-xl">
            <div className="flex flex-wrap gap-5 items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <figure className="rounded-full w-[50px] h-[50px] bg-black">

                    </figure>

                    <div>
                        <h4 className="font-medium">Jordan Pickford</h4>
                        <p>Pelajar</p>
                    </div>
                </div>

                <div className="border text-error-main border-error-main px-4 py-0.5 rounded-full">
                    <p>BELUM BERSIH</p>
                </div>
            </div>

            <figure className="w-full h-[210px] bg-gray-main">

            </figure>

            <Button
                rightIcon={ArrowRight}
                className="mt-4"
            >
                Lihat Detail
            </Button>
        </div>
    )
}