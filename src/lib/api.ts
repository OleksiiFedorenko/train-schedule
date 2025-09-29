import ky from "ky";

export const api = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 15000,
  retry: 0,
  hooks: {
    beforeRequest: [async (request) => {
      const { getSession } = await import("next-auth/react");
      const session = await getSession();
      const token = (session as any)?.accessToken as string | undefined;
      if (token) request.headers.set("Authorization", `Bearer ${token}`);
      request.headers.set("Content-Type", "application/json");
    }],
  },
});