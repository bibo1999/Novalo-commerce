import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { AuthenticationContextProvider } from "@/context/UserContext";
import "./globals.css";
import { CartContextProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer/CartDrawer";
import { Toaster } from "react-hot-toast"; 

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "Novalo - Your Online Store",
  description: "E-commerce platform built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthenticationContextProvider>
          <CartContextProvider>
            <Navbar /> 
            <CartDrawer />
            
            <main className="min-h-screen pt-20">
              {children}
            </main>
            
            <Footer />
            
            <Toaster 
              position="top-center"
              reverseOrder={false}
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1f2937',
                  color: '#fff',
                  borderRadius: '10px',
                },
                success: {
                  iconTheme: {
                    primary: '#12bb9c', 
                    secondary: '#fff',
                  },
                },
              }}
            />
          </CartContextProvider>
        </AuthenticationContextProvider>
      </body>
    </html>
  );
}