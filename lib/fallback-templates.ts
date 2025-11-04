/**
 * Fallback templates for impressive landing page components
 */

export const TestimonialsComponent = `const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CEO, TechCorp",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    content: "This platform transformed our business. The results exceeded our expectations and the team loved using it!",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Product Manager, StartupXYZ",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    content: "Incredible value and outstanding support. We've seen a 300% increase in productivity since switching.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "CTO, InnovateLabs",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    content: "The best investment we've made this year. Powerful, intuitive, and backed by an amazing team.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-32 bg-gradient-to-br from-purple-50 to-pink-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-pink-200/30 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Loved by
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600"> Thousands</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it - hear from our amazing customers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-700 text-lg mb-6 leading-relaxed">"{testimonial.content}"</p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full ring-4 ring-purple-100 group-hover:ring-purple-200 transition-all"
                />
                <div>
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600 text-sm">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}`;

export const CallToActionComponent = `export default function CallToAction() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2Ljg1M2MwLTUuMzA0IDQuMjE1LTkuNjAzIDkuNDI2LTkuNjAzIDUuMjEgMCA5LjQyNSA0LjMgOS40MjUgOS42MDMgMCA1LjMwMy00LjIxNSA5LjYwMi05LjQyNSA5LjYwMkM0MC4yMTUgMjYuNDU1IDM2IDIyLjE1NiAzNiAxNi44NTN6TTUuMTQ5IDM2LjI1YzAtNS4zMDQgNC4yMTUtOS42MDMgOS40MjYtOS42MDMgNS4yMSAwIDkuNDI1IDQuMyA5LjQyNSA5LjYwMyAwIDUuMzAzLTQuMjE1IDkuNjAyLTkuNDI1IDkuNjAyLTUuMjExIDAtOS40MjYtNC4zLTkuNDI2LTkuNjAyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Ready to Get Started?
          </h2>
          <p className="text-2xl md:text-3xl text-white/90 mb-12 max-w-3xl mx-auto">
            Join thousands of satisfied customers and transform your workflow today
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <button className="group px-10 py-5 bg-white text-purple-600 rounded-2xl font-bold text-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 flex items-center gap-3">
              Start Free Trial
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button className="px-10 py-5 bg-white/10 backdrop-blur-sm text-white rounded-2xl font-bold text-xl hover:bg-white/20 hover:scale-105 transition-all duration-300 border-2 border-white/30">
              Schedule Demo
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}`;
