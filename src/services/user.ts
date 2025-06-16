import { supabase } from "@/lib/supabase";

export const getUserById = async (userId: string) => {
    const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return user;
}