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
import { useForgotPassword } from "../hooks/use-forgot-password";

export default function ForgotPasswordForm() {
  const { form, error, onSubmit, isLoading } = useForgotPassword();

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
            Send Verification Code
          </LoaderButton>
        </div>
      </form>
    </Form>
  );
}
