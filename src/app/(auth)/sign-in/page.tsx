"use client"
import { FormProvider, useForm } from "react-hook-form";
import Link from "next/link";

import Button from "@/components/buttons/Button";
import Input from "@/components/forms/Input";
import Image from "next/image";
import MainLayout from "@/layouts/MainLayout";

export default function PageSignIn() {
  const methods = useForm({
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <MainLayout widthSize="full" className="flex">
      <figure className="flex-1 bg-gray-main min-h-screen md:block hidden">
        
      </figure>
      <FormProvider {...methods}>
        <form 
          className="flex-1 flex justify-center items-center border p-5 w-full"
        >
          <div className="w-full max-w-[520px]">
            <div className="flex flex-col items-center mb-8">
              <h1 className="font-bold text-3xl text-center mb-2">
                Login
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
              className="w-full flex items-center justify-center"
            >
              Sign In
            </Button>

            <p className="text-center mt-4">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-blue-500 hover:underline">
                Register Now
              </Link>
            </p>
          </div>
        </form>
      </FormProvider>
    </MainLayout>
  );
}
