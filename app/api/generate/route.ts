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
2. Keep the app under 7-12 files
3. Use React 18+ with TypeScript
4. Include Tailwind CSS for styling
5. Make it a single-page application or simple multi-page app
6. Ensure all code is production-ready and follows best practices

REQUIRED FILES (always include):
- /src/App.tsx - Main app component
- /src/index.tsx - Entry point
- /src/styles.css - Styles with Tailwind
- /package.json - Dependencies
- /public/index.html - HTML template

Return your response as NDJSON (newline-delimited JSON). Each line must be a valid JSON object with this structure:

{"type":"file","file":{"path":"src/App.tsx","language":"typescript","purpose":"Main app component","contents":"<full file contents>"}}

Generate one line per file. Do not include markdown formatting, code fences, or any additional text.`;

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
            ? `Refine this existing app based on the user's request: "${request.prompt}"\n\nCurrent files:\n${request.currentFiles.map((f) => `${f.path}: ${f.contents.slice(0, 200)}...`).join("\n\n")}\n\nGenerate UPDATED files as NDJSON.`
            : `Generate a complete React app for this blueprint:\n\n${JSON.stringify(blueprint, null, 2)}\n\nUser request: ${request.prompt}\n\nGenerate files as NDJSON.`;

        const filesStream = await client.createStreamingChatCompletion({
          model,
          messages: [
            { role: "system", content: FILES_SYSTEM_PROMPT },
            { role: "user", content: filesPrompt },
          ],
          temperature: 0.7,
          max_tokens: 4000,
        });

        // Parse streaming response and extract files
        let buffer = "";
        let fileCount = 0;

        for await (const chunk of client.parseSSEStream(filesStream)) {
          buffer += chunk;

          // Try to extract complete JSON objects (files)
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            try {
              const parsed = JSON.parse(trimmed);
              if (parsed.type === "file" && parsed.file) {
                await writeMessage(parsed);
                fileCount++;
              }
            } catch (e) {
              // Not a valid JSON line yet, accumulate more
            }
          }
        }

        // Process any remaining buffer
        if (buffer.trim()) {
          try {
            const parsed = JSON.parse(buffer.trim());
            if (parsed.type === "file" && parsed.file) {
              await writeMessage(parsed);
              fileCount++;
            }
          } catch (e) {
            // Ignore parse errors for trailing content
          }
        }

        // If no files were extracted, the model might have returned files in a different format
        // Try to extract them from the accumulated text
        if (fileCount === 0) {
          await writeMessage({
            type: "error",
            message:
              "Model did not return files in expected format. Generating fallback...",
          });

          // Generate a simple fallback app
          const fallbackFiles = [
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
          ${blueprint.title || "Generated App"}
        </h1>
        <p className="text-gray-600 mb-6">
          ${blueprint.description || "Your app description goes here."}
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
