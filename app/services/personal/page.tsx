"use client"

import { motion } from "framer-motion"
import { ShieldCheck, Smartphone, PiggyBank, CreditCard, Headset, Wallet, ArrowRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PersonalBankingPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  }

  const features = [
    {
      title: "Checking & Savings",
      description: "High-velocity accounts with real-time processing and automated rounding tools.",
      icon: Wallet,
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
      color: "text-black",
      bg: "bg-black/10"
    },
    {
      title: "Global Credit Line",
      description: "Fast, paperless lending with transparent APR and international spending power.",
      icon: CreditCard,
      image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80",
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    }
  ]

  const metrics = [
    { title: "Smart Ecosystem", desc: "Category budgets and AI-driven spending analytics.", icon: Smartphone },
    { title: "Security Matrix", desc: "Device binding and multi-factor authentication methods.", icon: ShieldCheck },
    { title: "Human Support", desc: "24/7 access to specialized financial advisors.", icon: Headset }
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-black selection:bg-black/30">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden pt-32">
        <div
          className="absolute inset-0 bg-fixed bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=1920&q=80')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50/80 via-slate-50/60 to-slate-50" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/10 border border-black/20 text-black text-[10px] font-black uppercase tracking-[0.3em] mb-4">
              <ShieldCheck className="w-3 h-3" /> Retail Banking
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-black tracking-tighter lowercase">
              personal <span className="text-black italic">banking</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl md:text-2xl text-slate-600 font-medium">
              Everyday money re-engineered—secure accounts, high-velocity tools, and precision insights.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="flex flex-wrap justify-center gap-4 pt-8"
          >
            <Button size="lg" className="bg-black hover:bg-black text-white font-black px-10 h-16 rounded-2xl shadow-xl shadow-black/10 text-lg uppercase tracking-tight" asChild>
              <Link href="/register">Open Account</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-black/10 bg-black/5 hover:bg-black/10 text-black font-black px-10 h-16 rounded-2xl backdrop-blur-md text-lg uppercase tracking-tight" asChild>
              <Link href="/about">Learn More</Link>
            </Button>
          </motion.div>
        </div>

        {/* Decorative Scrollers */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <div className="w-[1px] h-12 bg-gradient-to-b from-transparent to-black" />
          <p className="text-[10px] font-black uppercase tracking-widest text-black">Scroll Down</p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-32 relative">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-black/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-20 items-center">
            <motion.div {...fadeInUp} className="lg:col-span-7 space-y-10">
              <h2 className="text-4xl md:text-5xl font-black text-black tracking-tighter leading-[1.1]">
                Engineered for <span className="text-slate-600">Financial Fluidity</span>
              </h2>
              <div className="space-y-6 text-lg text-slate-600 font-medium leading-relaxed">
                <p>
                  Our Personal Banking suite is designed to make money management simple, secure, and rewarding. From
                  fee-friendly checking accounts to high-yield savings, we help you build healthier financial habits without
                  friction.
                </p>
                <p>
                  You get modern tools like real-time alerts, budgeting insights, and instant card controls—all inside
                  a clean, secure experience. Whether you're organizing everyday spending, saving for a milestone, or building
                  an emergency fund, our products are engineered to reduce complexity and improve outcomes.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-8 pt-6">
                <div className="space-y-2">
                  <p className="text-4xl font-black text-black tracking-tighter">0.00%</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Maintenance Fees</p>
                </div>
                <div className="space-y-2">
                  <p className="text-4xl font-black text-black tracking-tighter">Instant</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Processing</p>
                </div>
              </div>
            </motion.div>

            <motion.div {...fadeInUp} className="lg:col-span-5 relative">
              <div className="absolute -inset-4 bg-black/20 blur-2xl rounded-full opacity-30" />
              <div className="relative aspect-square rounded-[3rem] bg-gradient-to-br from-black/5 to-transparent p-1 border border-black/10 overflow-hidden group shadow-3xl">
                <img
                  src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80"
                  className="w-full h-full object-cover rounded-[2.8rem] transition-transform duration-1000 group-hover:scale-110"
                  alt="Financial Insights"
                />
                <div className="absolute inset-0 bg-emerald-950/40 mix-blend-multiply" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-24 bg-black/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-10">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                {...fadeInUp}
                transition={{ delay: i * 0.2 }}
                className="group relative h-[600px] rounded-[3rem] overflow-hidden border border-black/10 shadow-2xl"
              >
                <img
                  src={feature.image}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  alt={feature.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-800 via-black/40 to-transparent" />
                <div className="absolute bottom-0 p-12 space-y-6">
                  <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center border border-black/10 backdrop-blur-md shadow-2xl transition-transform group-hover:scale-110", feature.bg, feature.color)}>
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black text-black tracking-tighter">{feature.title}</h3>
                    <p className="text-slate-600 font-medium leading-relaxed max-w-sm">{feature.description}</p>
                  </div>
                  <Button variant="ghost" className="text-black font-black p-0 h-auto hover:bg-transparent group-hover:translate-x-2 transition-transform">
                    Get Started <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {metrics.map((m, i) => (
              <motion.div
                key={i}
                {...fadeInUp}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-[2.5rem] bg-white/60 border border-black/10 bg-white/80 transition-all group"
              >
                <div className="h-12 w-12 rounded-xl bg-black/10 flex items-center justify-center text-black mb-8 border border-black/20 group-hover:scale-110 transition-transform shadow-lg shadow-black/10">
                  <m.icon className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-black text-black lowercase tracking-tighter mb-2">{m.title}</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5 backdrop-blur-3xl" />
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center space-y-12">
          <motion.div {...fadeInUp} className="space-y-4">
            <h2 className="text-5xl md:text-7xl font-black text-black tracking-tighter leading-none">
              Ready to Upgrade your <span className="text-black italic">Financial Experience?</span>
            </h2>
            <p className="text-xl text-slate-600 font-medium max-w-2xl mx-auto">
              Join thousands of users who have streamlined their economic existence through the BRC BANKING platform.
            </p>
          </motion.div>

          <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="flex justify-center flex-wrap gap-6">
            <Button size="lg" className="bg-white text-white hover:bg-slate-200 font-black px-12 h-16 rounded-2xl shadow-2xl text-lg uppercase tracking-tight" asChild>
              <Link href="/register">Create Account</Link>
            </Button>
            <Button size="lg" variant="ghost" className="text-black font-black px-12 h-16 rounded-2xl border border-black/20 hover:bg-black/10 text-lg uppercase tracking-tight" asChild>
              <Link href="/contact">Speak to Advisor</Link>
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
