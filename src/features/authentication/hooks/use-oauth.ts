import { useState } from "react";

import { afterLoginUrl } from "@/app-config";
import { authClient } from "@/lib/auth-client";

export const useOAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOAuth = async (provider: "google") => {
    try {
      setIsLoading(true);
      await authClient.signIn.social({
        provider,
        disableRedirect: false,
        requestSignUp: true,
        callbackURL: afterLoginUrl,
      });
    } catch (error) {
      console.error(error);
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleOAuth,
    error,
  };
};
