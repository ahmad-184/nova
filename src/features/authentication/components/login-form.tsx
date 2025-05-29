"use client";

import Link from "next/link";
import { CircleAlertIcon, MailIcon } from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { PasswordInput } from "@/shared/components/ui/password-input";
import LoaderButton from "@/shared/components/loader-button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import { useLogin } from "../hooks/use-login";
import { cn } from "@/lib/utils";

export default function LoginForm() {
  const {
    form,
    error,
    onSubmit,
    isLoading,
    process,
    onSendVerificationOtp,
    sendVerificationOtpLoading,
  } = useLogin();

  return (
    <Form {...form}>
      <form
        autoComplete="off"
        onSubmit={onSubmit}
        className="w-full flex flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="example@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Password</FormLabel>
                <Link
                  href="/forgot-password"
                  className="text-xs hover:underline hover:text-blue-500"
                >
                  Forgot your password?
                </Link>
              </div>
              <FormControl>
                <PasswordInput placeholder="* * * * * * * *" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rememberMe"
          render={({ field }) => (
            <FormItem
              className={cn(
                "flex flex-row items-start space-y-0 rounded-md border p-2 py-3 shadow",
                !!field.value && "border-blue-700"
              )}
            >
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="text-sm">
                <div className="flex flex-col gap-1 leading-none">
                  <p>Remember me</p>
                  <FormDescription className="text-xs font-normal">
                    If unchecked, you will be logged out when browser closed.
                  </FormDescription>
                </div>
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        {!!error && process === "login" && (
          <div className="w-full">
            <p className="text-sm text-destructive">{error.message}</p>
          </div>
        )}
        {process === "email-verification" && (
          <Alert variant="destructive">
            <CircleAlertIcon className="w-4 h-4" />
            <AlertTitle>Email not verified</AlertTitle>
            <AlertDescription>
              <div className="mb-2">
                Your account is not verified. Please verify your account by
                clicking button below. we will send you a verification code to
                your email address.
              </div>
              <div className="flex-1 flex justify-start">
                <LoaderButton
                  isLoading={sendVerificationOtpLoading}
                  onClick={onSendVerificationOtp}
                  disabled={sendVerificationOtpLoading}
                  variant={"outline"}
                  className="text-neutral-200"
                >
                  <MailIcon />
                  Send Verification Code
                </LoaderButton>
              </div>
            </AlertDescription>
          </Alert>
        )}
        <div className="w-full">
          <LoaderButton
            className="w-full"
            isLoading={isLoading}
            disabled={isLoading}
          >
            Login
          </LoaderButton>
        </div>
      </form>
    </Form>
  );
}
