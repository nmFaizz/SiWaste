"use client"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";

import Button from "@/components/buttons/Button";
import Input from "@/components/forms/Input";
import Image from "next/image";
import MainLayout from "@/layouts/MainLayout";
import { supabase } from "@/lib/supabase";
import { useMutation } from "@tanstack/react-query";
import { AuthResponsePassword } from "@supabase/supabase-js";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type SignInFormValues = {
  email: string;
  password: string;
}

export default function SignInPage() {
  const methods = useForm<SignInFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { handleSubmit } = methods;

  const router = useRouter()

  const { isPending, mutate } = useMutation<AuthResponsePassword, Error, SignInFormValues>({
    mutationFn: async (data: SignInFormValues) => {
      const { data: res, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        throw new Error("Password or username is incorrect.");
      }

      return {
        data: res,
        error
      }
    },
    onSuccess: () => {
      toast.success("Successfully signed in.");
      router.push("/home");
    },
    onError: (error) => {
      toast.error(`Sign in failed: ${error.message}`);
    },
  })

  const onSubmit: SubmitHandler<SignInFormValues> = async (data) => {
    mutate(data);
  }

  return (
    <MainLayout widthSize="full" className="flex">
      <Link href="/" className="flex-1 bg-gray-main max-h-screen md:block hidden">
        <Image 
          src="/siwaste-login-reg.jpg"
          alt="Sign In Background"
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
          priority
        />
      </Link>
      <FormProvider {...methods}>
        <form 
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 flex justify-center items-center border p-5 w-full"
        >
          <div className="w-full max-w-[520px]">
            <div className="flex flex-col items-center mb-8">
              <h1 className="font-bold text-3xl text-center mb-2">
                SignIn
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

              <Link
                href="/forgot-password"
                className="text-primary hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              variant="primary"
              type="submit"
              className="w-full flex items-center justify-center"
              isLoading={isPending}
            >
              Sign In
            </Button>

            <p className="text-center mt-4">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="text-blue-500 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </FormProvider>
    </MainLayout>
  );
}
