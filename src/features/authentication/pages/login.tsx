import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import GoogleLogin from "../components/oauth/google-login";
import LoginForm from "../components/login-form";

export default function Login() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Think it. Make it.</CardTitle>
        <CardDescription>
          Log in to your <span className="text-primary font-normal">N</span>ova
          account
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 w-full">
        <LoginForm />
        <GoogleLogin />
      </CardContent>
      <CardFooter>
        <div className="w-full text-center justify-center text-sm">
          <Link href="/sign-up" className="text-primary">
            Don't have an account?{" "}
            <span className="hover:underline hover:text-blue-500">Sign up</span>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
