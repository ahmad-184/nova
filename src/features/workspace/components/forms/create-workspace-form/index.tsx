"use client";

import Image from "next/image";

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
import LoaderButton from "@/shared/components/loader-button";
import { useUser } from "@/features/workspace/hooks/use-user";
import { useCreateWorkspace } from "../../../hooks/use-create-workspace";
import Picker from "../../picker";

type Props = {
  onClose?: () => void;
};

export default function CreateWorkspaceForm({ onClose }: Props) {
  const { user } = useUser();
  const { form, error, loading, onSubmit } = useCreateWorkspace({
    callback() {
      onClose?.();
    },
  });

  if (!user) return null;

  return (
    <Form {...form}>
      <form className="w-full flex flex-col gap-4" onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <FormControl>
                <div className="size-20 rounded-sm border hover:border-muted-foreground/30">
                  <Picker
                    className="w-full h-full p-1"
                    onChangeIcon={data => field.onChange(data.iconUrl)}
                    onRemove={() => field.onChange("")}
                  >
                    <div className="w-full h-full relative hover:bg-muted-foreground/10 transition-all rounded-sm">
                      {field.value ? (
                        <Image src={field.value} fill alt="workspace icon" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <p className="font-medium text-[35px] select-none text-muted-foreground">
                            {user.name.charAt(0).toUpperCase()}
                          </p>
                        </div>
                      )}
                    </div>
                  </Picker>
                </div>
              </FormControl>
              <FormMessage />
              <FormDescription>
                Upload an image or pick an emoji. It will show up in your
                sidebar and notifications.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder={`${user.email}'s workspace`} {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>
                You can use your organization or company name. Keep it simple.
              </FormDescription>
            </FormItem>
          )}
        />
        {!!error && (
          <div className="w-full">
            <p className="text-destructive text-sm">{error.message}</p>
          </div>
        )}
        <div className="w-full flex justify-end">
          <LoaderButton
            isLoading={loading}
            type="submit"
            variant="default"
            className="w-full"
          >
            Create
          </LoaderButton>
        </div>
      </form>
    </Form>
  );
}
