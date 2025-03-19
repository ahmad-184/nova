import { ReactQueryProviders } from "./react-query";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <ReactQueryProviders>{children}</ReactQueryProviders>;
}
