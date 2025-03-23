"use client";

import GoogleIcon from "@/icons/google-icon";
import LoaderButton from "@/shared/components/loader-button";
import { useOAuth } from "../../hooks/use-oauth";

export default function GoogleLogin() {
  const { handleOAuth, isLoading, error } = useOAuth();

  return (
    <div className="flex flex-col gap-2 w-full">
      <LoaderButton
        onClick={() => handleOAuth("google")}
        isLoading={isLoading}
        disabled={isLoading}
        className="w-full"
        variant="outline"
      >
        <GoogleIcon className="w-4 h-4" />
        Login with Google
      </LoaderButton>
      {error && <p className="text-sm text-destructive font-medium">{error}</p>}
    </div>
  );
}
