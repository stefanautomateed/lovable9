import { NextRequest } from "next/server";
import { getOpenAIClient, getDefaultModel } from "@/lib/openai";
import {
  GenerateRequestSchema,
  StreamMessageSchema,
  type StreamMessage,
} from "@/lib/schemas";

// Use Edge runtime for better streaming support
export const runtime = "edge";

/**
 * Generate a comprehensive fallback app based on the blueprint
 */
function generateFallbackApp(blueprint: any): Array<{ type: "file"; file: any }> {
  const title = blueprint.title || "Generated App";
  const description = blueprint.description || "Welcome to your generated app";
  const pages = blueprint.pages || ["Home"];
  const components = blueprint.components || ["Button"];

  // Determine if this is a landing page
  const isLandingPage =
    pages.some((p: string) =>
      p.toLowerCase().includes("home")
    ) ||
    components.some((c: string) =>
      ["hero", "features", "pricing"].some((sec) =>
        c.toLowerCase().includes(sec)
      )
    );

  if (isLandingPage) {
    return generateLandingPage(blueprint);
  }

  // Default simple app
  return [
    {
      type: "file" as const,
      file: {
        path: "src/App.tsx",
        language: "typescript",
        purpose: "Main app component",
        contents: `export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          ${title}
        </h1>
        <p className="text-gray-600 mb-6">
          ${description}
        </p>
        <div className="space-y-4">
          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}`,
      },
    },
    {
      type: "file" as const,
      file: {
        path: "src/index.tsx",
        language: "typescript",
        purpose: "Entry point",
        contents: `import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App";

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);`,
      },
    },
    {
      type: "file" as const,
      file: {
        path: "src/styles.css",
        language: "css",
        purpose: "Styles",
        contents: `@tailwind base;
@tailwind components;
@tailwind utilities;`,
      },
    },
  ];
}

/**
 * Generate a complete landing page based on blueprint
 */
