import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
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
      </head>
      <body className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800 antialiased selection:bg-[#f87b1f] selection:text-white">
        <Providers>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
