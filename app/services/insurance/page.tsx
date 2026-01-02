export default function InsurancePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section
        className="relative h-[400px] md:h-[580px] w-full mb-8 flex items-center justify-center text-center overflow-hidden"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 px-6 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-balance">Insurance</h1>
          <p className="text-xl md:text-2xl font-semibold mt-3 max-w-3xl mx-auto text-white/90 leading-relaxed animation-delay-200 animate-fade-in-up">
            Coverage that fits your life—clear terms, better value, and integrated billing.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-5xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-4 text-balance animate-fade-in">Insurance</h1>
        <p className="text-gray-600 mb-8 leading-relaxed animate-fade-in animation-delay-100">
          Comprehensive coverage options for the people and things you care about most. Compare policies, understand
          deductibles and terms, and manage everything alongside your banking—simple, integrated, and secure.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="p-6 bg-white rounded-lg shadow animate-slide-up">
            <img
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80"
              alt="Life and health insurance"
              className="w-full h-44 object-cover rounded-md mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Life & Health</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Explore term and permanent life coverage, disability, and supplemental options that protect income and
              wellbeing. We'll help you find affordable, appropriate coverage for your needs.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow animate-slide-up animation-delay-200">
            <img
              src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80"
              alt="Home and auto insurance"
              className="w-full h-44 object-cover rounded-md mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Home & Auto</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Bundle options, policy comparisons, and claim support ensure your assets are protected without overpaying.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-lg shadow animate-zoom-in">
            <h4 className="font-semibold mb-2">Clear Terms</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              We demystify exclusions, deductibles, and limits so you can choose confidently.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow animate-zoom-in animation-delay-100">
            <h4 className="font-semibold mb-2">Claims Support</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              When something happens, we coordinate quickly to restore normal life with minimal friction.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow animate-zoom-in animation-delay-200">
            <h4 className="font-semibold mb-2">Integrated Billing</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Manage premiums and renewals in the same place you manage your cash flow.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
