import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Learnive — Your 28-Day AI Challenge",
  description: "Discover your personalized artificial intelligence plan. 28 days, 15 minutes a day.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Learnive",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#7C3AED",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* Meta Pixel */}
        <script dangerouslySetInnerHTML={{ __html: `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init','1985622431943479');
fbq('track','PageView');
        `}} />
        <noscript dangerouslySetInnerHTML={{ __html: `
<img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=1985622431943479&ev=PageView&noscript=1"/>
        `}} />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
