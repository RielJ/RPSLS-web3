import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import { Toaster } from "@/components";
import { ToasterLoader } from "@/components/shadcn/ui/toaster-loader";
import { Poppins } from "next/font/google";
import { ClientLayout } from "./client-layout";
import { ThemeProvider } from "./providers";
import { Providers } from "./providers/providers";

const poppins = Poppins({
  weight: "700",
  subsets: ["latin"],
  variable: "--font-poppins",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} font-primary min-w-[100vw] min-h-[100vh]`}
      >
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <ClientLayout>{children}</ClientLayout>
            <Toaster />
            <ToasterLoader />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
