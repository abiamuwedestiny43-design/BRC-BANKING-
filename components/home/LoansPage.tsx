import { Car, Home, GraduationCap, CheckCircle } from 'lucide-react';

const LoansPage: React.FC = () => {
  return (
    <div className="animate-fade-in pt-32">
      {/* Hero Section with Background Image */}
      <section
        className="relative py-32 bg-cover bg-center text-white"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGxvYW58ZW58MHx8MHx8fDA%3D')",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-slide-up">
            Personal Loans
          </h1>
          <p className="text-lg md:text-xl leading-relaxed animate-slide-up delay-200">
            At HB Bank, we provide flexible personal loan solutions designed to help you achieve your goals efficiently and securely. Whether you're planning to purchase a new car, renovate your home, or invest in your education, our loans are tailored to meet your unique needs.
            <br /><br />
            Our expert team ensures that every loan process is simple, transparent, and fast. With competitive interest rates, flexible repayment options, and minimal paperwork, you can focus on what truly matters—turning your dreams into reality. We also offer guidance and support at every step, from application to funding, so you feel confident and informed throughout the process. Choose HB Bank for personal loans that empower you to reach your financial goals while maintaining peace of mind.
          </p>
        </div>
      </section>

      {/* Loan Types */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Car,
                title: 'Auto Loans',
                rate: '3.99% APR',
                description: 'Competitive rates for new and used vehicles',
                features: ['Up to 84 months', 'No prepayment penalty', 'Quick approval', 'Refinancing available']
              },
              {
                icon: Home,
                title: 'Home Improvement',
                rate: '4.49% APR',
                description: 'Transform your home with affordable financing',
                features: ['Up to $50,000', 'Fixed rates', 'No collateral required', 'Fast funding']
              },
              {
                icon: GraduationCap,
                title: 'Education Loans',
                rate: '3.49% APR',
                description: 'Invest in your future with education financing',
                features: ['Flexible repayment', 'Low interest rates', 'No origination fees', 'Deferment options']
              }
            ].map((loan, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                  <loan.icon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{loan.title}</h3>
                <div className="text-2xl font-bold text-green-600 mb-4">Starting at {loan.rate}</div>
                <p className="text-gray-600 mb-6">{loan.description}</p>
                <ul className="space-y-2 mb-8">
                  {loan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Loan Calculator */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Loan Calculator</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Loan Amount</label>
                <input type="number" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="$10,000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
                <input type="number" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="4.5" step="0.1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Loan Term (Years)</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                  <option>1 Year</option>
                  <option>2 Years</option>
                  <option>3 Years</option>
                  <option>5 Years</option>
                  <option>7 Years</option>
                </select>
              </div>
              <div className="flex items-end">
                <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
                  Calculate Payment
                </button>
              </div>
            </div>
            <div className="mt-8 p-6 bg-green-50 rounded-lg text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">$247.50</div>
              <div className="text-gray-600">Estimated Monthly Payment</div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Simple Application Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Apply Online', description: 'Complete our secure online application in minutes' },
              { step: '2', title: 'Get Approved', description: 'Receive a decision within 24 hours' },
              { step: '3', title: 'Receive Funds', description: 'Get your money deposited directly to your account' }
            ].map((item, index) => (
              <div key={index} className="text-center animate-slide-in-up" style={{ animationDelay: `${index * 200}ms` }}>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 text-white rounded-full text-2xl font-bold mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoansPage;
