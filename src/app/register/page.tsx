import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import RegisterForm from "./register-form";
import Link from "next/link";

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/");

  return (
    <div>
      <div className="mx-auto max-w-sm">
        <h2 className="mb-3 text-xl font-semibold text-uzg-500">Register</h2>
        <RegisterForm />
        <p className="mt-2 text-sm">
          Already have an account?{" "}
          <Link href="/login" prefetch className="underline hover:text-uzg-500">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}