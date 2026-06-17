import type { Metadata } from "next";
import "./globals.css";
import ProviderWrapper from "./provider";

export const metadata: Metadata = {
  title: "Learning Management System",
  description: "School LMS login",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <ProviderWrapper>{children}</ProviderWrapper>
      </body>
    </html>
  );
}
