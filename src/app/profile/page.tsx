"use client"
import { useMutation, useQuery } from "@tanstack/react-query"

import { supabase } from "@/lib/supabase"
import MainLayout from "@/layouts/MainLayout";
import { UserData } from "@/types/user";
import toast from "react-hot-toast";
import Button from "@/components/buttons/Button";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const { data: user } = useQuery<UserData>({
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
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
    })

    const router = useRouter();

    const { isPending, mutate } = useMutation({
        mutationFn: async () => {
            const { error } = await supabase.auth.signOut();
            if (error) throw new Error(error.message);
        },
        onSuccess: () => {
            toast.success("Successfully logged out.");
            router.push("/sign-in");
        }, 
        onError: (error: Error) => {
            toast.error(`Logout failed: ${error.message}`);
        },
    })

    return (
        <MainLayout 
            widthSize="1200"
            withNavbar
        >
            <div className="flex flex-col items-center">
                <figure className="w-[150px] h-[150px] bg-black rounded-full">

                </figure>
                <h1 className="font-bold text-center text-3xl mt-8">
                    Hello, {user?.user_name}
                </h1>

                <Button 
                    className="mt-8"
                    isLoading={isPending}
                    onClick={() => mutate()}
                >
                    Logout
                </Button>
            </div>
        </MainLayout>
    )
}