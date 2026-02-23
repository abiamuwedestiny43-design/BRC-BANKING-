import type React from "react"
import { CreditCard, Building, TrendingUp, Home, Shield, Calculator, CheckCircle, Zap, ArrowRight, BarChart3, Globe, Lock } from "lucide-react"
import Link from "next/link"

const ServicesPage: React.FC = () => {
  return (
    <div className="bg-slate-50 text-slate-100 min-h-screen overflow-hidden font-sans">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-900/40 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-green-900/30 rounded-full blur-[120px] animate-pulse delay-700"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-900/50 border border-black/30 text-black text-sm font-bold tracking-wider mb-8">
            <Zap className="w-4 h-4" /> THE UNIFIED FINANCIAL ECOSYSTEM
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter mb-8">
            Comprehensive <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500 italic">
              Legacy Services.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-12">
            BRC BANKING BANK provides an elite suite of financial frameworks designed to empower your journey.
            From personal wealth to institutional leverage, we orchestrate success at every scale.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                icon: CreditCard,
                title: "Personal Banking",
                description: "Elite liquidity management and high-yield instruments for your lifestyle.",
                features: ["Zero-Fee Checking", "Smart Savings Units", "Instant Credit Lines", "Metal Debit Cards"],
                href: "/services/personal",
                color: "text-black",
                bg: "bg-black/10"
              },
              {
                icon: Building,
                title: "Business Banking",
                description: "Scalable commercial solutions engineered for corporate acceleration.",
                features: ["Operational Hubs", "Commercial Leverage", "Merchant Gateways", "Cash Flow Optimization"],
                href: "/services/business",
                color: "text-blue-400",
                bg: "bg-blue-500/10"
              },
              {
                icon: TrendingUp,
                title: "Investment Services",
                description: "AI-driven market analysis and expert portfolio architecture.",
                features: ["Quantitative Trading", "Estate Structuring", "Mutual Fund Access", "Direct Advisories"],
                href: "/services/investment",
                color: "text-purple-400",
                bg: "bg-purple-500/10"
              },
              {
                icon: Home,
                title: "Mortgage Services",
                description: "Sophisticated real estate financing for high-value acquisitions.",
                features: ["Jumbo Asset Loans", "Dynamic Refinancing", "First-Buyer Programs", "Custom Amortization"],
                href: "/services/mortgage",
                color: "text-orange-400",
                bg: "bg-orange-500/10"
              },
              {
                icon: Shield,
                title: "Asset Protection",
                description: "Comprehensive risk mitigation and insurance frameworks.",
                features: ["Key-Man Insurance", "Liability Shelters", "High-Value Asset Cover", "Health Ecosystems"],
                href: "/services/insurance",
                color: "text-red-400",
                bg: "bg-red-500/10"
              },
              {
                icon: Calculator,
                title: "Strategic Planning",
                description: "Professional multi-generational financial engineering.",
                features: ["Retirement Matrix", "Tax Efficiency Hub", "Estate Succession", "Education Anchors"],
                href: "/services/planning",
                color: "text-cyan-400",
                bg: "bg-cyan-500/10"
              },
            ].map((service, index) => (
              <div
                key={index}
                className="group p-10 rounded-[3rem] bg-white/60 border border-black/10 bg-white/80 transition-all duration-500 hover:-translate-y-2 flex flex-col"
              >
                <div className={`h-20 w-20 rounded-3xl ${service.bg} flex items-center justify-center mb-10 group-hover:scale-110 transition-transform`}>
                  <service.icon className={`w-10 h-10 ${service.color}`} />
                </div>
                <h3 className="text-2xl font-black text-black mb-4 italic tracking-tight">{service.title}</h3>
                <p className="text-slate-500 mb-10 flex-grow leading-relaxed">{service.description}</p>
                <ul className="space-y-4 mb-10">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-slate-800">
                      <CheckCircle className={`w-4 h-4 ${service.color}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href={service.href} className="block w-full">
                  <button className="w-full py-5 rounded-2xl bg-black/5 border border-black/10 text-black font-black hover:bg-black hover:text-white hover:border-black transition-all text-xs uppercase tracking-widest">
                    Get Started
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Infrastructure */}
      <section className="py-24 bg-[#00130b] relative border-y border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <p className="text-xs font-black tracking-[0.5em] uppercase text-black mb-6">The BRC BANKING Platform</p>
              <h2 className="text-4xl md:text-6xl font-black text-black mb-8 tracking-tighter leading-tight">Fortified <span className="text-black">Digital Architecture</span></h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-10">
                Behind every service is a military-grade infrastructure designed to protect your assets
                while providing instantaneous global access.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-black font-black">
                    <Lock className="w-5 h-5 text-black" /> AES-256
                  </div>
                  <p className="text-xs text-slate-500">Elite encryption standards</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-black font-black">
                    <BarChart3 className="w-5 h-5 text-black" /> REAL-TIME
                  </div>
                  <p className="text-xs text-slate-500">Instantaneous auditing</p>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-black to-green-600 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative rounded-[3rem] overflow-hidden border border-black/10">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80"
                  alt="Data Visualization"
                  className="w-full h-[400px] object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#00130b] via-transparent to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative">
        <div className="max-w-5xl mx-auto px-4">
          <div className="relative rounded-[4rem] bg-gradient-to-br from-[#003d24] to-slate-50 p-12 md:p-24 text-center space-y-10 overflow-hidden border border-black/10 shadow-3xl">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight relative z-10">Scale Your <br /> Potential Today.</h2>
            <p className="text-xl text-emerald-100/60 max-w-2xl mx-auto relative z-10 font-medium">
              Join the institutional-grade banking revolution. It takes less than 3 minutes to start your legacy.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
              <Link href="/register">
                <button className="w-full sm:w-auto bg-black hover:bg-black text-white px-12 py-6 rounded-2xl text-xl font-black transition-all hover:scale-105 shadow-2xl">
                  Open Account
                </button>
              </Link>
              <Link href="/contact">
                <button className="w-full sm:w-auto bg-black/5 hover:bg-black/10 text-black px-12 py-6 rounded-2xl text-xl font-bold border border-black/10 transition-all backdrop-blur-md">
                  Contact Support
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ServicesPage
