import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";
import { UserData } from "@/types/user";

export default function useUserProfile() {
    const { data: user, isLoading, isError } = useQuery<UserData>({
        queryKey: ["profile"],
        queryFn: async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error) throw new Error(error.message);

            const { data: userData } = await supabase
                .from("user")
                .select("*")
                .eq("id", data.user?.id)
                .single();

                console.log("User Data:", userData);
   
            return userData;
        },
        staleTime: 1000 * 60 * 5, 
        refetchOnWindowFocus: false,
    })

    return {
        user,
        isError,
        isLoading,
    }
}