import Link from "next/link";
import { History, Info, Plus } from "lucide-react";

import Button from "@/components/buttons/Button";

export default function Navbar() {
    return (
        <header className="flex items-center justify-between border-b border-gray-main px-4 py-[25px] sm:px-[40px] bg-white-main">
            <nav className="flex items-center gap-8">
                <Link 
                    href="/home"
                    className="font-medium text-xl md:text-4xl"
                >
                    SiWaste
                </Link>
                
                <ul className="flex items-center gap-8">
                    <li className="inline-block mr-4">
                        <Link href="/" className="text-gray-main flex items-center gap-2">
                            <History />
                            History
                        </Link>
                    </li>
                    <li className="inline-block mr-4">
                        <Link href="/about" className="text-gray-main flex items-center gap-2">
                            <Info />
                            About
                        </Link>
                    </li>
                </ul>   
            </nav>

            <nav className="flex items-center gap-8">
                <Button
                    rightIcon={Plus}
                >
                    BUAT LAPORAN
                </Button>

                <Link href="/profile">
                    <figure className="rounded-full w-[50px] h-[50px] bg-gray-main">

                    </figure>
                </Link>
            </nav>
        </header>
    )
}