function generateLandingPage(blueprint: any): Array<{ type: "file"; file: any }> {
  const title = blueprint.title || "Transform Your Digital Experience";
  const description = blueprint.description || "Build stunning applications with cutting-edge technology and beautiful design";

  return [
    {
      type: "file" as const,
      file: {
        path: "src/App.tsx",
        language: "typescript",
        purpose: "Main landing page",
        contents: `import Hero from './components/Hero';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Hero />
      <Features />
      <Testimonials />
      <Pricing />
      <CallToAction />
      <Footer />
    </div>
  );
}`,
      },
    },
    {
      type: "file" as const,
      file: {
        path: "src/components/Hero.tsx",
        language: "typescript",
        purpose: "Hero section with WOW effect",
        contents: `export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-red-500">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-1/4 left-1/3 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <div className="animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm mb-8 animate-scale-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span className="font-medium">New: AI-Powered Generation</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight animate-slide-in-left">
            ${title}
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed animate-slide-in-right">
            ${description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-scale-in">
            <button className="group px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 flex items-center gap-2">
              Get Started Free
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold text-lg hover:bg-white/20 hover:scale-105 transition-all duration-300 border-2 border-white/30">
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">10K+</div>
              <div className="text-white/80">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">99%</div>
              <div className="text-white/80">Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">24/7</div>
              <div className="text-white/80">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}`,
      },
    },
    {
      type: "file" as const,
      file: {
        path: "src/components/Features.tsx",
        language: "typescript",
        purpose: "Features section with hover effects",
        contents: `const features = [
  {
    title: "Lightning Fast",
    description: "Blazing fast performance with optimized code and modern architecture.",
    icon: "⚡",
    gradient: "from-yellow-400 to-orange-500",
  },
  {
    title: "Intuitive Design",
    description: "Beautiful, user-friendly interface that delights users from day one.",
    icon: "🎨",
    gradient: "from-purple-400 to-pink-500",
  },
  {
    title: "Enterprise Security",
    description: "Bank-level encryption and security to protect your valuable data.",
    icon: "🔒",
    gradient: "from-green-400 to-cyan-500",
  },
  {
    title: "24/7 Support",
    description: "Round-the-clock expert support whenever you need assistance.",
    icon: "💬",
    gradient: "from-blue-400 to-indigo-500",
  },
  {
    title: "Scalable",
    description: "Grows with your business from startup to enterprise scale.",
    icon: "📈",
    gradient: "from-red-400 to-pink-500",
  },
  {
    title: "AI-Powered",
    description: "Cutting-edge AI technology for intelligent automation.",
    icon: "🤖",
    gradient: "from-teal-400 to-blue-500",
  },
];

export default function Features() {
  return (
    <section className="py-32 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Everything You Need
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              And More
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Powerful features designed to help you build, scale, and succeed
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
            >
              {/* Gradient overlay on hover */}
              <div className={\`absolute inset-0 bg-gradient-to-br \${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity\`}></div>

              <div className="relative">
                <div className={\`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br \${feature.gradient} text-3xl mb-6 shadow-lg group-hover:scale-110 transition-transform\`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 transition-all">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">{feature.description}</p>
              </div>

              {/* Corner accent */}
              <div className={\`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br \${feature.gradient} opacity-10 rounded-bl-full\`}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}`,
      },
    },
    {
      type: "file" as const,
      file: {
        path: "src/components/Testimonials.tsx",
        language: "typescript",
        purpose: "Testimonials section",
        contents: `const testimonials = [
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
}`,
      },
    },
    {
      type: "file" as const,
      file: {
        path: "src/components/CallToAction.tsx",
        language: "typescript",
        purpose: "Call to action section",
        contents: `export default function CallToAction() {
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
}`,
      },
    },
    {
      type: "file" as const,
      file: {
        path: "src/components/Pricing.tsx",
        language: "typescript",
        purpose: "Pricing section",
        contents: `const plans = [
  {
    name: "Starter",
    price: "$9",
    period: "/month",
    features: [
      "Up to 10 users",
      "Basic features",
      "Email support",
      "1 GB storage",
    ],
    highlighted: false,
  },
  {
    name: "Professional",
    price: "$29",
    period: "/month",
    features: [
      "Up to 50 users",
      "Advanced features",
      "Priority support",
      "10 GB storage",
      "Custom integrations",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    features: [
      "Unlimited users",
      "All features",
      "24/7 phone support",
      "Unlimited storage",
      "Custom integrations",
      "Dedicated account manager",
    ],
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that's right for you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={\`rounded-lg p-8 \${
                plan.highlighted
                  ? "bg-blue-600 text-white shadow-2xl scale-105"
                  : "bg-gray-50 text-gray-900"
              }\`}
            >
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className={\`text-lg \${plan.highlighted ? "text-blue-200" : "text-gray-600"}\`}>
                  {plan.period}
                </span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={\`w-full py-3 rounded-lg font-semibold transition-colors \${
                  plan.highlighted
                    ? "bg-white text-blue-600 hover:bg-blue-50"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }\`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}`,
      },
    },
    {
      type: "file" as const,
      file: {
        path: "src/components/Footer.tsx",
        language: "typescript",
        purpose: "Footer",
        contents: `export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4">${title}</h3>
            <p className="text-gray-400">
              ${description}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase">Product</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} ${title}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}`,
      },
    },
    {
      type: "file" as const,
      file: {
        path: "src/index.tsx",
        language: "typescript",
        purpose: "Entry point",
        contents: `import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App";

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);`,
      },
    },
    {
      type: "file" as const,
      file: {
        path: "src/styles.css",
        language: "css",
        purpose: "Styles with advanced animations",
        contents: `@tailwind base;
@tailwind components;
@tailwind utilities;

/* Advanced Animations */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-in-left {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes bounce-gentle {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

/* Animation Classes */
.animate-fade-in {
  animation: fade-in 0.8s ease-out forwards;
}

.animate-slide-in-left {
  animation: slide-in-left 0.8s ease-out forwards;
}

.animate-slide-in-right {
  animation: slide-in-right 0.8s ease-out forwards;
}

.animate-scale-in {
  animation: scale-in 0.6s ease-out forwards;
}

.animate-bounce-gentle {
  animation: bounce-gentle 2s ease-in-out infinite;
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient-shift 5s ease infinite;
}

/* Custom Utilities */
@layer utilities {
  .text-shadow {
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .text-shadow-lg {
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }

  .glow {
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
  }

  .glow-lg {
    box-shadow: 0 0 40px rgba(99, 102, 241, 0.6);
  }
}

/* Animation Delays */
.delay-100 {
  animation-delay: 100ms;
}

.delay-200 {
  animation-delay: 200ms;
}

.delay-300 {
  animation-delay: 300ms;
}

.delay-500 {
  animation-delay: 500ms;
}

.delay-1000 {
  animation-delay: 1000ms;
}

.delay-2000 {
  animation-delay: 2000ms;
}`,
      },
    },
  ];
}

/**
 * System prompt for blueprint generation
 */
