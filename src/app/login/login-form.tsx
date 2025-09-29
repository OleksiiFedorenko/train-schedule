"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/toast";
import Button from "@/components/ui/button";
import {Login, LoginSchema,} from "@/lib/schemas";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState:{ errors } } = useForm<Login>({
    resolver: zodResolver(LoginSchema)
  });
  const { toast } = useToast();

  const onSubmit = async (data: Login) => {
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (res?.error) {
        toast({ title: "Invalid credentials", variant: "error" });
        return;
      }

      router.replace("/");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full rounded-lg border border-board-line bg-board-soft px-3 py-2 text-sm text-uzg-400 placeholder:text-uzg-300/60 focus:border-uzg-500 focus:ring-0";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <label className="grid gap-1 text-sm">
        <span className="text-uzg-300">Email</span>
        <input className={inputCls} placeholder="you@example.com" {...register("email")} />
        {errors.email && <span className="text-xs text-red-400">{errors.email.message}</span>}
      </label>

      <label className="grid gap-1 text-sm">
        <span className="text-uzg-300">Password</span>
        <input className={inputCls} type="password" placeholder="••••••••" {...register("password")} />
        {errors.password && <span className="text-xs text-red-400">{errors.password.message}</span>}
      </label>

      <Button
        variant="primary"
        fullWidth={true}
        text={loading ? "Logging in..." : "Log in"}
        disabled={loading}
        largeFont={true}
      />
    </form>
  );
}