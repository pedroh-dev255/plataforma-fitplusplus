import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// IMPORTAÇÕES NECESSÁRIAS (Ajuste o caminho se AuthContext e AuthGuard estiverem em outra pasta)
import { AuthProvider } from "./AuthContext"; 
import AuthGuard from "./AuthGuard"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fit++",
  description: "School fitness app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-arp="">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/*
          O provedor de autenticação e o guarda DEVE envolver o children.
          Como AuthProvider e AuthGuard são 'use client', o layout Server Component
          os importa normalmente e os utiliza para envolver o restante do app.
        */}
        <AuthProvider>
            <AuthGuard>
                {children}
            </AuthGuard>
        </AuthProvider>
     </body>
    </html>
  );
}
