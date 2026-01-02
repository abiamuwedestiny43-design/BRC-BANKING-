export default function FinancialPlanningPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section
        className="relative h-[400px] md:h-[580px] w-full mb-8 flex items-center justify-center text-center overflow-hidden"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=1920&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 px-6 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-balance">Financial Planning</h1>
          <p className="text-xl md:text-2xl font-semibold mt-3 max-w-3xl mx-auto text-white/90 leading-relaxed animation-delay-200 animate-fade-in-up">
            Align money with milestones—practical plans, accountability, and clarity.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="p-6 bg-white rounded-lg shadow animate-slide-up">
            <img
              src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80"
              alt="Tax and estate planning"
              className="w-full h-44 object-cover rounded-md mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Tax & Estate</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Coordinate investment location, tax-loss harvesting, and estate documentation. Protect family members and
              reduce friction during life's transitions.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow animate-slide-up animation-delay-200">
            <img
              src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80"
              alt="Education funding plan"
              className="w-full h-44 object-cover rounded-md mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Education Funding</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Model future costs and contribution paths with realistic assumptions. Set up flexible strategies that
              adapt as life evolves.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-lg shadow animate-zoom-in">
            <h4 className="font-semibold mb-2">Holistic View</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Connect income, spending, savings, and investments into one coherent plan.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow animate-zoom-in animation-delay-100">
            <h4 className="font-semibold mb-2">Milestones</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Plan for home purchases, family growth, career shifts, and retirement timing with confidence.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow animate-zoom-in animation-delay-200">
            <h4 className="font-semibold mb-2">Accountability</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Periodic check-ins and dashboards keep your goals visible and your progress on track.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
