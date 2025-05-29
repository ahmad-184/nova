"use client";

import StoreProvider from "./store-provider";

type Props = {
  children: React.ReactNode;
};

export default function Providers({ children }: Props) {
  return <StoreProvider>{children}</StoreProvider>;
}
