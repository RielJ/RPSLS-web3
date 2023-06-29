import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import { Poppins } from "next/font/google";
import { Providers } from "./providers";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "@/components";

export const metadata = {
  title: "Kleros RPS",
};

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
    <html lang="en">
      <body
        className={`${poppins.variable} font-primary min-w-[100vw] min-h-[100vh]`}
      >
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            {children}
            <Toaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
