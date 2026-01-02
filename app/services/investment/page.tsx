export default function InvestmentServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section
        className="relative h-[400px] md:h-[580px] w-full mb-8 flex items-center justify-center text-center overflow-hidden"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1920&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 px-6 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-balance">Investment Services</h1>
          <p className="text-xl md:text-2xl font-semibold mt-3 max-w-3xl mx-auto text-white/90 leading-relaxed animation-delay-200 animate-fade-in-up">
            Disciplined portfolios, clear guidance, and tax-aware strategies to compound outcomes.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-5xl mx-auto px-6">
        <p className="text-gray-600 mb-8 leading-relaxed animate-fade-in">
          Build long-term wealth with diversified strategies and guidance that aligns with your risk tolerance and
          timeline. We combine disciplined portfolio construction with practical advice, so you stay invested through
          cycles and capture compounding gains.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="p-6 bg-white rounded-lg shadow animate-slide-up">
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
              alt="Portfolio management charts"
              className="w-full h-44 object-cover rounded-md mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Portfolio Management</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              We balance asset classes with evidence-based allocations. Periodic rebalancing and tax-aware placement
              help you keep more of what you earn.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow animate-slide-up animation-delay-200">
            <img
              src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80"
              alt="Retirement planning and savings"
              className="w-full h-44 object-cover rounded-md mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Retirement Planning</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Map contributions, expected returns, and withdrawal strategies to reach independence with confidence.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-lg shadow animate-zoom-in">
            <h4 className="font-semibold mb-2">Diversification</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Spread exposure across geographies, sectors, and factors to lower risk without sacrificing opportunity.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow animate-zoom-in animation-delay-100">
            <h4 className="font-semibold mb-2">Discipline</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Avoid timing the market. We prioritize consistency, cost control, and tax efficiency.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow animate-zoom-in animation-delay-200">
            <h4 className="font-semibold mb-2">Transparency</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Clear reporting, performance summaries, and guidance help you understand every decision.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
