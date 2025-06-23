import Button from "@/components/buttons/Button";
import MainLayout from "@/layouts/MainLayout";
import Link from "next/link";

export default function HomePage() {
  return (
    <MainLayout withNavbar={true} widthSize="full" className="flex items-center justify-center">
        <main className="flex flex-col item-center justify-center text-center px-4">
         <h2 className="text-5xl md:text-7xl font-semibold text-primary">Satu Laporan</h2>
         <h3 className="text-5xl md:text-7xl font-semibold text-gray-800 mt-2">Seribu Perubahan</h3>

         <p className="text-gray-600 max-w-xl mt-4">
          SiWaste merupakan aplikasi pelaporan sampah. <br />
          SiWaste diangkat sebagai upaya inovatif dalam mengatasi tumpukan sampah yang sering terjadi di lingkungan masyarkat.
         </p>
          <Link href="/sign-in">
            <Button className="mt-6">
              Get Started
            </Button>
          </Link>
        </main>
    </MainLayout>
  );
}
