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

export function SignupForm() {
  const _router = useRouter();
  const [githubPending, startGithubTransition] = useTransition();
  const [googlePending, startGoogleTransition] = useTransition();
  const [signupPending, startSignupTransition] = useTransition();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  async function signUpWithGithub() {
    startGithubTransition(async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/new",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed up with Github, you will be redirected...");
          },
          onError: (_error) => {
            toast.error("Something went wrong!");
          },
        },
      });
    });
  }

  async function signUpWithGoogle() {
    startGoogleTransition(async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/new",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed up with Google, you will be redirected...");
          },
          onError: (_error) => {
            toast.error("Something went wrong!");
          },
        },
      });
    });
  }

  function signUp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startSignupTransition(async () => {
      await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        callbackURL: "/new",
        fetchOptions: {
          onSuccess: () => {
            toast.success(
              "Account created! Please check your email to verify your account.",
            );
          },
          onError: (ctx) => {
            toast.error(ctx.error.message ?? "Failed to create account");
          },
        },
      });
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Create Account</CardTitle>
        <CardDescription>
          Sign up with your Google, Github or Email Account
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={signUpWithGoogle}
            loading={googlePending}
          >
            <IconBrandGoogle className="size-4" />
            Google
          </Button>

          <Button
            variant="outline"
            onClick={signUpWithGithub}
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

        <form onSubmit={signUp} className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </div>

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
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              required
              minLength={8}
            />
          </div>

          <Button type="submit" loading={signupPending}>
            Create Account
          </Button>
        </form>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
