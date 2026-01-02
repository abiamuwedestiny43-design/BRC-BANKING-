export default function MortgageServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section
        className="relative h-[400px] md:h-[580px] w-full mb-8 flex items-center justify-center text-center overflow-hidden"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 px-6 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-balance">Mortgage Services</h1>
          <p className="text-xl md:text-2xl font-semibold mt-3 max-w-3xl mx-auto text-white/90 leading-relaxed animation-delay-200 animate-fade-in-up">
            Clarity from pre-qual to closing—compare options and move with confidence.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-5xl mx-auto px-6">
        <p className="text-gray-600 mb-8 leading-relaxed animate-fade-in">
          From first-time buyers to seasoned homeowners, we provide clarity and competitive options. Compare fixed and
          adjustable rates, estimate payments, and pre-qualify with a fast, friendly process that respects your time.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="p-6 bg-white rounded-lg shadow animate-slide-up">
            <img
              src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80"
              alt="First time home buyer keys"
              className="w-full h-44 object-cover rounded-md mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">First-time Buyer</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Navigate affordability, down payments, and timelines with seasoned guidance. We'll help you move from
              curiosity to keys with fewer surprises.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow animate-slide-up animation-delay-200">
            <img
              src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80"
              alt="Mortgage refinance with calculator"
              className="w-full h-44 object-cover rounded-md mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Refinancing</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Lower payments, shorten terms, or tap equity. We'll model scenarios so you can choose the right path with
              confidence.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-lg shadow animate-zoom-in">
            <h4 className="font-semibold mb-2">Rate Options</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Compare fixed-rate stability with ARM flexibility to find your best fit.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow animate-zoom-in animation-delay-100">
            <h4 className="font-semibold mb-2">Closing Clarity</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Transparent fees, timelines, and documentation—no last-minute surprises.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow animate-zoom-in animation-delay-200">
            <h4 className="font-semibold mb-2">Local Support</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Access specialists who understand your market and move quickly when it matters.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
