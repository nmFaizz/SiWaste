import { cn } from "@/lib/utils";
import Navbar from "@/layouts/Navbar";

type MainLayoutProps = {
    children: React.ReactNode;
    widthSize?: "1200" | "720" | "full";
    withNavbar?: boolean;
    
} & React.ComponentProps<"main">;

export default function MainLayout({
    children,
    className,
    widthSize = "1200",
    withNavbar = false,
}: MainLayoutProps) {
    return (
        <>
            {withNavbar && <Navbar />}
            <main className={cn(
                "min-h-screen w-full mx-auto", 
                widthSize === "1200" && "max-w-[1200px] px-4 py-8",
                widthSize === "720" && "max-w-[720px] px-4 py-8",
                widthSize === "full" && "w-full",
                className
            )}>
                {children}

            </main>
        </>
    )
}