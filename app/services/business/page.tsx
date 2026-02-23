"use client"

import { motion } from "framer-motion"
import { Building2, Users, Zap, BarChart3, Globe, Briefcase, ArrowRight, ShieldCheck, PieChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function BusinessBankingPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  }

  const features = [
    {
      title: "Enterprise Accounts",
      description: "Operate with multi-user permissions, granular role controls, and global treasury management.",
      icon: Building2,
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
      color: "text-black",
      bg: "bg-black/10"
    },
    {
      title: "Commercial Flux",
      description: "Fixed-term financing and revolving credit lines designed for rapid scaling and inventory cycles.",
      icon: Zap,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    }
  ]

  const metrics = [
    { title: "Team Management", desc: "Define roles for founders, finance teams, and auditors with ease.", icon: Users },
    { title: "Global Mesh", desc: "Execute cross-border vendor payments with local currency settlement.", icon: Globe },
    { title: "Flow Analytics", desc: "Deep cash flow visibility with automated reporting and categorization.", icon: BarChart3 }
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-black selection:bg-black/30">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden pt-32">
        <div
          className="absolute inset-0 bg-fixed bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1920&q=80')" }}
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
              <Zap className="w-3 h-3" /> Enterprise Infrastructure
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-black tracking-tighter lowercase">
              business <span className="text-black italic">banking</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl md:text-2xl text-slate-600 font-medium">
              Scale with confidence. BRC BANKING provides the liquidity, controls, and insights your venture demands.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="flex flex-wrap justify-center gap-4 pt-8"
          >
            <Button size="lg" className="bg-black hover:bg-black text-white font-black px-10 h-16 rounded-2xl shadow-xl shadow-black/10 text-lg uppercase tracking-tight" asChild>
              <Link href="/register">Launch Business Account</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-black/10 bg-black/5 hover:bg-black/10 text-black font-black px-10 h-16 rounded-2xl backdrop-blur-md text-lg uppercase tracking-tight" asChild>
              <Link href="/about">Platform Overview</Link>
            </Button>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <div className="w-[1px] h-12 bg-gradient-to-b from-transparent to-black" />
          <p className="text-[10px] font-black uppercase tracking-widest text-black">Scroll Down</p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-20 items-center">
            <motion.div {...fadeInUp} className="lg:col-span-12 text-center mb-20">
              <h2 className="text-5xl md:text-7xl font-black text-black tracking-tighter mb-8">
                The Operating System for <span className="text-black">Corporate Finance</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-4xl mx-auto font-medium leading-relaxed">
                Modern ventures require more than just an account. You need a platform that understands cash flow cycles,
                manages team spending, and provides the capital required for expansion.
              </p>
            </motion.div>

            <motion.div {...fadeInUp} className="lg:col-span-5 relative">
              <div className="p-10 rounded-[3rem] bg-white/60 border border-black/10 backdrop-blur-md space-y-8 shadow-3xl">
                <div className="h-16 w-16 rounded-2xl bg-black/20 flex items-center justify-center text-black border border-black/30">
                  <PieChart className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-black text-black tracking-tighter lowercase">Liquidity Management</h3>
                <p className="text-slate-600 font-medium">Manage operating and reserve accounts with granular roles. Automate approvals and vendor payments, and get richer context for every transaction.</p>
                <div className="pt-6 border-t border-black/10 grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-2xl font-black text-black">256-bit</p>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Encyption Standard</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-black">99.9%</p>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Uptime</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div {...fadeInUp} className="lg:col-span-7">
              <div className="relative aspect-video rounded-[3rem] overflow-hidden border border-black/10 group shadow-3xl">
                <img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&q=80" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Business Growth" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-50 to-transparent opacity-60" />
                <div className="absolute bottom-10 left-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black text-white text-[9px] font-black uppercase tracking-widest">Secure Platform</div>
                </div>
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
                    Deploy Solution <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Features */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-black tracking-tighter lowercase">Platform <span className="text-slate-500 italic">Capabilities</span></h2>
            <div className="w-20 h-1 bg-black mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {metrics.map((m, i) => (
              <motion.div
                key={i}
                {...fadeInUp}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-[2.5rem] bg-white/60 border border-black/10 bg-white/80 transition-all group text-left"
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

      {/* Final CTA */}
      <section className="py-32 relative overflow-hidden bg-gradient-to-b from-transparent to-[#00130b]">
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center space-y-12">
          <motion.div {...fadeInUp} className="space-y-4">
            <h2 className="text-5xl md:text-7xl font-black text-black tracking-tighter">
              Ready to <span className="text-black">Accelerate?</span>
            </h2>
            <p className="text-xl text-slate-600 font-medium max-w-2xl mx-auto">
              Onboard your venture to the BRC BANKING ecosystem and experience the future of commercial banking.
            </p>
          </motion.div>

          <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="flex justify-center flex-wrap gap-6">
            <Button size="lg" className="bg-black text-white hover:bg-black font-black px-12 h-16 rounded-2xl shadow-xl shadow-black/10 text-lg uppercase tracking-tight" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-black border-black/10 bg-black/5 hover:bg-black/10 font-black px-12 h-16 rounded-2xl text-lg uppercase tracking-tight" asChild>
              <Link href="/contact">Schedule Demo</Link>
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
