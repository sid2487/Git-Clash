import Navbar from "@/components/Navbar";
import "./globals.css";
import FingerPrintLoader from "@/components/FingerPrintLoader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black max-w-3xl mx-auto  ">
        <FingerPrintLoader />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
