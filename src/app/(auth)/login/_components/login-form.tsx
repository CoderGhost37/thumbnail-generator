"use client";

import { IconBrandGoogle } from "@tabler/icons-react";
import { GithubIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export function LoginForm() {
  const _router = useRouter();
  const [githubPending, startGithubTransition] = useTransition();
  const [googlePending, startGoogleTransition] = useTransition();
  const [loginPending, startLoginTransition] = useTransition();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  async function signInWithGithub() {
    startGithubTransition(async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/new",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed in with Github, you will be redirected...");
          },
          onError: (_error) => {
            toast.error("Something went wrong!");
          },
        },
      });
    });
  }

  async function signInWithGoogle() {
    startGoogleTransition(async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/new",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed in with Google, you will be redirected...");
          },
          onError: (_error) => {
            toast.error("Something went wrong!");
          },
        },
      });
    });
  }

  function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startLoginTransition(async () => {
      await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
        callbackURL: "/new",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed in successfully!");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message ?? "Failed to sign in");
          },
        },
      });
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Welcome Back!</CardTitle>
        <CardDescription>
          Sign in with your Google, Github or Email Account
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={signInWithGoogle}
            loading={googlePending}
          >
            <IconBrandGoogle className="size-4" />
            Google
          </Button>

          <Button
            variant="outline"
            onClick={signInWithGithub}
            loading={githubPending}
          >
            <GithubIcon className="size-4" />
            Github
          </Button>
        </div>

        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-card px-2 text-sm text-muted-foreground">
            Or continue with
          </span>
        </div>

        <form onSubmit={signIn} className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              required
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="ml-auto inline-block text-sm underline"
              >
                Forgot your password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              required
            />
          </div>

          <Button type="submit" loading={loginPending}>
            Sign in
          </Button>
        </form>

        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
