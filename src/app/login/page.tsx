import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LoginForm from "./login-form";
import Link from "next/link";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/");

  return (
    <div>
      <div className="mx-auto max-w-sm">
        <h2 className="mb-3 text-xl font-semibold text-uzg-500">Log in</h2>
        <LoginForm />
        <p className="mt-2 text-sm">
          No account?{" "}
          <Link href="/register" prefetch className="underline hover:text-uzg-500">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}