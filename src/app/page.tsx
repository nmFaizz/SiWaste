import { redirect } from "next/navigation";
import MainLayout from "@/layouts/MainLayout";
import Link from "next/link";

export default function HomePage() {
  return (
    <MainLayout withNavbar={true} widthSize="full" className="flex items-center justify-center">
        <main className="flex flex-col item-center justify-center text-center px-4 mt-32">
         <h2 className="text-4xl md: text-5xl font-bold text-green-700">Satu Laporan</h2>
         <h3 className="text-3xl md:text-4xl font-semibold text-gray-800 mt-2">Seribu Perubahan</h3>

         <p className="text-gray-600 max-w-xl mt-4">
          SiWaste merupakan aplikasi pelaporan sampah. <br />
          SiWaste diangkat sebagai upaya inovatif dalam mengatasi tumpukan sampah yang sering terjadi di lingkungan masyarkat.
         </p>
          <Link href="/sign-in">
            <button className="mt-8 px-6 py-2 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition">
              GET STARTED
            </button>
          </Link>
        </main>
    </MainLayout>
  );
}
