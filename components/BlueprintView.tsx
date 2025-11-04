"use client";

import type { Blueprint } from "@/lib/schemas";

interface BlueprintViewProps {
  blueprint: Blueprint;
}

export default function BlueprintView({ blueprint }: BlueprintViewProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        {blueprint.title}
      </h2>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 uppercase mb-2">
            Description
          </h3>
          <p className="text-gray-600">{blueprint.description}</p>
        </div>

        {blueprint.pages && blueprint.pages.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase mb-2">
              Pages
            </h3>
            <div className="flex flex-wrap gap-2">
              {blueprint.pages.map((page, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {page}
                </span>
              ))}
            </div>
          </div>
        )}

        {blueprint.components && blueprint.components.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase mb-2">
              Components
            </h3>
            <div className="flex flex-wrap gap-2">
              {blueprint.components.map((component, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {component}
                </span>
              ))}
            </div>
          </div>
        )}

        {blueprint.routes && blueprint.routes.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase mb-2">
              Routes
            </h3>
            <div className="flex flex-wrap gap-2">
              {blueprint.routes.map((route, index) => (
                <code
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm font-mono"
                >
                  {route}
                </code>
              ))}
            </div>
          </div>
        )}

        {blueprint.tech && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase mb-2">
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                {blueprint.tech.framework}
              </span>
              {blueprint.tech.ui && (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  {blueprint.tech.ui}
                </span>
              )}
            </div>
          </div>
        )}

        {blueprint.notes && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase mb-2">
              Implementation Notes
            </h3>
            <p className="text-gray-600 text-sm">{blueprint.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
