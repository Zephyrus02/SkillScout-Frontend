import "@/styles/globals.css";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";

const Agentation = dynamic(
  () => import("agentation").then((module) => module.Agentation),
  { ssr: false },
);

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

export default function App({ Component, pageProps }: AppProps) {
  const agentationEndpoint =
    process.env.NEXT_PUBLIC_AGENTATION_ENDPOINT || "http://localhost:4747";

  return (
    <div className={`${inter.variable} font-sans`}>
      <ThemeProvider>
        <AuthProvider>
          <Component {...pageProps} />
          {process.env.NODE_ENV === "development" && (
            <Agentation endpoint={agentationEndpoint} />
          )}
          <Toaster richColors position="top-right" closeButton />
        </AuthProvider>
      </ThemeProvider>
    </div>
  );
}
// force remount
