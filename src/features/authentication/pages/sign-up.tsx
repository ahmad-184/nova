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
import SignUpForm from "../components/sign-up-form";

export default function SignUp() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Think it. Make it.</CardTitle>
        <CardDescription>
          Create your <span className="text-primary font-medium">N</span>ova
          account
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 w-full">
        <SignUpForm />
        <GoogleLogin />
      </CardContent>
      <CardFooter>
        <div className="w-full text-center justify-center text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="hover:underline hover:text-blue-500 text-primary underline"
          >
            Login
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
