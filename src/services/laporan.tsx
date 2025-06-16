"use client";
import { supabase } from "@/lib/supabase";

export const getAllLaporan = async () => {
    const { data: laporan, error } = await supabase
        .from("laporan")
        .select(`
            *,
            user:user (
                user_name
            )
        `)

    if (error) {
        throw new Error(error.message);
    }

    return laporan;
}