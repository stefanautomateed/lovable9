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
  const title = blueprint.title || "Generated Landing Page";
  const description = blueprint.description || "Welcome to our product";

  return [
    {
      type: "file" as const,
      file: {
        path: "src/App.tsx",
        language: "typescript",
        purpose: "Main landing page",
        contents: `import Hero from './components/Hero';
import Features from './components/Features';
import Pricing from './components/Pricing';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Features />
      <Pricing />
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
        purpose: "Hero section",
        contents: `export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            ${title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            ${description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Get Started
            </button>
            <button className="px-8 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors border border-blue-500">
              Learn More
            </button>
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
        path: "src/components/Features.tsx",
        language: "typescript",
        purpose: "Features section",
        contents: `const features = [
  {
    title: "Fast & Reliable",
    description: "Built with performance in mind, delivering lightning-fast experiences.",
    icon: "⚡",
  },
  {
    title: "Easy to Use",
    description: "Intuitive interface that anyone can master in minutes.",
    icon: "🎯",
  },
  {
    title: "Secure",
    description: "Enterprise-grade security to keep your data safe.",
    icon: "🔒",
  },
  {
    title: "24/7 Support",
    description: "Our team is always here to help you succeed.",
    icon: "💬",
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Us
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to succeed, all in one place
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
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
        purpose: "Styles",
        contents: `@tailwind base;
@tailwind components;
@tailwind utilities;

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
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
const FILES_SYSTEM_PROMPT = `You are an expert React/TypeScript developer. Generate a complete, working React application based on the blueprint and user's request.

CRITICAL REQUIREMENTS:
1. Generate ONLY client-side React code (no server-side code)
2. Create 6-12 files for a complete, functional app
3. Use React 18+ with TypeScript
4. Include Tailwind CSS for styling
5. Make it a fully functional single-page application
6. Write production-ready code with best practices
7. Include ALL components, sections, and features mentioned in the blueprint
8. Create separate component files for each major section

REQUIRED FILE STRUCTURE:
- src/App.tsx - Main app component that imports and uses all sections
- src/index.tsx - Entry point
- src/styles.css - Tailwind CSS imports and custom styles
- src/components/* - Individual component files for each section/feature
- package.json - Dependencies with React 18, TypeScript, Tailwind
- public/index.html - HTML template

Return ONLY a JSON object (no markdown, no code fences) with this structure:
{
  "files": [
    {
      "path": "src/App.tsx",
      "language": "typescript",
      "purpose": "Main app component",
      "contents": "complete file contents here"
    },
    {
      "path": "src/components/Header.tsx",
      "language": "typescript",
      "purpose": "Header component",
      "contents": "complete file contents here"
    }
  ]
}

Generate ALL necessary files to make the app fully functional. Include complete, working code in each file.`;

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
          temperature: 0.7,
          max_tokens: 1000,
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
          temperature: 0.7,
          max_tokens: 8000,
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
