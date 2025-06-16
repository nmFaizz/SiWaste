"use client"
import { 
    FormProvider, 
    SubmitHandler, 
    useForm 
} from "react-hook-form";
import Link from "next/link";
import toast from "react-hot-toast";
import Image from "next/image";

import Button from "@/components/buttons/Button";
import Input from "@/components/forms/Input";
import MainLayout from "@/layouts/MainLayout";
import { supabase } from "@/lib/supabase";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type SignUpFormValues = {
    email: string;
    password: string;
    username: string;
}

export default function SingUpPage() {
  const methods = useForm<SignUpFormValues>({
    defaultValues: {
      email: "",
      password: "",
      username: ""
    },
  });
  const { handleSubmit } = methods;

  const router = useRouter();

  const { isPending, mutate } = useMutation<void, Error, SignUpFormValues>({
    mutationFn: async (data: SignUpFormValues) => {

        const { data: authRes, error } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                data: {
                username: data.username,
                },
            },
        })

        if (error) {
            toast.error("SignUp Error: " + error.message);
            return;
        }

        const user = authRes.user;

        const { error: insertError } = await supabase
            .from('user')
            .insert([
                {
                    id: user?.id,             
                    email: data.email,
                    user_name: data.username,
                },
            ]);

        if (insertError) {
            toast.error("Failed to retrieve user data");
            return
        }
    },
    onSuccess: () => {
      toast.success("Successfully Signed Up.");
      router.push("/sign-in");
    },
    onError: (error) => {
      toast.error(`Sign Up failed: ${error.message}`);
    },
  })

  const onSubmit: SubmitHandler<SignUpFormValues> = async (data) => {
    mutate(data);
  }

  return (
    <MainLayout widthSize="full" className="flex">
      <figure className="flex-1 bg-gray-main min-h-screen md:block hidden">
        
      </figure>
      <FormProvider {...methods}>
        <form 
            onSubmit={handleSubmit(onSubmit)}
            className="flex-1 flex justify-center items-center border p-5 w-full"
        >
          <div className="w-full max-w-[520px]">
            <div className="flex flex-col items-center mb-8">
              <h1 className="font-bold text-3xl text-center mb-2">
                SignUp
              </h1>
              <div className="bg-primary h-[5px] w-[80px]"></div>
            </div>

            <figure>
              <Image 
                src="/SiWaste-Logo.png"
                alt="SiWaste Logo"
                width={150}
                height={150}
                className="mx-auto mb-4"
                priority
              />  
            </figure> 
            <div className="space-y-4 mb-12">
              <Input 
                id="username"
                label="Username"
                type="text"
                placeholder="Enter username"
                validation={{
                    required: "Username is required",
                    minLength: {
                        value: 3,
                        message: "Username must be at least 3 characters",
                    },
                    maxLength: {
                        value: 20,
                        message: "Username cannot exceed 20 characters",
                    },
                }}
              />
              <Input 
                id="email"
                label="Email"
                type="email"
                placeholder="Enter your email"
                validation={{
                    required: "Email is required",
                    pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Invalid email address",
                    },
                }}
              />

              <Input 
                id="password"
                label="Password"
                type="password"
                placeholder="Enter your password"
                validation={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                }}
              />
            </div>

            <Button
              variant="primary"
              type="submit"
              isLoading={isPending}
              className="w-full flex items-center justify-center"
            >
              Sign Up
            </Button>

            <p className="text-center mt-4">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-blue-500 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </FormProvider>
    </MainLayout>
  );
}
