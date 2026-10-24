'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Search,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  Loader2,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Building,
  GraduationCap,
  HeartPulse,
  Home,
  HelpCircle,
  Briefcase,
  Layers,
  Sparkles,
} from 'lucide-react';
import PageHero from '@/components/common/PageHero';

// Content strictly following the Tax Planning guide provided
const TAX_INVESTMENTS = [
  {
    id: 'inv-1',
    number: 1,
    title: 'Equity Linked Savings Scheme (ELSS)',
    section: 'Section 80C',
    category: 'investment',
    risk: 'High Risk',
    lockIn: '3 Years',
    description: `High Risk. Also known as tax saving mutual funds, an ELSS has the lowest lock in period of 3 years. As the money invested in an ELSS is invested by mutual funds in diversified stocks in the stock market, there is no guaranteed return.

Dividends and profits from redemption of units after the term period is tax free. If you buy directly from the mutual fund instead of a broker/distributor, then you pay zero entry load, else entry load is around two percent. Remember, in the long run, the stock markets always see a rise.`,
  },
  {
    id: 'inv-2',
    number: 2,
    title: 'Bank or Post Office Fixed Deposits',
    section: 'Section 80C',
    category: 'investment',
    risk: 'Low Risk',
    lockIn: '5 Years',
    description: `Low Risk. Only investments made in scheduled banks for a period of five years or more can be counted as a Bank Fixed Deposit.

The interest on such fixed deposits is around 8-9 percent. Income from interest is taxable. Forms are available at bank and post office counters.`,
  },
  {
    id: 'inv-3',
    number: 3,
    title: 'National Savings Certificate (NSC)',
    section: 'Section 80C',
    category: 'investment',
    risk: 'Low Risk',
    lockIn: '5 - 6 Years',
    description: `Low Risk. It comes in denominations of Rs.100, 500, 1000, 5000 and 10,000. The forms are available at any post office.

The maturity period is six years while the interest rate is 8 percent compounded half yearly. If you pay in cash, you will be given the National Savings Certificate then and there. If you pay by cheque, you will have to wait a week before you can collect the NSC certificate from the post office. Interest is taxable.`,
  },
  {
    id: 'inv-4',
    number: 4,
    title: 'Life Insurance Policy & Term Insurance',
    section: 'Section 80C & 10(10D)',
    category: 'investment',
    risk: 'Low / Moderate Risk',
    lockIn: 'Policy Term (5 - 20+ Yrs)',
    description: `If you are looking for life insurance cover along with investment, then you should choose one such policy that offers a guaranteed return on maturity.

If you have a huge loan to pay off and a family it is better to go for a cheap traditional term insurance where you don’t get the premium back but have a huge insurance cover in case of any untoward incident.

Premiums can vary and may be paid monthly, quarterly, annually or in a lump sum depending on the policy you choose. Term of the policy can vary from five years till twenty years and more. Money received from an insurance company as proceeds of an insurance policy (by way of an insurance claim, or by maturity) is generally exempt from tax.`,
  },
  {
    id: 'inv-5',
    number: 5,
    title: 'Government Infrastructure Bonds',
    section: 'Infrastructure Bonds',
    category: 'investment',
    risk: 'Low Risk',
    lockIn: '5 - 7 Years',
    description: `Low Risk. The main problem about these tax saving bonds are that they are open and available only for a fixed period. As many bonds open around February, they miss the January 31 deadline of submitting investment proof prevalent in most offices.

The major institutions that offer these bonds are ICICI, IDBI and Rural Electrification Corporation. Term periods can range from five to seven years and interest may vary from 6 to 9 percent per annum. Forms for Tax Saving bonds are available at local distributors that sit on the pavement outside major banks. Companies like ICICI have not come out with tax saving infrastructure bonds for a long period now.`,
  },
  {
    id: 'inv-6',
    number: 6,
    title: 'Public Provident Fund (PPF)',
    section: 'Section 80C (EEE)',
    category: 'investment',
    risk: 'Low Risk',
    lockIn: '15 Years',
    description: `Low Risk. The investment limit is Rs.500 to Rs.70,000 per year (now up to ₹1,50,000) - in multiples of Rs.5.

The main problem about this scheme is that you have to remember to invest an amount of at least Rs.500 annually for 15 years or your account will become defunct. Interest rate is 8 percent per annum compounded while the lock in time period is 15 years. Another point is that as interest rates are routinely updated by the government they may see variations.

As interest for the financial year is calculated on the lowest balance after March 5th, make sure you invest before that date. PPF Accounts may also be made in name of your spouse or kids for tax benefit. You can open a Public Provident Fund Account at main post offices, branches of the State Bank of India and nationalized banks.`,
  },
  {
    id: 'inv-7',
    number: 7,
    title: 'Pension Plans',
    section: 'Section 80CCC / 80CCD',
    category: 'investment',
    risk: 'High Risk',
    lockIn: '10+ Years / Till Retirement',
    description: `High Risk. Life insurance companies such as LIC, Tata AIG Life, Aviva, ICICI Prudential and BhartiAxa Life offer such pension plans.

On maturity, the investor receives one-third of the amount while the remaining 2/3rd goes into an annuity that provides regular income in the form of pension. Only premiums till Rs.10,000 per year (and higher under current provisions) are eligible for deductions from total income.

Like Unit Linked Insurance Plans (ULIP’s), a substantial amount of the money invested into Pension Plans goes into paying ‘fund charges’ and commissions. Plus, the annuity received by the insured investor is taxable. Terms can extend from 10 years upwards. Though some return may be guaranteed – a large part depends on the debt market, share market and inflation.`,
  },
  {
    id: 'inv-8',
    number: 8,
    title: 'Unit Linked Insurance Plan (ULIP)',
    section: 'Section 80C',
    category: 'investment',
    risk: 'Market-Linked',
    lockIn: '5 Years',
    description: `A Unit Link Insurance Policy (ULIP) is one in which the customer is provided with a life insurance cover and the premium paid is invested in either debt or equity products or a combination of the two.

In other words, it enables the buyer to secure some protection for his family in the event of his untimely death and at the same time provides him an opportunity to earn a return on his premium paid. In the event of the insured person’s untimely death, his nominees would normally receive an amount that is the higher of the sum assured or the value of the units (investments).

To put it simply, ULIP attempts to fulfill investment needs of an investor with protection/insurance needs of an insurance seeker. It saves the investor/insurance-seeker the hassles of managing and tracking a portfolio or products. ULIPs have been popular among investors seeking dual investment and insurance protection.`,
  },
  {
    id: 'inv-9',
    number: 9,
    title: 'Senior Citizens Saving Scheme (SCSS)',
    section: 'Section 80C',
    category: 'investment',
    risk: 'Low Risk',
    lockIn: '5 Years',
    description: `Low Risk. Only people over the age of 60 years and retired personnel over 55 years are allowed to invest in this scheme. This scheme is available at all public sector banks and post offices in the country.

Investments have to be made in multiples of Rs.1000 till a maximum of 15 lakhs (now up to ₹30 lakhs) for a period of five years.

The deposit made gets an attractive interest of 8-9 percent per year from the date of deposit which is computed quarterly. Interest is taxable and is deducted at source.`,
  },
];

