"use client"
import Link from "next/link";
import { 
    History, 
    Info, 
    Plus, 
    Menu 
} from "lucide-react";
import { useState } from "react";

import Button from "@/components/buttons/Button";
import ModalLaporan from "@/components/modals/ModalLaporan";
import useUserProfile from "@/hooks/useUserProfile";
import Image from "next/image";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { user } = useUserProfile();

    return (
        <header className="sticky top-0 z-50">
            <div className="flex items-center justify-between shadow px-4 py-[12px] sm:px-[40px] bg-white-main">
                <nav className="flex items-center gap-8">
                    <Link 
                        href="/home"
                        className="flex items-center font-medium text-xl md:text-2xl"
                    >
                        <figure className="w-[40px] h-[40px] mr-2">
                            <Image 
                                src="/SiWaste-Logo.png"
                                alt="Logo SiWaste"
                                width={320}
                                height={320}
                                className="inline-block mr-2"
                            />
                        </figure>
                        SiWaste
                    </Link>
                    
                    <ul className="hidden md:flex items-center gap-8">
                        <li className="inline-block mr-4">
                            <Link href="/history" className="text-gray-main flex items-center gap-2">
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

                <nav className="hidden md:flex items-center gap-8">
                    <ModalLaporan>
                        {({ openModal }) => (
                            <Button
                                onClick={openModal}
                                rightIcon={Plus}
                            >
                                Buat Laporan
                            </Button>
                        )}
                    </ModalLaporan>

                    <Link href="/profile">
                        <figure className="rounded-full w-[40px] h-[40px] bg-gray-main hover:border-[5px] hover:border-primary-hover">

                        </figure>
                    </Link>
                </nav>

                <div 
                    onClick={() => setIsOpen(!isOpen)}
                    className="block md:hidden hover:bg-white-secondary"
                >
                    <Menu className="w-[30px] h-[30px]" />
                </div>
            </div>
            {isOpen && (
                <nav className="md:hidden bg-white-main border-b border-gray-main px-4 py-[12px]">
                    <ul className="flex flex-col items-start gap-4">
                        <li>
                            <Link 
                                href="/" 
                                className="text-gray-main flex items-center gap-2"
                            >
                                <History />
                                History
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href="/about" 
                                className="text-gray-main flex items-center gap-2"
                            >
                                <Info />
                                About
                            </Link>
                        </li>
                        <li>
                            <ModalLaporan>
                                {({ openModal }) => (
                                    <Button
                                        onClick={openModal}
                                        rightIcon={Plus}
                                    >
                                        Buat Laporan
                                    </Button>
                                )}
                            </ModalLaporan>
                        </li>
                        <li className="flex items-center gap-4 hover:bg-white-secondary rounded-xl">
                            <Link href="/profile">
                                <figure className="rounded-full w-[50px] h-[50px] bg-gray-main">
                                    
                                </figure>
                            </Link>

                            <p className="font-bold">{user?.user_name}</p>
                        </li>
                    </ul>
                </nav>
            )}
        </header>
    )
}