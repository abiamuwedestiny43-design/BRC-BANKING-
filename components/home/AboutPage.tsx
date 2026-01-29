import { Shield, Users, Award, TrendingUp } from "lucide-react";

const AboutPage: React.FC = () => {
  return (
    <div className="animate-fade-in pt-32">
      {/* Hero Section with Background Image */}
      <section
        className="relative py-32 bg-cover bg-center text-white"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNvcnBvcmF0ZSUyMHRlYW18ZW58MHx8MHx8fDA%3D')",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About HB Bank
          </h1>
          <p className="text-lg md:text-xl leading-relaxed">
            For over five decades, HB Bank has been more than just a financial
            institution — we have been a trusted partner in helping individuals,
            families, and businesses grow and secure their futures. Our story
            began with a simple vision: to make banking accessible, transparent,
            and impactful for everyone. Today, that vision continues to guide
            us, blending tradition with modern innovation.
            <br />
            <br />
            At HB Bank, we believe that finance is not only about numbers — it’s
            about people. That’s why we focus on building genuine relationships
            with our customers, offering personalized solutions designed to
            meet their unique needs. Whether it’s securing your first home,
            planning for retirement, or scaling a business, our team is here to
            walk with you every step of the way. With a foundation built on
            trust, innovation, and sustainability, HB Bank is committed to
            creating opportunities, driving economic growth, and leaving a
            positive mark on every community we serve.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="animate-slide-in-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our mission is to empower individuals and businesses by providing
                exceptional financial solutions rooted in integrity, innovation,
                and customer-centricity. We believe banking should not just be
                transactional — it should be transformational: helping people
                realize their dreams, build generational wealth, and create
                lasting value. Through transparent practices, smart advice, and
                community investment, we strive to be more than a bank — we aim
                to be a trusted financial partner for life.
              </p>
              <p className="text-gray-600">
                We commit to listening first, understanding your goals deeply, and
                tailoring our services accordingly. We nurture financial literacy,
                support entrepreneurs, and channel growth back into the neighborhoods
                we serve.
              </p>
            </div>
            <div className="animate-slide-in-right">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Vision
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                We envision a future where banking is seamless, accessible to all,
                and a force for social and environmental good. Our aim is to lead
                in sustainable finance, digital innovation, and community enrichment,
                becoming the go-to institution for clients seeking financial growth
                with purpose. We see a world where each investment, each savings plan,
                and each loan carries meaning — driving both individual prosperity
                and communal well-being.
              </p>
              <p className="text-gray-600">
                By harnessing emerging technologies, embracing green initiatives,
                and championing inclusive policies, we strive to create a banking
                ecosystem where financial access is equitable, risk is well-managed,
                and growth is shared. In short, our vision is to make meaningful
                finance the standard — not the exception.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Integrity",
                description:
                  "We uphold the highest ethical standards in all we do, ensuring transparency, accountability, and honesty even when no one is watching.",
              },
              {
                icon: Users,
                title: "Customer Focus",
                description:
                  "We place you at the center. Every product, service, and decision is guided by empathy, listening, and delivering value that aligns with your life goals.",
              },
              {
                icon: Award,
                title: "Excellence",
                description:
                  "We are relentless in our pursuit of quality — from operational efficiency and service delivery to product innovation and talent development.",
              },
              {
                icon: TrendingUp,
                title: "Innovation",
                description:
                  "We embrace technological evolution and creative thinking to continually improve and deliver smarter, more accessible financial solutions.",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                  <value.icon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "500K+", label: "Happy Customers" },
              { number: "$2B+", label: "Assets Under Management" },
              { number: "50+", label: "Years of Experience" },
              { number: "100+", label: "Branch Locations" },
            ].map((stat, index) => (
              <div key={index} className="animate-counter">
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-green-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
