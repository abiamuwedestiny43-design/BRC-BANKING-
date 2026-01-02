import { ChevronDown, Shield, TrendingUp, Home, CreditCard, Clock, ArrowRight, Building } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const HomePages: React.FC = () => {
  return (
    <div className="animate-fade-in animate-delay-100">
      {/* Hero Section */}
      <section className="animate-fade-in-up animation-delay-300 relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-transparent"></div>
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwMCIgaGVpZ2h0PSI1MDAiIHZpZXdCb3g9IjAgMCAxMDAwIDUwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMTBiOTgxO3N0b3Atb3BhY2l0eTowLjEiIC8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzEwYjk4MTtzdG9wLW9wYWNpdHk6MC4wNSIgLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8cmVjdCB3aWR0aD0iMTAwMCIgaGVpZ2h0PSI1MDAiIGZpbGw9InVybCgjZ3JhZGllbnQpIi8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjEwMCIgcj0iMjAiIGZpbGw9IiMxMGI5ODEiIG9wYWNpdHk9IjAuMSIvPgo8Y2lyY2xlIGN4PSI4MDAiIGN5PSI0MDAiIHI9IjE1IiBmaWxsPSIjMTBiOTgxIiBvcGFjaXR5PSIwLjA4Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjMwMCIgcj0iMTAiIGZpbGw9IiMxMGI5ODEiIG9wYWNpdHk9IjAuMTIiLz4KPGNpcmNsZSBjeD0iOTAwIiBjeT0iMTUwIiByPSIyNSIgZmlsbD0iIzEwYjk4MSIgb3BhY2l0eT0iMC4wNiIvPgo8L3N2Zz4=)' }}></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl md:text-6xl font-bold pt-[120px] md-pt-0 text-gray-900 mb-6 animate-slide-up">
                Your Financial Future
                <span className="block text-green-600">Starts Here</span>
              </h1>
              <p className="text-xl hidden md-flex md:text-2xl text-gray-600 mb-4 animate-slide-up delay-200">
                Experience banking that puts you first. Secure, innovative, and always there when you need us.
              </p>
              <p className="text-lg text-gray-600 mb-8 animate-slide-up delay-300">
                Join over 500,000 satisfied customers who trust Corporate Bank for their financial needs. From personal banking to business solutions, we provide the tools and expertise to help you succeed in today's dynamic financial landscape.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up delay-400">
                <Link href="/register">
                  <button className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
                    Get Started Today
                  </button>
                </Link>
                <Link href="/about">
                  <button className="bg-white text-green-600 px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-lg border border-green-600">
                    Learn More
                  </button>
                </Link>
              </div>
            </div>
            <div className="animate-slide-in-right animation-delay-300">
              <div className="relative">
                <div className="w-full h-96 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-blue-600/20"></div>
                  <div className="relative z-10 h-full flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-[200px] h-[155px] rounded-2xl bg-green-900/40 flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <Image src="/santech.png" alt="santtech bank" width={200} height={120} className="h-[150px] rounded-2xl" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-4">Modern Banking</h3>
                      <p className="text-gray-700">Experience the future of financial services with our cutting-edge technology and personalized approach.</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-green-600 rounded-full opacity-10"></div>
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-600 rounded-full opacity-10"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-green-600" />
        </div>
      </section>

      <section className="py-20 bg-white animate-fade-in-up animation-delay-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Investment Opportunities
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              At Corporate Bank, we believe that investing should be simple, secure, and accessible to everyone.
              Our investment solutions are designed to help you build long-term wealth, protect your assets,
              and achieve financial independence. Whether you are a first-time investor or an experienced
              portfolio manager, our dedicated advisors and cutting-edge tools give you the confidence to
              grow your money in the right direction. With us, you’re not just putting money into accounts—you’re
              investing in a secure future, guided by expertise and supported by technology that works for you.
            </p>
          </div>

          {/* Investment Images Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              { title: "Real Estate Funds", image: "https://saintinvestment.com/wp-content/uploads/2021/09/Saint-Investment-Group-Real-Estate-Investment-United-States-Real-Estate-Fund-Structures.jpg" },
              { title: "Stock Market Growth", image: "https://tse4.mm.bing.net/th/id/OIP.e-u3mj4riNnbN0_-NVZSgAHaE8?pid=ImgDet&w=474&h=316&rs=1&o=7&rm=3" },
              { title: "Green Energy Projects", image: "https://cleanpowercampaign.org/wp-content/uploads/2015/02/solar-farm_lrg.jpg" }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div
                  className="h-56 bg-cover bg-center"
                  style={{ backgroundImage: `url(${item.image})` }}
                ></div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Explore secure opportunities with {item.title}. We provide diversified solutions
                    that maximize growth while minimizing risks, ensuring your investments align with
                    your financial goals.
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Reasons to Invest */}
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Invest With Us?</h3>
            <ul className="text-left space-y-4 text-gray-700">
              <li className="flex items-start">
                <span className="w-3 h-3 mt-2 mr-3 bg-green-600 rounded-full"></span>
                Proven track record of delivering strong returns across diverse sectors.
              </li>
              <li className="flex items-start">
                <span className="w-3 h-3 mt-2 mr-3 bg-green-600 rounded-full"></span>
                Personalized investment strategies designed to meet your unique goals.
              </li>
              <li className="flex items-start">
                <span className="w-3 h-3 mt-2 mr-3 bg-green-600 rounded-full"></span>
                Secure platforms with transparent reporting and 24/7 access to your portfolio.
              </li>
              <li className="flex items-start">
                <span className="w-3 h-3 mt-2 mr-3 bg-green-600 rounded-full"></span>
                Commitment to sustainable and ethical investing for a better future.
              </li>
            </ul>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-20 bg-white animate-fade-in-up animation-delay-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Corporate Bank?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to providing exceptional banking services that exceed your expectations. Our innovative approach combines cutting-edge technology with personalized customer service to deliver the best banking experience possible.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Bank-Level Security',
                description: 'Your money and data are protected with state-of-the-art security measures including 256-bit encryption, multi-factor authentication, and continuous fraud monitoring.',
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjBmZGY0Ii8+CjxyZWN0IHg9IjEwMCIgeT0iNjAiIHdpZHRoPSIxMDAiIGhlaWdodD0iODAiIHJ4PSIxMCIgZmlsbD0iIzEwYjk4MSIgb3BhY2l0eT0iMC4yIi8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjEwMCIgcj0iMjAiIGZpbGw9IiMxMGI5ODEiLz4KPHA+CjxwYXRoIGQ9Ik0xNDUgOTVMMTUwIDEwMEwxNTUgOTUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4='
              },
              {
                icon: Clock,
                title: '24/7 Support',
                description: 'Round-the-clock customer service whenever you need assistance. Our dedicated support team is available via phone, chat, and email to help resolve any issues quickly.',
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjBmZGY0Ii8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjEwMCIgcj0iNDAiIHN0cm9rZT0iIzEwYjk4MSIgc3Ryb2tlLXdpZHRoPSI0IiBmaWxsPSJub25lIi8+CjxsaW5lIHgxPSIxNTAiIHkxPSIxMDAiIHgyPSIxNTAiIHkyPSI3MCIgc3Ryb2tlPSIjMTBiOTgxIiBzdHJva2Utd2lkdGg9IjMiLz4KPGxpbmUgeDE9IjE1MCIgeTE9IjEwMCIgeDI9IjE3MCIgeTI9IjEwMCIgc3Ryb2tlPSIjMTBiOTgxIiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+'
              },
              {
                icon: TrendingUp,
                title: 'Growth Focused',
                description: 'Competitive interest rates and investment options to help your money grow. Our financial advisors work with you to create personalized strategies for long-term wealth building.',
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjBmZGY0Ii8+CjxwYXRoIGQ9Ik01MCAxNTBMMTAwIDEyMEwxNTAgMTAwTDIwMCA4MEwyNTAgNjAiIHN0cm9rZT0iIzEwYjk4MSIgc3Ryb2tlLXdpZHRoPSIzIiBmaWxsPSJub25lIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMTUwIiByPSI0IiBmaWxsPSIjMTBiOTgxIi8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEyMCIgcj0iNCIgZmlsbD0iIzEwYjk4MSIvPgo8Y2lyY2xlIGN4PSIxNTAiIGN5PSIxMDAiIHI9IjQiIGZpbGw9IiMxMGI5ODEiLz4KPGNpcmNsZSBjeD0iMjAwIiBjeT0iODAiIHI9IjQiIGZpbGw9IiMxMGI5ODEiLz4KPGNpcmNsZSBjeD0iMjUwIiBjeT0iNjAiIHI9IjQiIGZpbGw9IiMxMGI5ODEiLz4KPC9zdmc+'
              }
            ].map((feature, index) => (
              <div key={index} className="group hover:transform hover:scale-105 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                  <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${feature.image})` }}></div>
                  <div className="p-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6 group-hover:bg-green-200 transition-colors">
                      <feature.icon className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-gray-50 animate-fade-in-up animation-delay-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: CreditCard, title: 'Personal Banking', color: 'bg-blue-500', link: '/services/personal' },
              { icon: Building, title: 'Business Banking', color: 'bg-purple-500', link: '/services/business' },
              { icon: Home, title: 'Mortgages', color: 'bg-green-500', link: '/services/mortgage' },
              { icon: TrendingUp, title: 'Investments', color: 'bg-orange-500', link: '/services/investment' }
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 ${service.color} rounded-lg mb-4`}>
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Comprehensive solutions tailored to your needs
                </p>
                <Link
                  href={service.link}
                  className="text-green-600 font-medium hover:text-green-700 flex items-center"
                >
                  Read More <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePages;
