import { UserPeran } from "./user";

export type Laporan = {
    date: string;
    deskripsi: string;
    judul: string;
    laporan_id: number;
    lokasi_id: number | null;
    status_bersih: boolean;
    user_id: string;
    foto_laporan: string | null;
    user: {
        user_name: string;
        peran: UserPeran;
    }
    lokasi?: {
        lat: number;
        long: number;
    }
};

