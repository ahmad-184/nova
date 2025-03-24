"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import LoaderButton from "@/shared/components/loader-button";
import { PasswordInput } from "@/shared/components/ui/password-input";
import { useResetPassword } from "../hooks/use-reset-password";

export default function VerifyEmailOtpForm() {
  const { form, error, onSubmit, isLoading } = useResetPassword();

  return (
    <Form {...form}>
      <form
        autoComplete="off"
        onSubmit={onSubmit}
        className="w-full flex flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <Input placeholder="* * * * * *" {...field} />
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
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="* * * * * * * *"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="* * * * * * * *" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!!error?.length && (
          <div className="w-full">
            <p className="text-sm font-medium text-destructive">{error}</p>
          </div>
        )}
        <div className="w-full">
          <LoaderButton
            className="w-full"
            isLoading={isLoading}
            disabled={isLoading}
          >
            Reset Password
          </LoaderButton>
        </div>
      </form>
    </Form>
  );
}
