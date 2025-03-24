"use client";

import Link from "next/link";
import { CircleAlertIcon } from "lucide-react";

import {
  Form,
  FormControl,
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

export default function LoginForm() {
  const { form, error, onSubmit, isLoading, process } = useLogin();

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
                  className="text-sm hover:underline hover:text-blue-500"
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
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="text-sm flex-1">Remember me</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        {!!error?.length && process === "login" && (
          <div className="w-full">
            <p className="text-sm font-medium text-destructive">{error}</p>
          </div>
        )}
        {process === "email-verification" && (
          <Alert variant="destructive">
            <CircleAlertIcon className="w-4 h-4" />
            <AlertTitle>Email not verified</AlertTitle>
            <AlertDescription>
              Your account is not verified. Please verify your account by
              clicking button below. we will send you a verification code to
              your email address.
            </AlertDescription>
          </Alert>
        )}
        <div className="w-full">
          <LoaderButton
            className="w-full"
            isLoading={isLoading}
            disabled={isLoading}
          >
            {process === "login" ? "Login" : "Send Verification Code"}
          </LoaderButton>
        </div>
      </form>
    </Form>
  );
}
