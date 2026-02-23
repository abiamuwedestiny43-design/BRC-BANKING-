"use client"

import { motion } from "framer-motion"
import { Home, Key, Calculator, MapPin, Calendar, Zap, ArrowRight, ShieldCheck, Landmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function MortgageServicesPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  }

  const features = [
    {
      title: "First-time Acquisition",
      description: "Navigating affordability, down payments, and timelines with high-precision guidance and competitive rates.",
      icon: Key,
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
      color: "text-black",
      bg: "bg-black/10"
    },
    {
      title: "Equity Refinance",
      description: "Lower your monthly commitment or tap into property value for strategic capital deployment.",
      icon: Home,
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    }
  ]

  const metrics = [
    { title: "Rate Clarity", desc: "Real-time comparison of fixed-rate stability vs ARM flexibility protocols.", icon: Calculator },
    { title: "Closing Speed", desc: "Streamlined documentation and digital signatures for rapid settlement cycles.", icon: Zap },
    { title: "Local Gateway", desc: "Specialists who understand regional market dynamics and underwriting nuances.", icon: MapPin }
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-black selection:bg-black/30">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden pt-32">
        <div
          className="absolute inset-0 bg-fixed bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80')" }}
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
              <Landmark className="w-3 h-3" /> Real Estate Finance Protocol
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-black tracking-tighter lowercase">
              mortgage <span className="text-black italic">services</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl md:text-2xl text-slate-600 font-medium">
              Clarity from pre-qualification to the final signature. Secure your cornerstone with BRC BANKING.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="flex flex-wrap justify-center gap-4 pt-8"
          >
            <Button size="lg" className="bg-black hover:bg-black text-white font-black px-10 h-16 rounded-2xl shadow-xl shadow-black/10 text-lg uppercase tracking-tight" asChild>
              <Link href="/register">Pre-Qualify Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-black/10 bg-black/5 hover:bg-black/10 text-black font-black px-10 h-16 rounded-2xl backdrop-blur-md text-lg uppercase tracking-tight" asChild>
              <Link href="/about">Rate Analysis</Link>
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
            <motion.div {...fadeInUp} className="lg:col-span-12 text-center mb-16">
              <h2 className="text-5xl md:text-7xl font-black text-black tracking-tighter mb-8 leading-none">
                Precision <span className="text-slate-600">Home Financing</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-4xl mx-auto font-medium leading-relaxed">
                From first-time buyers to seasoned homeowners, we provide clarity and competitive options.
                Our process is engineered to minimize friction and maximize transparency at every stage of the lifecycle.
              </p>
            </motion.div>

            <motion.div {...fadeInUp} className="lg:col-span-7">
              <div className="relative aspect-video rounded-[3rem] overflow-hidden border border-black/10 group shadow-3xl">
                <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Prime Property" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-50 to-transparent opacity-60" />
                <div className="absolute top-8 left-8">
                  <div className="px-4 py-2 rounded-2xl bg-white/[0.05] border border-black/10 backdrop-blur-md text-black font-black text-xs uppercase tracking-widest">Global Asset Hub</div>
                </div>
              </div>
            </motion.div>

            <motion.div {...fadeInUp} className="lg:col-span-5 space-y-8">
              <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-black/10 backdrop-blur-lg space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-black/10 flex items-center justify-center text-black border border-black/20">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl font-black text-black tracking-tighter">Secure Underwriting</h3>
                </div>
                <p className="text-slate-600 font-medium">Our underwriting protocol utilizes advanced data aggregation to provide faster commitments and more flexible term structures.</p>
                <ul className="space-y-3">
                  {[
                    "Zero Hidden Documentation Fees",
                    "Automated Identity Verification",
                    "Real-time Rate Locking",
                    "Digital Escrow Integration"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-800 font-bold">
                      <div className="w-1.5 h-1.5 rounded-full bg-black" /> {item}
                    </li>
                  ))}
                </ul>
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
                    Initialize Protocol <ArrowRight className="ml-2 w-4 h-4" />
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

      {/* CTA section */}
      <section className="py-32 relative overflow-hidden bg-gradient-to-b from-transparent to-[#00130b]">
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-12">
          <motion.div {...fadeInUp} className="space-y-4">
            <h2 className="text-5xl md:text-7xl font-black text-black tracking-tighter">
              Secure your <span className="text-black">Ground Zero</span>
            </h2>
            <p className="text-xl text-slate-600 font-medium">
              Join the future of residency financing with BRC BANKING's automated mortgage gateway.
            </p>
          </motion.div>

          <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="flex justify-center flex-wrap gap-6">
            <Button size="lg" className="bg-black text-white hover:bg-black font-black px-12 h-16 rounded-2xl shadow-xl shadow-black/10 text-lg uppercase tracking-tight" asChild>
              <Link href="/register">Start Application</Link>
            </Button>
            <Button size="lg" variant="ghost" className="text-black font-black px-12 h-16 rounded-2xl border border-black/20 hover:bg-black/10 text-lg uppercase tracking-tight" asChild>
              <Link href="/contact">Speak to Consultant</Link>
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