const TAX_EXPENSES = [
  {
    id: 'exp-1',
    number: 1,
    title: 'Home Loan Principal Repayment',
    section: 'Section 80C',
    category: 'expense',
    risk: 'Deduction',
    description: `If you are repaying such a home loan, the principal amount of the loan taken can be counted as a deduction under Section 80C of the Income Tax Act.

This deduction is available within the overall Section 80C ceiling, helping homeowners reduce their net taxable income while building real estate equity.`,
  },
  {
    id: 'exp-2',
    number: 2,
    title: 'Tuition Fees of Children',
    section: 'Section 80C',
    category: 'expense',
    risk: 'Deduction',
    description: `The tuition fees of upto two children at school, college and university level may also be taken as a deduction from total income thus reducing the amount on which tax will be calculated.

This benefit is applicable to full-time educational courses in India and applies directly to the tuition fee component paid by the individual.`,
  },
  {
    id: 'exp-3',
    number: 3,
    title: 'Interest on Home Loan',
    section: 'Section 24',
    category: 'expense',
    risk: 'Exemption / Deduction',
    description: `According to Section 24, a tax exemption of up to Rs. 1,50,000 (now up to ₹2,00,000 for self-occupied property) is allowed on the interest paid for a home loan in the current financial year.

This exemption is independent of Section 80C and provides significant tax relief for residential property owners repaying housing loans.`,
  },
  {
    id: 'exp-4',
    number: 4,
    title: 'Medical Insurance Premium (Mediclaim)',
    section: 'Section 80D',
    category: 'expense',
    risk: 'Deduction',
    description: `Section 80D - An amount of up to Rs.15,000 (now up to ₹25,000) for individuals and Rs.20,000 (now up to ₹50,000) for senior citizens as premium towards a medical insurance or mediclaim policy is tax deductible.

This also includes medical insurance for dependents such as spouse, children or parents on the condition that you paid the premium.`,
  },
  {
    id: 'exp-5',
    number: 5,
    title: 'Education Loan Interest',
    section: 'Section 80E',
    category: 'expense',
    risk: 'Deduction',
    description: `Section 80E - The yearly deduction is available for loans taken for higher education - fulltime studies in any graduate or post-graduate, professional, and pure and applied science courses.

The deduction will be available for a maximum of eight years starting from the day you start repaying the education loan interest.`,
  },
  {
    id: 'exp-6',
    number: 6,
    title: 'Donations to a Charity',
    section: 'Section 80G',
    category: 'expense',
    risk: 'Tax Relief',
    description: `Section 80G – All donations to specific charitable organizations such as the Prime Minister’s Relief Fund, CARE and Help Age India are eligible for a 100 percent tax relief.

Donations to other approved charitable institutions and trusts get 50 per cent tax relief from total gross income.`,
  },
  {
    id: 'exp-7',
    number: 7,
    title: 'Other Deductions (Disability & Specified Diseases)',
    section: 'Chapter VI-A',
    category: 'expense',
    risk: 'Special Relief',
    description: `Under Chapter VI , there are also other deductions available for handicapped people and medical treatment of disabled dependents (up to Rs.50,000 - ₹1,25,000).

Also, deduction for medical treatment for specified diseases such as neurological diseases, cancer, AIDS and hemophilia are allowed up to Rs.40,000 for individuals and Rs. 60,000 to ₹1,00,000 for senior citizens.`,
  },
];

