import { Car, Home, GraduationCap, CheckCircle, Zap, ArrowRight, Calculator, Clock, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

const LoansPage: React.FC = () => {
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
            <Calculator className="w-4 h-4" /> FLEXIBLE FINANCING SOLUTIONS
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter mb-8">
            Empowering Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500">
              Financial Ambitions.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-12">
            Experience tailored personal loans designed for speed, flexibility, and transparency.
            Whether it's a new vehicle, home renovation, or education, we provide the capital you need to move forward.
          </p>

          <div className="relative group max-w-5xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-green-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&auto=format&fit=crop&q=80"
                alt="Loans"
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#001c10] via-transparent to-transparent"></div>
              <div className="absolute bottom-10 left-10 text-left">
                <div className="flex items-center gap-4 p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                  <div className="h-12 w-12 rounded-xl bg-emerald-500 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-[#001c10]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">Instant Approval</h4>
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-black text-emerald-400">Decision in under 24 hours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Loan Types */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <p className="text-xs font-black tracking-[0.5em] uppercase text-emerald-500 mb-4">Our Frameworks</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Tailored Loan Packages</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Car,
                title: 'Auto Evolution',
                rate: '3.99% APR',
                description: 'Future-ready financing for your next generation vehicle.',
                color: 'text-emerald-400',
                bg: 'bg-emerald-500/10',
                features: ['Up to 84 month terms', 'Zero prepayment fees', 'Smart refinancing']
              },
              {
                icon: Home,
                title: 'Home Catalyst',
                rate: '4.49% APR',
                description: 'Transform your space with intelligent capital funding.',
                color: 'text-blue-400',
                bg: 'bg-blue-500/10',
                features: ['Up to $100k limit', 'Fixed rate security', 'No collateral required']
              },
              {
                icon: GraduationCap,
                title: 'Scholar Fund',
                rate: '3.49% APR',
                description: 'Investing in the intellectual capital of the future.',
                color: 'text-purple-400',
                bg: 'bg-purple-500/10',
                features: ['Flexible deferment', 'Low interest anchor', 'Zero origination fees']
              }
            ].map((loan, index) => (
              <div key={index} className="group p-10 rounded-[3rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all duration-500 hover:-translate-y-2 flex flex-col">
                <div className={`h-16 w-16 rounded-2xl ${loan.bg} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  <loan.icon className={`w-8 h-8 ${loan.color}`} />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">{loan.title}</h3>
                <div className={`text-xl font-bold ${loan.color} mb-6`}>{loan.rate}</div>
                <p className="text-slate-500 mb-8 flex-grow">{loan.description}</p>

                <ul className="space-y-4 mb-10">
                  {loan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-slate-300">
                      <CheckCircle className={`w-4 h-4 ${loan.color}`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href="/register">
                  <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black group-hover:bg-emerald-500 group-hover:text-[#001c10] group-hover:border-emerald-500 transition-all">
                    Apply Now
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-24 bg-[#00130b] relative border-y border-white/5 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-500/5 rounded-full blur-[120px]"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="p-12 rounded-[3.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-2xl">
            <h2 className="text-3xl font-black text-center text-white mb-12">Loan Architect</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">Loan Amount</label>
                  <input type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="$10,000" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">Loan Term</label>
                  <select className="w-full bg-[#00130b] border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none">
                    <option>1 Year</option>
                    <option>3 Years</option>
                    <option>5 Years</option>
                    <option>7 Years</option>
                  </select>
                </div>
              </div>
              <div className="space-y-6 text-center md:text-left flex flex-col justify-end">
                <div className="p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 mb-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2">ESTIMATED MONTHLY</p>
                  <p className="text-5xl font-black text-white">$247.50</p>
                </div>
                <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-[#001c10] py-5 rounded-2xl font-black transition-all hover:scale-[1.02] shadow-xl shadow-emerald-500/20">
                  Submit Proposal
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-center text-white mb-20 tracking-tighter italic decoration-emerald-500 underline underline-offset-8">The Execution Path</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { step: '01', title: 'Digital Submission', description: 'Complete our high-speed secure application in minutes.', icon: ShieldCheck },
              { step: '02', title: 'AI Verification', description: 'Our algorithms process your request for instant auditing.', icon: Clock },
              { step: '03', title: 'Funds Deposit', description: 'Funds are transferred directly to your account immediately.', icon: Zap }
            ].map((item, index) => (
              <div key={index} className="relative group p-10 rounded-[3rem] bg-white/[0.02] border border-white/5">
                <div className="absolute top-10 right-10 text-5xl font-black text-emerald-500/10 group-hover:text-emerald-500/20 transition-colors">
                  {item.step}
                </div>
                <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-8">
                  <item.icon className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-black text-white mb-4 italic">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoansPage;