const BLUEPRINT_SYSTEM_PROMPT = `You are an expert software architect. Generate a detailed blueprint for a web application based on the user's description.

Return ONLY a JSON object with this exact structure (no markdown, no additional text):
{
  "title": "App Title",
  "description": "Brief description",
  "pages": ["Home", "About", ...],
  "components": ["Button", "Header", ...],
  "routes": ["/", "/about", ...],
  "tech": {
    "framework": "react",
    "ui": "tailwind"
  },
  "notes": "Additional implementation notes"
}`;

/**
 * System prompt for file generation
 */
const FILES_SYSTEM_PROMPT = `You are an expert React/TypeScript developer and UI/UX designer. Generate a visually stunning, modern, design-rich React application that creates a WOW effect.

CRITICAL DESIGN REQUIREMENTS - CREATE IMPRESSIVE UI:
1. Use modern, eye-catching gradients (from-purple-600 via-pink-600 to-red-600, etc.)
2. Add smooth animations and transitions (hover effects, fade-ins, slide-ins, scale transforms)
3. Implement glassmorphism effects (backdrop-blur, semi-transparent backgrounds)
4. Use large, impactful typography (text-5xl, text-6xl, text-7xl for headers)
5. Add subtle shadows and depth (shadow-2xl, shadow-colored)
6. Include micro-interactions on hover (scale-105, -translate-y-1, brightness-110)
7. Use modern spacing and breathing room (generous padding and margins)
8. Create visual hierarchy with size, color, and contrast
9. Add decorative elements (SVG shapes, gradient orbs, geometric patterns)
10. Implement scroll-based animations where appropriate

TECHNICAL REQUIREMENTS:
1. Generate ONLY client-side React code (no server-side code)
2. Create 8-15 files for a complete, feature-rich app
3. Use React 18+ with TypeScript
4. Use Tailwind CSS for ALL styling (no inline CSS)
5. Make it a fully functional single-page application
6. Write production-ready, clean, well-commented code
7. Include ALL components, sections, and features from blueprint
8. Create separate component files for EACH major section/feature

DESIGN PATTERNS TO IMPLEMENT:
- Hero sections: Large gradients, animated CTAs, background elements
- Feature cards: Hover effects, icons, clean layouts, gradient borders
- Pricing tables: Highlighted plans, scale on hover, checkmarks with colors
- Testimonials: Avatar images, quotes, gradient backgrounds
- Forms: Floating labels, smooth focus states, validation styling
- Buttons: Gradient backgrounds, hover transforms, shadow effects
- Navigation: Sticky headers, smooth scroll, mobile-responsive
- Footers: Multi-column, social links, gradient separators

ANIMATION CLASSES TO USE:
- animate-fade-in, animate-slide-in-left, animate-slide-in-right
- animate-scale-in, animate-bounce-gentle, animate-gradient
- hover:scale-105, hover:-translate-y-2, hover:shadow-2xl
- transition-all duration-300 ease-in-out

COLOR PALETTE TO USE:
- Gradients: from-blue-600 to-cyan-600, from-purple-600 to-pink-600
- Backgrounds: bg-slate-50, bg-gray-900, bg-gradient-to-br
- Text: text-gray-900, text-white, text-blue-600, text-transparent bg-clip-text
- Accents: ring-2 ring-blue-500, border-gradient, shadow-blue-500/50

REQUIRED FILE STRUCTURE:
- src/App.tsx - Main app component that MUST import and render ALL page components
- src/components/Hero.tsx - Eye-catching hero with animations
- src/components/Features.tsx - Feature grid with hover effects
- src/components/Pricing.tsx - Pricing cards with highlights
- src/components/Testimonials.tsx - Social proof section
- src/components/CallToAction.tsx - Conversion-focused CTA
- src/components/Footer.tsx - Rich footer with links
- src/index.tsx - Entry point
- src/styles.css - Tailwind + custom animations
- Additional component files as needed

CRITICAL FOR App.tsx:
- MUST have proper imports for ALL components you create
- MUST render all imported components in the JSX
- Example structure:
  import ComponentA from './components/ComponentA';
  import ComponentB from './components/ComponentB';

  export default function App() {
    return (
      <div>
        <ComponentA />
        <ComponentB />
      </div>
    );
  }

Return ONLY a JSON object (no markdown, no code fences) with this structure:
{
  "files": [
    {
      "path": "src/App.tsx",
      "language": "typescript",
      "purpose": "Main app component",
      "contents": "complete file contents with all imports"
    },
    {
      "path": "src/components/Hero.tsx",
      "language": "typescript",
      "purpose": "Hero section with WOW factor",
      "contents": "complete design-rich component code"
    }
  ]
}

IMPORTANT: Generate COMPLETE, IMPRESSIVE, DESIGN-RICH code. Every component should have:
- Modern gradients and colors
- Smooth animations
- Hover effects
- Professional spacing
- Visual hierarchy
- Mobile-responsive design

Make it look like it was designed by a top-tier agency. Create components that make users say "WOW!"`;


