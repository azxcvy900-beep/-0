import "./globals.css";

export const metadata = {
  title: "الخير برو - صيانة السيارات",
  description: "تطبيق إدارة سجلات صيانة السيارات ورشة الخير برو",
  themeColor: "#2563eb",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body className="antialiased bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
