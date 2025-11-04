"use client";

import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import type { GeneratedFile } from "@/lib/schemas";

interface CodeViewerProps {
  file: GeneratedFile | undefined;
}

function getLanguageFromPath(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase();
  const languageMap: Record<string, string> = {
    tsx: "typescript",
    ts: "typescript",
    jsx: "javascript",
    js: "javascript",
    css: "css",
    json: "json",
    html: "html",
    md: "markdown",
  };
  return languageMap[ext || ""] || "plaintext";
}

export default function CodeViewer({ file }: CodeViewerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!file) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500">Select a file to view its contents</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden flex flex-col">
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-700">{file.path}</h3>
          {file.purpose && (
            <p className="text-xs text-gray-500 mt-1">{file.purpose}</p>
          )}
        </div>
        <span className="text-xs text-gray-500 uppercase">
          {file.language || getLanguageFromPath(file.path)}
        </span>
      </div>
      <div className="flex-1 overflow-hidden">
        {mounted ? (
          <Editor
            height="100%"
            language={file.language || getLanguageFromPath(file.path)}
            value={file.contents}
            theme="vs-light"
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              wordWrap: "on",
            }}
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">Loading editor...</p>
          </div>
        )}
      </div>
    </div>
  );
}
