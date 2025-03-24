import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import ResetPasswordForm from "../components/reset-password-form";

export default function ResetPassword() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>
          Enter your new password below to reset your account
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 w-full">
        <ResetPasswordForm />
      </CardContent>
      <CardFooter>
        <div className="w-full text-center justify-center text-sm">
          <Link
            href="/sign-up"
            className="hover:underline hover:text-blue-500 text-primary underline flex items-center justify-center gap-0"
          >
            Back to Sign Up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
