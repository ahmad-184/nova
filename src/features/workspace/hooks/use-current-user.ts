"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

import { USER_REFETCH_INTERVAL } from "@/app-config";
import {
  useCurrentUserQuery,
  useSignOutMutation,
} from "../redux/slices/user/api";
import { getErrorInfo } from "@/helpers/error";

export default function useCurrentUser() {
  const router = useRouter();

  const {
    data: user,
    isLoading,
    error: getUserError,
  } = useCurrentUserQuery(undefined, {
    pollingInterval: USER_REFETCH_INTERVAL,
    refetchOnReconnect: true,
  });

  const [signOutUser, { error: signOutError }] = useSignOutMutation();

  const signOut = async () => {
    await signOutUser(undefined);
  };

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [user, isLoading]);

  const error = useMemo(
    () => getErrorInfo(getUserError || signOutError),
    [getUserError, signOutError]
  );

  return {
    user,
    loading: isLoading,
    signOut,
    error,
  };
}
