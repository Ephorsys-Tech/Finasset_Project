import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import Providers from '@/context/Providers';

export const metadata = {
  title: 'Finasset Wealth | Premier Financial Planning & Wealth Management Bhubaneswar',
  description: 'Finasset Wealth, a group of NLF Adhira Asset Services LLP Bhubaneswar, delivers disciplined wealth management, mutual funds, insurance, real estate advisory, and PMS solutions.',
  keywords: 'wealth management bhubaneswar, financial planning odisha, mutual funds sip bhubaneswar, nri investments, insurance planning, pms, finasset wealth',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800 antialiased selection:bg-[#f87b1f] selection:text-white">
        <Providers>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  );
}