/**
 * POST handler for generating app files
 */
export async function POST(req: NextRequest) {
  try {
    // Parse and validate request
    const body = await req.json();
    const request = GenerateRequestSchema.parse(body);

    // Create streaming response
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    // Helper to write NDJSON messages
    const writeMessage = async (message: StreamMessage) => {
      try {
        StreamMessageSchema.parse(message); // Validate
        const line = JSON.stringify(message) + "\n";
        await writer.write(encoder.encode(line));
      } catch (error) {
        console.error("Failed to write message:", error);
      }
    };

    // Start generation in the background
    (async () => {
      try {
        const client = getOpenAIClient();
        const model = request.model || getDefaultModel();

        // Step 1: Generate blueprint
        await writeMessage({
          type: "status",
          message: "Analyzing your request...",
        });

        const blueprintResponse = await client.createChatCompletion({
          model,
          messages: [
            { role: "system", content: BLUEPRINT_SYSTEM_PROMPT },
            { role: "user", content: request.prompt },
          ],
          max_completion_tokens: 1000,
          response_format: { type: "json_object" },
        });

        const blueprintText =
          blueprintResponse.choices[0]?.message?.content || "{}";

        let blueprint;
        try {
          blueprint = JSON.parse(blueprintText);
          await writeMessage({ type: "blueprint", blueprint });
        } catch (error) {
          await writeMessage({
            type: "error",
            message: "Failed to parse blueprint",
            details: String(error),
          });
          await writer.close();
          return;
        }

        // Step 2: Generate files
        await writeMessage({
          type: "status",
          message: "Generating application files...",
        });

        const filesPrompt =
          request.intent === "refine" && request.currentFiles
            ? `Refine this existing app based on the user's request: "${request.prompt}"\n\nCurrent files:\n${request.currentFiles.map((f) => `${f.path}: ${f.contents.slice(0, 200)}...`).join("\n\n")}\n\nGenerate UPDATED files as a JSON object with "files" array.`
            : `Generate a complete React app for this blueprint:\n\n${JSON.stringify(blueprint, null, 2)}\n\nUser request: ${request.prompt}\n\nGenerate ALL files needed for a fully functional app. Include all components, sections, and features from the blueprint.`;

        const filesResponse = await client.createChatCompletion({
          model,
          messages: [
            { role: "system", content: FILES_SYSTEM_PROMPT },
            { role: "user", content: filesPrompt },
          ],
          max_completion_tokens: 16000,
          response_format: { type: "json_object" },
        });

        const filesText = filesResponse.choices[0]?.message?.content || "{}";
        let filesData;

        try {
          filesData = JSON.parse(filesText);
        } catch (error) {
          console.error("Failed to parse files JSON:", error);
          filesData = { files: [] };
        }

        const generatedFiles = filesData.files || [];
        let fileCount = 0;

        // Stream each file to the client
        if (generatedFiles.length > 0) {
          for (const file of generatedFiles) {
            if (file.path && file.contents) {
              await writeMessage({
                type: "file",
                file: {
                  path: file.path,
                  language: file.language || "typescript",
                  purpose: file.purpose || "",
                  contents: file.contents,
                },
              });
              fileCount++;
            }
          }
        }

        // If no valid files, generate a comprehensive fallback based on blueprint
        if (fileCount === 0) {
          await writeMessage({
            type: "status",
            message: "Generating fallback application...",
          });

          const fallbackFiles = generateFallbackApp(blueprint);
          for (const file of fallbackFiles) {
            await writeMessage(file);
            fileCount++;
          }
        }

        // Step 3: Complete
        await writeMessage({
          type: "complete",
          metrics: {
            tokens: blueprintResponse.usage?.total_tokens,
            files: fileCount,
          },
        });
      } catch (error) {
        console.error("Generation error:", error);
        await writeMessage({
          type: "error",
          message: "Generation failed",
          details: error instanceof Error ? error.message : String(error),
        });
      } finally {
        await writer.close();
      }
    })();

    // Return streaming response
    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Request error:", error);
    return new Response(
      JSON.stringify({
        type: "error",
        message: "Invalid request",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
