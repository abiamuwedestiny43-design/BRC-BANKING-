export default function PersonalBankingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section
        className="relative h-[400px] md:h-[580px] w-full mb-8 flex items-center justify-center text-center overflow-hidden"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=1920&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 px-6 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-balance">Personal Banking</h1>
          <p className="mt-3 text-xl md:text-2xl font-semibold max-w-3xl mx-auto text-white/90 leading-relaxed animation-delay-200 animate-fade-in-up">
            Everyday money made simple—secure accounts, smarter tools, and helpful insights built around you.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-5xl mx-auto px-6">
        <p className="text-gray-600 mb-8 leading-relaxed animate-fade-in">
          Our Personal Banking suite is designed to make money management simple, secure, and rewarding. From
          fee-friendly checking accounts to high-yield savings, we help you build healthier financial habits without
          friction. You get modern tools like real-time alerts, budgeting insights, and instant card controls—all inside
          a clean, secure experience. Whether you're organizing everyday spending, saving for a milestone, or building
          an emergency fund, our products are engineered to reduce complexity and improve outcomes.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="p-6 bg-white rounded-lg shadow animate-slide-up">
            <img
              src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80"
              alt="Debit card and mobile banking"
              className="w-full h-44 object-cover rounded-md mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Checking & Savings</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Enjoy everyday checking with instant notifications, virtual cards, and zero hidden fees. Complement it
              with a high-yield savings account that pays competitive interest on your balance. Use automated saving
              rules—round-ups or scheduled transfers—to consistently grow your savings without thinking about it.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow animate-slide-up animation-delay-200">
            <img
              src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80"
              alt="Personal loans and credit"
              className="w-full h-44 object-cover rounded-md mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Personal Loans</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Access flexible personal credit with transparent pricing and no prepayment penalties. Our process is fast,
              paperless, and designed to help you consolidate debt, fund a project, or cover an unexpected bill without
              disrupting your financial plan.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-lg shadow animate-zoom-in">
            <h4 className="font-semibold mb-2">Smart Tools</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Real-time balances, spending analytics, category budgets, and goals help you stay on track. Lock your
              card, set travel notices, and manage beneficiaries with a tap.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow animate-zoom-in animation-delay-100">
            <h4 className="font-semibold mb-2">Security First</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              We use device binding, 2FA options, and transaction screening to keep accounts safe. You're always in
              control with OTP for local transfers and multi-step verification for international transfers.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow animate-zoom-in animation-delay-200">
            <h4 className="font-semibold mb-2">Customer Support</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Get quick answers through in-app support, detailed statements, and helpful guides. When you need a human,
              we respond fast and follow through until your issue is resolved.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
