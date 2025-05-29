import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import ForgotPasswordForm from "../components/forgot-password-form";

export default function ForgotPassword() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Enter your email</CardTitle>
        <CardDescription>
          Enter your email address and we will send you a verification code to
          reset your password
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 w-full">
        <ForgotPasswordForm />
      </CardContent>
      <CardFooter>
        <div className="w-full text-center justify-center text-sm">
          <Link href="/login" className="text-primary hover:underline">
            Back to Login
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
