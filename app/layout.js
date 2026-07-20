import AuthProvider from "@/components/AuthProvider";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({ 
  subsets: ["arabic", "latin"],
  weight: ['300', '400', '600', '700', '800'],
  display: 'swap',
});

export const metadata = {
  title: "الخير برو - صيانة السيارات",
  description: "تطبيق إدارة سجلات صيانة السيارات ورشة الخير برو",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  }
};

export const viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body className={`${cairo.className} bg-slate-50 text-slate-900 antialiased selection:bg-blue-200 selection:text-blue-900`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
