import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { AuthenticationContextProvider } from "@/context/UserContext"; // Import from the new file
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "Novalo - Your Online Store",
  description: "E-commerce platform built with Next.js",
};

// This is the "Default Export" Next.js is looking for!
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthenticationContextProvider>
          <Navbar /> 
          <main className="min-h-screen pt-20">
            {children}
          </main>
          <Footer />
        </AuthenticationContextProvider>
      </body>
    </html>
  );
}