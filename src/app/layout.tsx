import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import { Poppins } from "next/font/google";
import { Providers } from "./providers";

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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
