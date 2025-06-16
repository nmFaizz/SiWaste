import SingleLaporanClient from "@/app/laporan/[id]/SingleLaporanClient";

export default async function SingleLaporanPage({
    params,
}: {
    params: Promise<{ id: string; }>;
}) {
    const { id } = await params;

    return <SingleLaporanClient id={id} />;
}