"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/toast";
import Button from "@/components/ui/button";
import {Register, RegisterSchema} from "@/lib/schemas";

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState:{ errors } } = useForm<Register>({
    resolver: zodResolver(RegisterSchema)
  });
  const { toast } = useToast();

  const onSubmit = async (data: Register) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        let msg = "Registration failed";
        try {
          const body = await res.json();
          if (Array.isArray(body.message)) msg = body.message.join("\n");
          else if (typeof body.message === "string") msg = body.message;
          else if (typeof body.error === "string") msg = body.error;
        } catch {}
        toast({ title: "Registration failed", description: msg, variant: "error" });
        return;
      }

      // auto login without full reload
      const si = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (si?.error) {
        toast({ title: "Auto login failed", description: "Please log in manually.", variant: "info" });
        router.replace("/login");
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
        <span className="text-uzg-300">Name</span>
        <input className={inputCls} placeholder="Jane Doe" {...register("name")} />
        {errors.name && <span className="text-xs text-red-400">{errors.name.message}</span>}
      </label>

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
        text={loading ? "Creating..." : "Create account"}
        disabled={loading}
        largeFont={true}
      />
    </form>
  );
}