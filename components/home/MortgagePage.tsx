import { CheckCircle, Calculator, Home, DollarSign, Star } from 'lucide-react';

const MortgagePage: React.FC = () => {
  return (
    <div className="animate-fade-in pt-32">
      {/* Hero Section with Background Image */}
      <section
        className="relative py-32 bg-cover bg-center text-white"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGxvYW58ZW58MHx8MHx8fDA%3D')",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-slide-up">
            Home Mortgages Made Simple
          </h1>
          <p className="text-lg md:text-xl leading-relaxed animate-slide-up delay-200">
            Finding the perfect home loan doesn't have to be complicated. At HB Bank, we offer tailored mortgage solutions with competitive rates and personalized guidance to help you secure your dream home. Whether you're a first-time homebuyer or looking to refinance, our team of experts is here to assist you every step of the way.
            <br /><br />
            Our mortgage process is transparent, efficient, and designed to fit your unique financial needs. We provide clear information on loan options, rates, and repayment plans, empowering you to make confident decisions. With HB Bank, you'll have access to tools, calculators, and advisors to ensure a smooth journey from pre-approval to closing. Start your path to homeownership today and experience the peace of mind that comes from working with a trusted financial partner committed to your success.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
              Get Pre-Approved
            </button>
            <button className="border border-green-600 text-green-600 px-6 py-3 rounded-lg hover:bg-green-50 transition-colors font-medium">
              Calculate Payment
            </button>
          </div>
        </div>
      </section>

      {/* Mortgage Types */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Mortgage Options</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[
              {
                title: 'Conventional Loans',
                description: 'Traditional mortgages with flexible terms and competitive rates',
                features: ['Down payments as low as 3%', 'Fixed or adjustable rates', 'Up to 30-year terms', 'No mortgage insurance with 20% down']
              },
              {
                title: 'FHA Loans',
                description: 'Government-backed loans for first-time and low down payment buyers',
                features: ['Down payments as low as 3.5%', 'Flexible credit requirements', 'Lower closing costs', 'Assumable loans']
              },
              {
                title: 'VA Loans',
                description: 'Exclusive benefits for veterans and active military personnel',
                features: ['No down payment required', 'No mortgage insurance', 'Competitive interest rates', 'No prepayment penalties']
              },
              {
                title: 'Jumbo Loans',
                description: 'Financing for high-value properties above conventional limits',
                features: ['Loan amounts up to $3M+', 'Competitive rates', 'Flexible terms', 'Portfolio lending options']
              }
            ].map((mortgage, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{mortgage.title}</h3>
                <p className="text-gray-600 mb-6">{mortgage.description}</p>
                <ul className="space-y-2 mb-6">
                  {mortgage.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mortgage Calculator */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Mortgage Calculator</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Home Price</label>
                <input type="number" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="$300,000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Down Payment</label>
                <input type="number" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="$60,000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
                <input type="number" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="3.125" step="0.001" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Loan Term</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                  <option>30 Years</option>
                  <option>20 Years</option>
                  <option>15 Years</option>
                  <option>10 Years</option>
                </select>
              </div>
            </div>
            <button className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
              Calculate Payment
            </button>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-2">$1,157</div>
                <div className="text-gray-600 text-sm">Principal & Interest</div>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-2">$250</div>
                <div className="text-gray-600 text-sm">Property Tax</div>
              </div>
              <div className="text-center p-6 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 mb-2">$100</div>
                <div className="text-gray-600 text-sm">Insurance</div>
              </div>
            </div>
            <div className="mt-6 text-center p-6 bg-gray-100 rounded-lg">
              <div className="text-3xl font-bold text-gray-900 mb-2">$1,507</div>
              <div className="text-gray-600">Total Monthly Payment</div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Your Path to Homeownership</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Get Pre-Approved', description: 'Know your budget before you shop', icon: Calculator },
              { step: '2', title: 'Find Your Home', description: 'Search with confidence', icon: Home },
              { step: '3', title: 'Make an Offer', description: 'Submit a competitive offer', icon: DollarSign },
              { step: '4', title: 'Close & Move In', description: 'Complete the process and get your keys', icon: Star }
            ].map((item, index) => (
              <div key={index} className="text-center animate-slide-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 text-white rounded-full text-xl font-bold mb-6">
                  {item.step}
                </div>
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                  <item.icon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MortgagePage;
