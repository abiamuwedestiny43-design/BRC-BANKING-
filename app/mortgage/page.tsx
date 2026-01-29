import { CheckCircle, Calculator, Home, DollarSign, Star, Zap, ArrowRight, Shield, Globe, Award } from 'lucide-react';
import Link from 'next/link';

const MortgagePage: React.FC = () => {
  return (
    <div className="bg-[#001c10] text-slate-100 min-h-screen overflow-hidden font-sans">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-900/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-green-900/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-900/50 border border-emerald-500/30 text-emerald-400 text-sm font-bold tracking-wider mb-8">
            <Home className="w-4 h-4" /> PREMIUM REAL ESTATE FINANCING
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter mb-8">
            Ownership Reimagined <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500 italic">
              Legacy Starts Here.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-12">
            Secure your sanctuary with our intelligent mortgage frameworks. Whether you're a first-time buyer
            or seeking high-value property leverage, PRIMEHARBOR BANK provides the most sophisticated solutions in the market.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20 relative z-20">
            <Link href="/register">
              <button className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-[#001c10] px-10 py-5 rounded-2xl text-lg font-black transition-all hover:scale-105 shadow-xl shadow-emerald-500/20">
                Get Pre-Approved
              </button>
            </Link>
            <button className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white px-10 py-5 rounded-2xl text-lg font-bold border border-white/20 transition-all backdrop-blur-md">
              Calculate Payment
            </button>
          </div>

          <div className="relative group max-w-6xl mx-auto mt-20">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-green-600 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative rounded-[3rem] overflow-hidden border border-white/10 shadow-3xl">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&auto=format&fit=crop&q=90"
                alt="Luxury Mortgage"
                className="w-full h-[500px] object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#001c10] via-transparent to-transparent"></div>
              <div className="absolute bottom-10 left-10 text-left space-y-4">
                <div className="px-5 py-2 inline-block rounded-full bg-emerald-500 text-[#001c10] text-[10px] font-black uppercase tracking-widest">Global Portfolio Coverage</div>
                <h3 className="text-4xl font-black text-white leading-tight">Elite Property Financing</h3>
                <p className="text-slate-200 font-medium max-w-lg">Advanced protocols for domestic and international real estate acquisitions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mortgage Layouts */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <p className="text-xs font-black tracking-[0.5em] uppercase text-emerald-500 mb-4">Financial Blueprints</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Sophisticated Mortgage Options</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {[
              {
                title: 'Classical Fixed',
                description: 'Immutable security with fixed-rate frameworks for long-term stability.',
                features: ['30-year bedrock terms', 'Locked APR protocols', 'Zero inflation volatility'],
                icon: Shield,
                color: 'text-emerald-400',
                bg: 'bg-emerald-500/10'
              },
              {
                title: 'Global Elite (Jumbo)',
                description: 'Unmatched leverage for high-value properties and luxury estates.',
                features: ['Up to $5M+ funding', 'Bespoke underwriting', 'Portfolio lending options'],
                icon: Award,
                color: 'text-blue-400',
                bg: 'bg-blue-500/10'
              },
              {
                title: 'Agile Variable (ARM)',
                description: 'Adaptive interest structures for clients seeking market performance.',
                features: ['Hybrid entry rates', 'Annual cap protection', 'Conversion options'],
                icon: Zap,
                color: 'text-purple-400',
                bg: 'bg-purple-500/10'
              },
              {
                title: 'Institutional Refinancing',
                description: 'Re-engineer your existing debt for optimized cash flow and equity.',
                features: ['Instant rate audits', 'Cash-out protocols', 'Consolidated management'],
                icon: Globe,
                color: 'text-orange-400',
                bg: 'bg-orange-500/10'
              }
            ].map((mortgage, index) => (
              <div key={index} className="group p-10 rounded-[3.5rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all duration-500 hover:-translate-y-2 flex flex-col md:flex-row gap-8 items-start">
                <div className={`h-20 w-20 rounded-3xl ${mortgage.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                  <mortgage.icon className={`w-10 h-10 ${mortgage.color}`} />
                </div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-black text-white mb-4 italic">{mortgage.title}</h3>
                  <p className="text-slate-500 mb-8 leading-relaxed">{mortgage.description}</p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mortgage.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm text-slate-300">
                        <CheckCircle className={`w-4 h-4 ${mortgage.color}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="mt-10 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black hover:bg-emerald-500 hover:text-[#001c10] transition-all text-xs uppercase tracking-widest">
                    View Blueprint
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics (Calculator) */}
      <section className="py-24 bg-[#00130b] relative border-y border-white/5 overflow-hidden">
        <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-emerald-500/10 rounded-full blur-[100px]"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="p-12 md:p-20 rounded-[4rem] bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-3xl">
            <h2 className="text-4xl font-black text-center text-white mb-16 tracking-tighter">Financial Projection Engine</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-4">Total Asset Value</label>
                  <input type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:outline-none focus:border-emerald-500 text-xl font-bold" placeholder="$500,000" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-4">Initial Capital (Down Payment)</label>
                  <input type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:outline-none focus:border-emerald-500 text-xl font-bold" placeholder="$100,000" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-4">Target Rate (%)</label>
                    <input type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:outline-none focus:border-emerald-500 font-bold" placeholder="3.5" step="0.1" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-4">Time Horizon</label>
                    <select className="w-full bg-[#00130b] border border-white/10 rounded-2xl p-5 text-white focus:outline-none focus:border-emerald-500 font-bold appearance-none">
                      <option>30 Years</option>
                      <option>15 Years</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between pt-6 lg:pt-0">
                <div className="space-y-6">
                  <div className="flex justify-between items-center p-6 rounded-3xl bg-white/5 border border-white/5">
                    <span className="text-slate-400 font-bold">Principal & Interest</span>
                    <span className="text-2xl font-black text-emerald-400">$1,796</span>
                  </div>
                  <div className="flex justify-between items-center p-6 rounded-3xl bg-white/5 border border-white/5">
                    <span className="text-slate-400 font-bold">Estimated Tax</span>
                    <span className="text-2xl font-black text-blue-400">$450</span>
                  </div>
                  <div className="flex justify-between items-center p-6 rounded-3xl bg-white/5 border border-white/5">
                    <span className="text-slate-400 font-bold">Insurance</span>
                    <span className="text-2xl font-black text-purple-400">$120</span>
                  </div>
                </div>

                <div className="mt-12 p-10 rounded-[2.5rem] bg-gradient-to-br from-emerald-500/20 to-green-600/20 border border-emerald-500/30 text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-4 italic">TOTAL MONTHLY PROJECTION</p>
                  <p className="text-6xl font-black text-white">$2,366</p>
                  <button className="w-full mt-10 bg-emerald-500 hover:bg-emerald-400 text-[#001c10] py-5 rounded-2xl font-black transition-all hover:scale-105 shadow-2xl">
                    Finalize Application
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black text-center text-white mb-20">The Acquisition Cycle</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: '01', title: 'Audit Pre-Approval', desc: 'Real-time financial review using our secure systems.', icon: Calculator },
              { step: '02', title: 'Asset Identification', desc: 'Secure the property within your established budget.', icon: Home },
              { step: '03', title: 'Smart Negotiation', desc: 'Leveraging our institutional power to finalize terms.', icon: DollarSign },
              { step: '04', title: 'Rapid Closing', desc: 'Digital signature and immediate access.', icon: Star }
            ].map((item, index) => (
              <div key={index} className="relative p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 group hover:bg-white/[0.04] transition-all">
                <div className="text-6xl font-black text-emerald-500/5 mb-8 group-hover:text-emerald-500/10 transition-colors">{item.step}</div>
                <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-8">
                  <item.icon className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-black text-white mb-4 italic leading-tight">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MortgagePage;
