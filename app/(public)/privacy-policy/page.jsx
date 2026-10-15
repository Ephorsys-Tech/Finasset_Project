'use client';

import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full bg-[#F8F7F3] py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10243A]/5 text-[#10243A] text-xs font-bold uppercase tracking-wider mb-2">
            <Shield className="w-3.5 h-3.5 text-[#C7A76C]" />
            <span>Compliance & Confidentiality</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#10243A]">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Last Updated: January 2026 • Finasset Wealth (NLF Adhira Asset Services LLP)
          </p>
        </div>

        <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
          <p>
            At <strong>Finasset Wealth</strong>, a group of <strong>NLF Adhira Asset Services LLP</strong>, headquartered in Bhubaneswar, Odisha, we are committed to upholding the utmost standards of privacy, confidentiality, and data protection for all our investors, clients, and website visitors.
          </p>

          <h3 className="text-base font-bold text-[#10243A] pt-2">1. Information We Collect</h3>
          <p>
            We collect personal information necessary for providing wealth advisory services, conducting regulatory KYC verification mandated by SEBI/AMFI, and addressing inquiries. This includes full name, email address, phone number, PAN card details, bank account details for investment mandates, and risk profiling inputs.
          </p>

          <h3 className="text-base font-bold text-[#10243A] pt-2">2. Usage of Client Data</h3>
          <p>
            Your information is used strictly to execute investment instructions with registered Asset Management Companies (AMCs), generate consolidated portfolio statements, send regulatory transaction confirmations, and respond to your direct service inquiries. We strictly do not sell, rent, monetize, or trade client data to third-party telemarketers or external entities.
          </p>

          <h3 className="text-base font-bold text-[#10243A] pt-2">3. Data Security & Storage</h3>
          <p>
            All electronic data transmissions are encrypted using industry-standard Secure Socket Layer (SSL/TLS) protocols. Database storage is protected by strict access controls and token-based administrative authorization.
          </p>

          <h3 className="text-base font-bold text-[#10243A] pt-2">4. Contact the Data Protection Officer</h3>
          <p>
            For any inquiries regarding data protection or to request review of your recorded information, please contact our compliance desk at <strong>contact@finassetwealth.com</strong> or visit our office at Saheed Nagar / Jaydev Vihar, Bhubaneswar.
          </p>
        </div>
      </div>
    </div>
  );
}
