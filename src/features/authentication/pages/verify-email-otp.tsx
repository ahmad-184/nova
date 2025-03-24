import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import VerifyEmailOtpForm from "../components/verify-email-otp-form";

export default function VerifyEmailOtp() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Email Verification</CardTitle>
        <CardDescription>
          Verify your <span className="text-primary font-medium">N</span>ova
          account by entering the code sent to your email address
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 w-full">
        <VerifyEmailOtpForm />
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
