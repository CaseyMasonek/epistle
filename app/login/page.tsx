"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn, useSession } from "next-auth/react";
import { KeyRound } from "lucide-react";
import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import { redirect } from "next/navigation";

export default () => (
  <SessionProvider>
    <LoginPage />
  </SessionProvider>
);

function LoginPage() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.accessToken) {
      redirect('/')
    }
  }, [session?.accessToken]);

  return (
    <div className="w-full flex items-center flex-col justify-center h-screen">
      <Card className="w-full max-w-sm m-5">
        <CardHeader>
          <CardTitle>Log In</CardTitle>
          <CardDescription>
            Log in or sign up with your gmail account to access Epistle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={() => signIn("google")}>
            <KeyRound />
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
