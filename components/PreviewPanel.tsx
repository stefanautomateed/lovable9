"use client";

import { useEffect, useState } from "react";
import { Sandpack, SandpackProvider, SandpackLayout, SandpackPreview } from "@codesandbox/sandpack-react";
import type { SandpackFiles } from "@codesandbox/sandpack-react";
import type { GeneratedFile } from "@/lib/schemas";
import { convertToSandpackFiles, validateSandpackFiles } from "@/lib/sandpackAdapter";

interface PreviewPanelProps {
  files: GeneratedFile[];
}

export default function PreviewPanel({ files }: PreviewPanelProps) {
  const [mounted, setMounted] = useState(false);
  const [sandpackFiles, setSandpackFiles] = useState<SandpackFiles>({});
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (files.length > 0) {
      const converted = convertToSandpackFiles(files);
      const validation = validateSandpackFiles(converted);

      setSandpackFiles(converted);
      setValidationErrors(validation.errors);
    }
  }, [files]);

  if (!mounted) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500">Loading preview...</p>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-center">
          <p className="text-gray-500 mb-2">No preview available</p>
          <p className="text-sm text-gray-400">
            Generate an app to see the live preview
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden flex flex-col">
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
        <h3 className="text-sm font-semibold text-gray-700 uppercase">
          Live Preview
        </h3>
      </div>

      {validationErrors.length > 0 && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2">
          <p className="text-sm text-yellow-800 font-medium mb-1">
            Preview Warnings:
          </p>
          <ul className="text-xs text-yellow-700 list-disc list-inside">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        <Sandpack
          template="react-ts"
          files={sandpackFiles}
          theme="light"
          options={{
            showNavigator: false,
            showTabs: false,
            showLineNumbers: false,
            showInlineErrors: true,
            wrapContent: true,
            editorHeight: "100%",
            autorun: true,
            autoReload: true,
          }}
          customSetup={{
            dependencies: {
              "react": "^18.2.0",
              "react-dom": "^18.2.0",
            },
          }}
        >
          <SandpackLayout>
            <SandpackPreview
              showOpenInCodeSandbox={false}
              showRefreshButton={true}
              style={{ height: "100%" }}
            />
          </SandpackLayout>
        </Sandpack>
      </div>
    </div>
  );
}
