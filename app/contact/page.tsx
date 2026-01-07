import { Phone, Mail, MapPin, Clock, Send, Zap, Globe, MessageSquare } from 'lucide-react';
import Link from 'next/link';

const ContactPage: React.FC = () => {
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
            <Globe className="w-4 h-4" /> GLOBAL SUPPORT NETWORK
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter mb-8">
            Connect with the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500 italic">
              Financial Elite.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-12">
            Our dedicated advisory team is standing by to assist with your institutional and personal banking requirements.
            Experience rapid response times and expert guidance.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Contact Form */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-green-600 rounded-[3rem] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 p-10 md:p-12 rounded-[3rem] shadow-2xl">
                <h2 className="text-3xl font-black text-white mb-8 italic">Secure Transmission</h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">First Name</label>
                      <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="Alexander" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">Last Name</label>
                      <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="Vance" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">Institutional Email</label>
                    <input type="email" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="alex@company.com" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">Subject Area</label>
                    <select className="w-full bg-[#001c10] border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none">
                      <option>Wealth Management</option>
                      <option>Institutional Loans</option>
                      <option>Mortgage Advisory</option>
                      <option>Technical Support</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">Message</label>
                    <textarea rows={5} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none" placeholder="Describe your inquiry..."></textarea>
                  </div>
                  <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-[#001c10] py-5 rounded-2xl font-black transition-all hover:scale-[1.02] flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20">
                    Send Message <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-12">
              <div>
                <h2 className="text-3xl font-black text-white mb-10 tracking-tight">Direct <span className="text-emerald-400">Channels</span></h2>
                <div className="space-y-8">
                  {[
                    { icon: Phone, title: 'Voice Support', value: '(555) 123-PRIME', desc: 'Available Mon-Fri, 9AM-6PM EST', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    { icon: Mail, title: 'Secure Email', value: 'support@primeharborbnk.online', desc: 'Encrypted communication line', color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { icon: MapPin, title: 'Global HQ', value: '77 Financial Plaza', desc: 'Downtown District, Suite 1200', color: 'text-purple-400', bg: 'bg-purple-500/10' }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-6 group">
                      <div className={`h-16 w-16 rounded-2xl ${item.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                        <item.icon className={`w-8 h-8 ${item.color}`} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-white mb-1">{item.title}</h3>
                        <p className="text-lg font-bold text-slate-300">{item.value}</p>
                        <p className="text-sm text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs font-black uppercase tracking-widest text-emerald-500">Systems Operational</span>
                </div>
                <h3 className="text-2xl font-black text-white italic">24/7 Digital Concierge</h3>
                <p className="text-slate-500 leading-relaxed">
                  Our AI-driven support ecosystem is always active for immediate account verification and urgent security reports.
                </p>
                <div className="pt-4">
                  <p className="text-3xl font-black text-white underline decoration-emerald-500 underline-offset-8">1-800-PH-SAFE</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Locations */}
      <section className="py-24 bg-[#00130b] relative border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-xl">
              <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">Our Global <span className="text-slate-500 italic">Details</span></h2>
              <p className="text-slate-400">Strategically located in the world's most vital financial centers.</p>
            </div>
            <button className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all flex items-center gap-2">
              View Global Map <Globe className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { city: 'London', address: '12 Canary Wharf, Financial District', hours: '08:00 - 18:00 GMT' },
              { city: 'New York', address: '44 Wall Street, Manhattan', hours: '09:00 - 18:00 EST' },
              { city: 'Singapore', address: '8 Marina Bay Financial Centre', hours: '09:00 - 17:00 SGT' }
            ].map((node, i) => (
              <div key={i} className="group p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 hover:bg-emerald-900/10 transition-all">
                <h3 className="text-2xl font-black text-white mb-6 italic">{node.city}</h3>
                <div className="space-y-4 text-slate-500 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>{node.address}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>{node.hours}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
