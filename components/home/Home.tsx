import { ChevronDown, Shield, TrendingUp, Home, CreditCard, Clock, ArrowRight, Building, Globe, Zap, Lock, BarChart3 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const HomePages: React.FC = () => {
  return (
    <div className="bg-[#001c10] text-slate-100 overflow-hidden font-sans">
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden pt-32">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-900/40 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-green-900/30 rounded-full blur-[120px] animate-pulse delay-700"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-900/50 border border-emerald-500/30 text-emerald-400 text-sm font-bold tracking-wider animate-fade-in">
                <Zap className="w-4 h-4" /> REVOLUTIONIZING DIGITAL FINANCE
              </div>
              <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter">
                The Future of <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500">
                  Banking is Here.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Experience a premium ecosystem of financial tools designed for the modern age. Secure, lightning-fast, and built on the foundation of trust.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                <Link href="/register">
                  <button className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-[#001c10] px-10 py-5 rounded-2xl text-lg font-black transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 group">
                    Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link href="/about">
                  <button className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white px-10 py-5 rounded-2xl text-lg font-bold border border-white/20 transition-all hover:border-emerald-500/50 backdrop-blur-md">
                    Learn More
                  </button>
                </Link>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-8 pt-4">
                <div className="text-center lg:text-left">
                  <p className="text-2xl font-black text-white">500K+</p>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Active Users</p>
                </div>
                <div className="h-10 w-[1px] bg-white/10"></div>
                <div className="text-center lg:text-left">
                  <p className="text-2xl font-black text-white">99.9%</p>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Uptime</p>
                </div>
                <div className="h-10 w-[1px] bg-white/10"></div>
                <div className="text-center lg:text-left">
                  <p className="text-2xl font-black text-white">$2B+</p>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Processed</p>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-green-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                <Image
                  src="/modern_banking_hero_1767421157454.png"
                  alt="Modern Banking Interface"
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#001c10] via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">Secure by Design</h4>
                      <p className="text-xs text-slate-400 uppercase tracking-widest">End-to-End Encryption Enabled</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer opacity-50 hover:opacity-100 transition-opacity">
          <p className="text-[10px] font-black tracking-[0.3em] uppercase text-emerald-400">Scroll to explore</p>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-12 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 overflow-hidden">
          <p className="text-center text-[10px] font-black tracking-[0.4em] uppercase text-slate-500 mb-8 italic">POWERING FINANCIAL SUCCESS FOR GLOBAL ENTITIES</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Logos could go here */}
            <div className="text-2xl font-black italic tracking-tighter">FINTECH</div>
            <div className="text-2xl font-black italic tracking-tighter">HB BANK</div>
            <div className="text-2xl font-black italic tracking-tighter">SECURE.IO</div>
            <div className="text-2xl font-black italic tracking-tighter">VENTURE CAP</div>
            <div className="text-2xl font-black italic tracking-tighter">CRYPTO TRUST</div>
          </div>
        </div>
      </section>

      {/* Investment Section */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-500/10 rounded-full blur-[100px]"></div>
              <Image
                src="/global_investment_growth_1767421250480.png"
                alt="Investment Growth"
                width={600}
                height={600}
                className="relative z-10 rounded-[2.5rem] shadow-2xl border border-white/10"
              />
            </div>
            <div className="order-1 lg:order-2 space-y-8 text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                Unlock Intelligent <br />
                <span className="text-emerald-400 italic">Investment Strategies</span>
              </h2>
              <p className="text-lg text-slate-400 leading-relaxed">
                Our AI-driven algorithms and expert market analysis provide you with an unfair advantage in the global markets. From sustainable energy to high-growth tech, your portfolio is engineered for excellence.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-colors group">
                  <div className="h-12 w-12 rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/20 flex items-center justify-center mb-4 transition-transform group-hover:-translate-y-1">
                    <TrendingUp className="w-6 h-6 text-[#001c10]" />
                  </div>
                  <h4 className="font-bold text-lg mb-2 text-white">Market Growth</h4>
                  <p className="text-sm text-slate-500">Capitalize on emerging market trends with precision.</p>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-colors group">
                  <div className="h-12 w-12 rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/20 flex items-center justify-center mb-4 transition-transform group-hover:-translate-y-1">
                    <BarChart3 className="w-6 h-6 text-[#001c10]" />
                  </div>
                  <h4 className="font-bold text-lg mb-2 text-white">Data Analytics</h4>
                  <p className="text-sm text-slate-500">Real-time insights tailored to your financial goals.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section (Darker Background) */}
      <section className="py-32 bg-[#00130b] relative border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 space-y-4">
            <p className="text-xs font-black tracking-[0.5em] uppercase text-emerald-500">Uncompromising Protection</p>
            <h2 className="text-4xl md:text-6xl font-black tracking-tightest">Fortress-Grade Security</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Your assets are protected by the world's most advanced biometric and security measures. We don't just secure your money; we protect your future.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 relative h-[400px] rounded-[2rem] overflow-hidden group border border-white/10">
              <Image
                src="/secure_banking_icon_1767421223969.png"
                alt="Secure Vault"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#00130b] via-[#00130b]/40 to-transparent"></div>
              <div className="absolute bottom-10 left-10 max-w-sm space-y-4">
                <div className="px-4 py-1 inline-block rounded-full bg-emerald-500 text-[#001c10] text-[10px] font-black uppercase tracking-widest">Live Security Feed</div>
                <h3 className="text-3xl font-black text-white leading-tight underline decoration-emerald-500 underline-offset-8">Multi-Factor Biometric Auth</h3>
                <p className="text-slate-200 font-medium">Verification in milliseconds with zero-knowledge proof technology.</p>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {[
                { icon: Lock, title: '256-bit AES', desc: 'Military-grade encryption for every byte of data.' },
                { icon: Globe, title: 'Global Compliance', desc: 'Strict adherence to international financial regulations.' },
                { icon: Clock, title: 'Anti-Fraud AI', desc: 'Active monitoring 24/7 with instant anomaly detection.' }
              ].map((item, i) => (
                <div key={i} className="flex-1 p-8 rounded-[2rem] bg-white/5 border border-white/10 flex flex-col justify-center gap-4 hover:bg-emerald-900/10 transition-colors">
                  <item.icon className="w-8 h-8 text-emerald-400" />
                  <h5 className="text-xl font-bold text-white">{item.title}</h5>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-emerald-500/5 rounded-full blur-[100px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 px-2 lg:px-0">
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Unified Banking <br /> <span className="text-slate-500 italic">One Ecosystem</span></h2>
              <p className="text-slate-400 max-w-md">The only platform you'll ever need for life's financial journey.</p>
            </div>
            <Link href="/services">
              <button className="px-8 py-4 rounded-xl bg-white/5 border border-white/20 text-white font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                Explore Services <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: CreditCard, title: 'Personal Banking', link: '/services/personal', color: 'bg-emerald-500', bg: 'bg-emerald-500/10' },
              { icon: Building, title: 'Business Banking', link: '/services/business', color: 'bg-blue-500', bg: 'bg-blue-500/10' },
              { icon: Home, title: 'Real Estate Loans', link: '/services/mortgage', color: 'bg-purple-500', bg: 'bg-purple-500/10' },
              { icon: TrendingUp, title: 'Global Markets', link: '/services/investment', color: 'bg-orange-500', bg: 'bg-orange-500/10' }
            ].map((service, index) => (
              <div key={index} className="group relative p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all duration-500 hover:-translate-y-2">
                <div className={`h-16 w-16 rounded-2xl ${service.bg} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  <service.icon className={`w-8 h-8 ${service.color.replace('bg-', 'text-')}`} />
                </div>
                <h3 className="text-2xl font-black text-white mb-4 leading-tight">{service.title}</h3>
                <p className="text-sm text-slate-500 mb-8 leading-relaxed">Tailored financial solutions optimized for efficiency and growth in an ever-changing landscape.</p>
                <Link href={service.link} className="inline-flex items-center gap-2 text-emerald-400 font-black text-xs uppercase tracking-widest hover:text-emerald-300 transition-colors">
                  View Service <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32">
        <div className="max-w-5xl mx-auto px-4">
          <div className="relative rounded-[3rem] bg-gradient-to-br from-[#003d24] to-[#001c10] p-12 md:p-20 text-center space-y-8 overflow-hidden border border-white/10 shadow-3xl shadow-emerald-900/40">
            <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[100px]"></div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter relative z-10 leading-[1.1]">Ready to Join the <br /> Financial Elite?</h2>
            <p className="text-lg md:text-xl text-emerald-100/60 max-w-2xl mx-auto font-medium relative z-10">
              Registration takes less than 3 minutes. Your journey to financial freedom starts with a single click.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10 pt-4">
              <Link href="/register" className="w-full sm:w-auto">
                <button className="w-full bg-white text-[#001c10] px-10 py-5 rounded-2xl text-lg font-black hover:bg-emerald-50 transition-all hover:scale-105 shadow-xl">
                  Open Your Account
                </button>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <button className="w-full bg-emerald-600/20 text-white border border-white/10 px-10 py-5 rounded-2xl text-lg font-bold hover:bg-emerald-600/30 transition-all">
                  Speak to Advisor
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePages;
