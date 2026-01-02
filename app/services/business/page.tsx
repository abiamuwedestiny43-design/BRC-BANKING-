export default function BusinessBankingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section
        className="relative h-[400px] md:h-[580px] w-full mb-8 flex items-center justify-center text-center overflow-hidden"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1920&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 px-6 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-balance">
            Business Banking
          </h1>
          <p className="mt-3 max-w-3xl font-semibold text-xl md:text-2xl mx-auto text-white/90 leading-relaxed animation-delay-200 animate-fade-in-up">
            Operate, pay, and scale with confidence—roles, controls, and cash flow insights included.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="p-6 bg-white rounded-lg shadow animate-slide-up">
            <img
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80"
              alt="Business accounts and cash management"
              className="w-full h-44 object-cover rounded-md mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Business Accounts</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Manage operating and reserve accounts with granular roles for founders, finance, and accountants. Automate
              approvals and vendor payments, and get richer context for every transaction.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow animate-slide-up animation-delay-200">
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
              alt="Commercial loans and lines of credit"
              className="w-full h-44 object-cover rounded-md mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Commercial Loans</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Access revolving credit or fixed-term financing with predictable terms. We help you fund inventory, expand
              teams, or bridge receivables without compromising cash flow.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-lg shadow animate-zoom-in">
            <h4 className="font-semibold mb-2">Multi-user Access</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Set roles, limits, and approvals. Your accountant can reconcile while managers handle day-to-day spend.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow animate-zoom-in animation-delay-100">
            <h4 className="font-semibold mb-2">Integrated Payments</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Streamline vendor payouts and payroll with templates, scheduled transfers, and clear audit trails.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow animate-zoom-in animation-delay-200">
            <h4 className="font-semibold mb-2">Insights & Controls</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Cash flow views, category budgets, and alerts help you anticipate needs and prevent surprises.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