const ALL_ITEMS = [...TAX_INVESTMENTS, ...TAX_EXPENSES];

export default function TaxationPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    taxBracket: 'Salaried Individual (30% Slab)',
    message: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submittedData, setSubmittedData] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  const validate = () => {
    const errors = {};

    const trimmedName = form.name.trim();
    if (!trimmedName) {
      errors.name = 'Full name is required';
    } else if (trimmedName.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    } else if (/\d/.test(trimmedName)) {
      errors.name = 'Name cannot contain numbers';
    }

    const trimmedEmail = form.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (trimmedEmail && !emailRegex.test(trimmedEmail)) {
      errors.email = 'Please enter a valid email address';
    }

    const trimmedPhone = form.phone.trim();
    const phoneValidChars = /^[+]?[\d\s\-()]+$/;
    const digitsOnly = trimmedPhone.replace(/\D/g, '');
    if (!trimmedPhone) {
      errors.phone = 'Phone number is required';
    } else if (!phoneValidChars.test(trimmedPhone) || digitsOnly.length < 7 || digitsOnly.length > 15) {
      errors.phone = 'Enter valid phone (7-15 digits, e.g. +91 94370 12345)';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validate()) {
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/public/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          type: 'taxation',
          serviceOfInterest: `Tax Planning Advisory (${form.taxBracket})`,
          sourcePage: 'Taxation Page',
          message: form.message.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setSubmittedData(data.data || {});
        setForm({
          name: '',
          email: '',
          phone: '',
          taxBracket: 'Salaried Individual (30% Slab)',
          message: '',
        });
        setFormErrors({});
      } else {
        setSubmitError(data.message || 'Failed to submit enquiry. Please check your inputs.');
      }
    } catch {
      setSubmitError('Network error. Please call our office directly or try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredItems = ALL_ITEMS.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.section.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      (item.risk && item.risk.toLowerCase().includes(q))
    );
  });

  return (
    <div className="w-full bg-[#f8fafc]">
      {/* Banner matching NRI Corner format */}
      <PageHero
        title="Taxation & Strategic Tax Planning"
        description="Planning is the key to successfully and legally reducing your tax liability. We go beyond tax compliance and proactively recommend tax saving strategies to maximize your after-tax income."
        imageSrc="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&auto=format&fit=crop"
        imageAlt="Taxation & Strategic Tax Planning"
      />

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">

          {/* DYNAMIC TAX KNOWLEDGE BASE & GUIDELINES (Exact NRI Corner Layout) */}
          <div id="knowledge-base" className="space-y-8 scroll-mt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
              <div>

                <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0f2b44]">
                  Best Tax Saving Investments &amp; Expense Deductions
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl">
                  Comprehensive provisions under the Income Tax Act to legally reduce your taxable income through eligible investments and essential expenses.
                </p>
              </div>

              {/* Search Box matching NRI Corner */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search guidelines (e.g. ELSS, PPF, 80D)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2376b8] shadow-sm"
                />
              </div>
            </div>


            {filteredItems.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-2">
                <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="text-sm font-bold text-[#0f2b44]">No tax topics found</h4>
                <p className="text-xs text-slate-500">
                  {searchQuery ? `No guidelines matching "${searchQuery}".` : 'No items found in this section.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredItems.map((item, idx) => {
                  const isOpen = expandedId === item.id || hoveredId === item.id;
                  return (
                    <div
                      key={item.id}
                      onMouseEnter={() => setHoveredId(item.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      className={`group bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                        isOpen
                          ? 'border-[#2376b8]/50 shadow-md ring-1 ring-[#2376b8]/15'
                          : 'border-slate-200/90 shadow-sm hover:border-[#2376b8]/40 hover:shadow-md'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                        className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 hover:bg-slate-50/60 transition-colors cursor-pointer"
                        aria-expanded={isOpen}
                      >
                        <div className="flex items-start gap-3.5">
                          <span
                            className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center shrink-0 mt-0.5 border transition-colors duration-300 ${
                              isOpen
                                ? 'bg-[#2376b8] text-white border-[#2376b8]'
                                : 'bg-[#2376b8]/10 text-[#2376b8] border-[#2376b8]/15 group-hover:bg-[#2376b8]/20'
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <h3
                            className={`text-base sm:text-lg font-bold leading-snug transition-colors duration-300 ${
                              isOpen ? 'text-[#2376b8]' : 'text-[#0f2b44] group-hover:text-[#2376b8]'
                            }`}
                          >
                            {item.title}
                          </h3>
                        </div>
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300 ${
                            isOpen
                              ? 'bg-[#2376b8]/10 text-[#2376b8]'
                              : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                          }`}
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-300 ease-out ${
                              isOpen ? 'rotate-180' : 'rotate-0'
                            }`}
                          />
                        </div>
                      </button>

                      {/* Smooth Transition Answer Container */}
                      <div
                        className={`grid transition-all duration-300 ease-out ${
                          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                        }`}
                        style={{
                          gridTemplateRows: isOpen ? '1fr' : '0fr',
                          transition: 'grid-template-rows 300ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms ease-out',
                        }}
                      >
                        <div className="overflow-hidden">
                          <div className="px-5 sm:px-6 pb-6 pt-2 text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line border-t border-slate-100">
                            <div className="pl-0 sm:pl-10 text-slate-700 font-normal">
                              {item.description}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Deep Dive Section & Consultation Form (Exact NRI Corner Layout) */}
          <div id="consultation" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start scroll-mt-24">
            {/* Left Column: Why Choose Finasset for Tax Planning */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2376b8] bg-[#f0f6fb] px-3.5 py-1 rounded-full border border-[#2376b8]/20 inline-block">
                Tax Planning Strategy
              </span>
              <h2 className="text-2xl font-bold text-[#0f2b44]">
                Proactive Tax Planning Beyond Compliance
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Planning is the key to successfully and legally reducing your tax liability. We go beyond tax compliance and proactively recommend tax saving strategies to maximize your after-tax income.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                Our consultants make it a priority to enhance their mastery of the current tax law, complex tax code, and new tax regulations by attending frequent tax seminars. Businesses and individuals pay the lowest amount of taxes allowable by law because we continually look for ways to minimize your taxes throughout the year, not just at the end of the year.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                With the growing complexity &amp; diversity of available options for tax planning purposes, it is important that we critically examine and bring across to you the new generation options available for investors in the present investment market. There are various provisions in the Income Tax Act to save tax. The saving schemes one should opt for would depend on the person’s income and the tax bracket he / she is in.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#89b441] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#0f2b44]">Customized Tax Saving Strategy</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Investing in Equity Linked Savings Scheme (ELSS) may result in greater savings for one person while investing in PPF may result in better tax saving for another. The tax saving strategy should be finalized on an individual basis after discussion.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#89b441] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#0f2b44]">Suitability Based on Income Slabs</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      For tax saving point of view, the suitability of a scheme depends directly on which income tax slab one is in.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#89b441] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#0f2b44]">Net Taxable Income Optimization</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      After deducting all eligible investments and expenses from your total gross income, you are left with your &lsquo;Net Taxable Income&rsquo;. We calculate tax liabilities for male salaried individuals, women, and senior citizens to determine the ideal path.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Dark Consultation Form matching NRI Corner */}
            <div className="lg:col-span-5 bg-[#0f2b44] text-white rounded-3xl p-8 shadow-xl border border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-[#f87b1f] bg-[#f87b1f]/15 px-3 py-1 rounded-full border border-[#f87b1f]/30 inline-block mb-3">
                Tax Consultation Desk
              </span>
              <h3 className="text-2xl font-bold text-white mb-2">
                Connect With Our Tax &amp; Investment Advisor
              </h3>
              <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                Schedule a confidential consultation to finalize your individual tax saving strategy and optimize your Net Taxable Income.
              </p>

              {submitted ? (
                <div className="bg-emerald-950/70 border border-emerald-500/50 p-6 rounded-2xl text-center space-y-3 animate-in fade-in zoom-in-95 duration-200">
                  <CheckCircle2 className="w-10 h-10 text-[#89b441] mx-auto" />
                  <h4 className="text-base font-bold text-white">Consultation Scheduled!</h4>
                  {submittedData?.trackingNumber && (
                    <div className="inline-block bg-white/10 px-3 py-1 rounded-full text-[11px] font-mono text-[#89b441] border border-[#89b441]/30">
                      Ref: {submittedData.trackingNumber}
                    </div>
                  )}
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Thank you! Your tax inquiry has been routed to our advisory team. Our senior consultant will reach out to you shortly via Phone / Email.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setSubmittedData(null);
                    }}
                    className="text-xs text-[#f87b1f] hover:underline font-bold mt-2 block mx-auto"
                  >
                    Schedule Another Consultation
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  {submitError && (
                    <div className="p-3 bg-rose-500/20 border border-rose-500/50 text-rose-200 text-xs rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Priyabrata Das"
                      value={form.name}
                      onChange={(e) => {
                        setForm({ ...form, name: e.target.value });
                        if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
                      }}
                      className={`w-full bg-slate-800 border rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none transition-colors ${
                        formErrors.name
                          ? 'border-rose-500 focus:border-rose-500'
                          : 'border-slate-700 focus:border-[#2376b8]'
                      }`}
                    />
                    {formErrors.name && (
                      <p className="text-rose-400 text-[11px] font-medium mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{formErrors.name}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. priyabrata@example.com"
                      value={form.email}
                      onChange={(e) => {
                        setForm({ ...form, email: e.target.value });
                        if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                      }}
                      className={`w-full bg-slate-800 border rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none transition-colors ${
                        formErrors.email
                          ? 'border-rose-500 focus:border-rose-500'
                          : 'border-slate-700 focus:border-[#2376b8]'
                      }`}
                    />
                    {formErrors.email && (
                      <p className="text-rose-400 text-[11px] font-medium mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{formErrors.email}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 94370 12345"
                      value={form.phone}
                      onChange={(e) => {
                        setForm({ ...form, phone: e.target.value });
                        if (formErrors.phone) setFormErrors({ ...formErrors, phone: '' });
                      }}
                      className={`w-full bg-slate-800 border rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none transition-colors ${
                        formErrors.phone
                          ? 'border-rose-500 focus:border-rose-500'
                          : 'border-slate-700 focus:border-[#2376b8]'
                      }`}
                    />
                    {formErrors.phone && (
                      <p className="text-rose-400 text-[11px] font-medium mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{formErrors.phone}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                      Taxpayer Category / Slab
                    </label>
                    <select
                      value={form.taxBracket}
                      onChange={(e) => setForm({ ...form, taxBracket: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#2376b8]"
                    >
                      <option value="Salaried Individual">Salaried Individual</option>
                      <option value="Self-Employed / Business Owner">Self-Employed / Business Owner</option>
                      <option value="Senior Citizen (60+ Years)">Senior Citizen (60+ Years)</option>
                      <option value="Non-Resident Indian (NRI)">Non-Resident Indian (NRI)</option>
                      <option value="HUF / Family Entity">HUF / Family Entity</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                      Specific Tax Planning Inquiries
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Inquiries regarding ELSS vs PPF, Home loan principal vs interest deduction, 80D mediclaim limits..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#2376b8]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#f87b1f] hover:bg-[#d9620b] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-md shadow-[#f87b1f]/20 transition-all flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting Request...</span>
                      </>
                    ) : (
                      <span>Schedule Tax Consultation</span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
