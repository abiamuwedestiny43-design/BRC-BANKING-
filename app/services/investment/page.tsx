"use client"

import { motion } from "framer-motion"
import { LineChart, TrendingUp, Gem, GanttChartSquare, Search, Award, ArrowRight, ShieldCheck, BarChart4 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function InvestmentServicesPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  }

  const features = [
    {
      title: "Portfolio Management",
      description: "Evidence-based allocation with periodic rebalancing and automated tax-aware placement strategies.",
      icon: GanttChartSquare,
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      title: "Wealth Preservation",
      description: "Advanced asset protection and retirement sequencing to ensure long-term capital integrity.",
      icon: Gem,
      image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80",
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    }
  ]

  const metrics = [
    { title: "Global Spread", desc: "Diversification across 15+ geopolitical sectors and 40+ asset classes.", icon: Search },
    { title: "Risk Mitigation", desc: "Proprietary volatility dampening and factor-based hedging strategies.", icon: ShieldCheck },
    { title: "Performance Audio", desc: "Transparent, real-time reporting with high-fidelity data visualization.", icon: LineChart }
  ]

  return (
    <div className="min-h-screen bg-[#001c10] text-slate-200 selection:bg-emerald-500/30">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden pt-32">
        <div
          className="absolute inset-0 bg-fixed bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1920&q=80')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#001c10]/80 via-[#001c10]/60 to-[#001c10]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
              <TrendingUp className="w-3 h-3" /> Capital Management
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter lowercase">
              investment <span className="text-emerald-500 italic">services</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl md:text-2xl text-slate-400 font-medium">
              Disciplined portfolios, evidence-based strategies, and tax-aware sequencing for long-term growth.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="flex flex-wrap justify-center gap-4 pt-8"
          >
            <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-[#001c10] font-black px-10 h-16 rounded-2xl shadow-xl shadow-emerald-500/20 text-lg uppercase tracking-tight" asChild>
              <Link href="/register">Start Investing</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white font-black px-10 h-16 rounded-2xl backdrop-blur-md text-lg uppercase tracking-tight" asChild>
              <Link href="/about">Learn More</Link>
            </Button>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <div className="w-[1px] h-12 bg-gradient-to-b from-transparent to-emerald-500" />
          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Scroll Down</p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-20 items-center">
            <motion.div {...fadeInUp} className="lg:col-span-6 space-y-10">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight">
                Compounding <br /><span className="text-emerald-500">Human Capital</span>
              </h2>
              <div className="space-y-6 text-lg text-slate-400 font-medium leading-relaxed">
                <p>
                  Build long-term wealth with diversified strategies and guidance that aligns with your risk tolerance and
                  timeline. We combine disciplined portfolio construction with practical advice, so you stay invested through
                  cycles and capture compounding gains.
                </p>
                <p>
                  Our methodology prioritizes risk-adjusted returns, minimizing drawdown exposure while maximizing participation
                  in global market expansion.
                </p>
              </div>
              <div className="flex gap-10 pt-6">
                <div className="space-y-1 text-center">
                  <p className="text-3xl font-black text-white tracking-tighter">15+</p>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Asset Classes</p>
                </div>
                <div className="space-y-1 text-center">
                  <p className="text-3xl font-black text-emerald-500 tracking-tighter">24/7</p>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Market Watch</p>
                </div>
              </div>
            </motion.div>

            <motion.div {...fadeInUp} className="lg:col-span-6 relative">
              <div className="absolute -inset-10 bg-emerald-500/10 blur-[100px] rounded-full opacity-20" />
              <div className="relative p-8 rounded-[3rem] bg-white/[0.02] border border-white/10 backdrop-blur-md space-y-8 shadow-3xl overflow-hidden group">
                <div className="flex items-center justify-between mb-8">
                  <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                    <BarChart4 className="w-6 h-6" />
                  </div>
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Live Flux Output</p>
                </div>
                <div className="space-y-3">
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "70%" }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-emerald-500"
                    />
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "45%" }}
                      transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                      className="h-full bg-blue-500"
                    />
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "85%" }}
                      transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
                      className="h-full bg-slate-500"
                    />
                  </div>
                </div>
                <p className="text-sm text-slate-500 font-medium italic">"Algorithmically managed portfolios outperform emotional triggers in 94% of observed market cycles."</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-24 bg-black/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-10">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                {...fadeInUp}
                transition={{ delay: i * 0.2 }}
                className="group relative h-[600px] rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl"
              >
                <img
                  src={feature.image}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  alt={feature.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute bottom-0 p-12 space-y-6">
                  <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-md shadow-2xl transition-transform group-hover:scale-110", feature.bg, feature.color)}>
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black text-white tracking-tighter">{feature.title}</h3>
                    <p className="text-slate-400 font-medium leading-relaxed max-w-sm">{feature.description}</p>
                  </div>
                  <Button variant="ghost" className="text-emerald-500 font-black p-0 h-auto hover:bg-transparent group-hover:translate-x-2 transition-transform">
                    Learn More <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {metrics.map((m, i) => (
              <motion.div
                key={i}
                {...fadeInUp}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all group"
              >
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-8 border border-emerald-500/20 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/10">
                  <m.icon className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-black text-white lowercase tracking-tighter mb-2">{m.title}</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-32 relative overflow-hidden bg-gradient-to-b from-transparent to-[#00130b]">
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-12">
          <motion.div {...fadeInUp} className="space-y-4">
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
              Start Scaling your <span className="text-emerald-500 italic">Net Worth</span>
            </h2>
            <p className="text-xl text-slate-400 font-medium">
              Join the upper echelon of investors who leverage the PrimeHarbor investment platform.
            </p>
          </motion.div>

          <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="flex justify-center flex-wrap gap-6">
            <Button size="lg" className="bg-emerald-500 text-[#001c10] hover:bg-emerald-400 font-black px-12 h-16 rounded-2xl shadow-xl shadow-emerald-500/20 text-lg uppercase tracking-tight" asChild>
              <Link href="/register">Open Account</Link>
            </Button>
            <Button size="lg" variant="ghost" className="text-emerald-500 font-black px-12 h-16 rounded-2xl border border-emerald-500/20 hover:bg-emerald-500/10 text-lg uppercase tracking-tight" asChild>
              <Link href="/contact">Financial Planning</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}
