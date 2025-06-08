import CardPelaporan from "@/components/cards/CardPelaporan"
import MainLayout from "@/layouts/MainLayout"

export default function PageHome() {
    return (
        <MainLayout withNavbar>
            <div className="relative w-full h-96">
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
                <h3 className="font-medium text-xl md:text-2xl">
                    Laporan Terdekat
                </h3>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <CardPelaporan />
                    <CardPelaporan />
                </div>
            </div>
        </MainLayout>
    )
}