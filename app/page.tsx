"use client";

import { useState, useEffect, useCallback } from "react";
import { Toaster, toast } from "sonner";
import ChatInput from "@/components/ChatInput";
import BlueprintView from "@/components/BlueprintView";
import FileTree from "@/components/FileTree";
import CodeViewer from "@/components/CodeViewer";
import PreviewPanel from "@/components/PreviewPanel";
import type { Blueprint, GeneratedFile, StreamMessage } from "@/lib/schemas";
import { saveSession, loadSession } from "@/lib/storage";
import { mergeFileUpdate } from "@/lib/sandpackAdapter";

type GenerationState = "idle" | "generating" | "complete" | "error";

export default function Home() {
  const [state, setState] = useState<GenerationState>("idle");
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [files, setFiles] = useState<GeneratedFile[]>([]);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);

  // Load session on mount
  useEffect(() => {
    const session = loadSession();
    if (session) {
      setBlueprint(session.blueprint || null);
      setFiles(session.files);
      if (session.files.length > 0) {
        setState("complete");
        setSelectedFilePath(session.files[0].path);
      }
    }
  }, []);

  // Save session whenever blueprint or files change
  useEffect(() => {
    if (blueprint || files.length > 0) {
      saveSession({
        blueprint,
        files,
        timestamp: Date.now(),
      });
    }
  }, [blueprint, files]);

  const selectedFile = files.find((f) => f.path === selectedFilePath) || null;

  const handleGenerate = useCallback(
    async (prompt: string, isRefinement: boolean = false) => {
      setState("generating");
      setStatusMessage("Starting generation...");
      setMessages([]);

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt,
            intent: isRefinement ? "refine" : "new",
            currentFiles: isRefinement ? files : undefined,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("No response body");
        }

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            try {
              const message: StreamMessage = JSON.parse(trimmed);

              switch (message.type) {
                case "status":
                  setStatusMessage(message.message);
                  setMessages((prev) => [...prev, message.message]);
                  break;

                case "blueprint":
                  setBlueprint(message.blueprint);
                  toast.success("Blueprint generated");
                  break;

                case "file":
                  setFiles((prev) => {
                    const newFiles = [...prev, message.file];
                    // Auto-select first file
                    if (prev.length === 0) {
                      setSelectedFilePath(message.file.path);
                    }
                    return newFiles;
                  });
                  break;

                case "file_update":
                  setFiles((prev) =>
                    mergeFileUpdate(prev, {
                      path: message.file.path,
                      contents: message.file.contents,
                      diff: message.file.diff,
                    })
                  );
                  break;

                case "complete":
                  setState("complete");
                  setStatusMessage("");
                  toast.success(
                    `Generation complete! ${message.metrics?.files || 0} files created.`
                  );
                  break;

                case "error":
                  console.error("Generation error:", message);
                  toast.error(message.message);
                  setState("error");
                  setStatusMessage("");
                  break;
              }
            } catch (error) {
              console.error("Failed to parse message:", trimmed, error);
            }
          }
        }
      } catch (error) {
        console.error("Generation failed:", error);
        toast.error(
          `Generation failed: ${error instanceof Error ? error.message : String(error)}`
        );
        setState("error");
        setStatusMessage("");
      }
    },
    [files]
  );

  const handleNewApp = () => {
    if (
      state === "generating" ||
      !window.confirm(
        "This will clear the current app. Are you sure you want to continue?"
      )
    ) {
      return;
    }

    setState("idle");
    setBlueprint(null);
    setFiles([]);
    setSelectedFilePath(null);
    setStatusMessage("");
    setMessages([]);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">VibeSDK MVP</h1>
            <p className="text-sm text-gray-500 mt-1">
              AI-powered app builder on Vercel
            </p>
          </div>
          {state !== "idle" && (
            <button
              onClick={handleNewApp}
              disabled={state === "generating"}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              New App
            </button>
          )}
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto px-6 py-6">
        {/* Chat Input */}
        <div className="mb-6">
          <ChatInput
            onSubmit={(prompt) => handleGenerate(prompt, state === "complete")}
            disabled={state === "generating"}
            placeholder={
              state === "complete"
                ? "Refine your app..."
                : "Describe the app you want to build..."
            }
          />
        </div>

        {/* Status Messages */}
        {state === "generating" && statusMessage && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full" />
              <span className="text-blue-800 font-medium">{statusMessage}</span>
            </div>
            {messages.length > 0 && (
              <div className="mt-3 text-sm text-blue-600">
                {messages.slice(-3).map((msg, index) => (
                  <div key={index}>• {msg}</div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Main Content Grid */}
        {(blueprint || files.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Blueprint */}
            {blueprint && (
              <div className="lg:col-span-4">
                <BlueprintView blueprint={blueprint} />
              </div>
            )}

            {/* Middle Column: File Tree + Code Viewer */}
            <div
              className={`${blueprint ? "lg:col-span-4" : "lg:col-span-6"} space-y-6`}
            >
              <div className="h-80">
                <FileTree
                  files={files}
                  selectedPath={selectedFilePath || undefined}
                  onSelectFile={setSelectedFilePath}
                />
              </div>
              <div className="h-96">
                <CodeViewer file={selectedFile} />
              </div>
            </div>

            {/* Right Column: Preview */}
            <div
              className={`${blueprint ? "lg:col-span-4" : "lg:col-span-6"} h-[calc(80vh-200px)] min-h-[600px]`}
            >
              <PreviewPanel files={files} />
            </div>
          </div>
        )}

        {/* Empty State */}
        {state === "idle" && !blueprint && files.length === 0 && (
          <div className="text-center py-20">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to VibeSDK MVP
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Describe any web app you want to build, and I&apos;ll generate a
                complete React application with live preview.
              </p>
              <div className="bg-white rounded-lg shadow-md p-6 text-left">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Example prompts:
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>
                    • A simple todo list app with add, complete, and delete
                    functionality
                  </li>
                  <li>
                    • A weather dashboard that shows current conditions and
                    forecast
                  </li>
                  <li>
                    • A landing page for a SaaS product with hero, features, and
                    pricing sections
                  </li>
                  <li>• A calculator app with basic arithmetic operations</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
