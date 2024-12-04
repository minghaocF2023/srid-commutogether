import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import { ThemeProvider } from "@mui/material/styles";
import Theme from "@/theme/default/Theme";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Commutogether",
  description: "A social-driven platform for commuters.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider theme={Theme}>
          <Header />
          <div className="max-h-[calc(100vh-80px)]">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
