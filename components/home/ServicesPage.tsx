import { CreditCard, Building, TrendingUp, Home, Shield, Calculator, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const ServicesPage: React.FC = () => {
  return (
    <div className="animate-fade-in pt-32">
      {/* Hero Section with Background Image */}
      <section
        className="relative py-32 bg-cover bg-center text-white"
        style={{
          backgroundImage:
            "url('https://vintageportland.files.wordpress.com/2015/07/ap-4806-a2004-002-568-us-national-bank.jpg?w=300')",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-slide-up">
            Our Services
          </h1>
          <p className="text-lg md:text-xl leading-relaxed animate-slide-up delay-200">
            At HB Bank, we provide comprehensive financial solutions designed to meet all your banking needs. Whether you are an individual planning your future, a business seeking growth, or an investor aiming for sustainable wealth, our full range of services ensures that every financial goal is achievable.
            <br /><br />
            Our dedicated team combines decades of expertise with innovative technology to offer secure, accessible, and personalized services. From day-to-day banking to advanced investment strategies, we empower our clients with the knowledge, tools, and guidance they need to succeed. Experience financial services that are not only efficient and reliable but also focused on building long-term relationships and creating lasting value.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: CreditCard,
                title: 'Personal Banking',
                description: 'Checking, savings, and personal loans tailored to your lifestyle',
                features: ['Free checking accounts', 'High-yield savings', 'Personal loans', 'Debit cards']
              },
              {
                icon: Building,
                title: 'Business Banking',
                description: 'Complete business solutions to help your company thrive',
                features: ['Business accounts', 'Commercial loans', 'Merchant services', 'Cash management']
              },
              {
                icon: TrendingUp,
                title: 'Investment Services',
                description: 'Grow your wealth with our expert investment guidance',
                features: ['Portfolio management', 'Retirement planning', 'Mutual funds', 'Financial advisors']
              },
              {
                icon: Home,
                title: 'Mortgage Services',
                description: 'Find the perfect home loan with competitive rates',
                features: ['First-time buyer programs', 'Refinancing', 'FHA loans', 'Jumbo mortgages']
              },
              {
                icon: Shield,
                title: 'Insurance',
                description: 'Protect what matters most with comprehensive coverage',
                features: ['Life insurance', 'Auto insurance', 'Home insurance', 'Health insurance']
              },
              {
                icon: Calculator,
                title: 'Financial Planning',
                description: 'Professional guidance for your financial future',
                features: ['Retirement planning', 'Tax planning', 'Estate planning', 'Education funding']
              }
            ].map((service, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                  <service.icon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
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

      {/* CTA Section */}
      <section className="py-20 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Contact us today to discuss how we can help you achieve your financial goals
          </p>
          <Link href="/contact">
            <button className="bg-white text-green-600 px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-100 transition-colors">
              Schedule a Consultation
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
