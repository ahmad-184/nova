import { ThemeProvider } from "./theme-provider";

import { ReactQueryProviders } from "./react-query";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProviders>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </ReactQueryProviders>
  );
}
