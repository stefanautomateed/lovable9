"use client";

import { useMemo } from "react";
import type { GeneratedFile } from "@/lib/schemas";

interface FileTreeProps {
  files: GeneratedFile[];
  selectedPath?: string;
  onSelectFile: (path: string) => void;
}

interface FileNode {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FileNode[];
}

function buildFileTree(files: GeneratedFile[]): FileNode[] {
  const root: FileNode[] = [];

  files.forEach((file) => {
    const parts = file.path.replace(/^\//, "").split("/");
    let currentLevel = root;

    parts.forEach((part, index) => {
      const isLast = index === parts.length - 1;
      const existingNode = currentLevel.find((node) => node.name === part);

      if (existingNode) {
        if (!isLast && existingNode.children) {
          currentLevel = existingNode.children;
        }
      } else {
        const newNode: FileNode = {
          name: part,
          path: parts.slice(0, index + 1).join("/"),
          isDirectory: !isLast,
          children: !isLast ? [] : undefined,
        };
        currentLevel.push(newNode);
        if (!isLast && newNode.children) {
          currentLevel = newNode.children;
        }
      }
    });
  });

  return root;
}

function FileTreeNode({
  node,
  selectedPath,
  onSelectFile,
  level = 0,
}: {
  node: FileNode;
  selectedPath?: string;
  onSelectFile: (path: string) => void;
  level?: number;
}) {
  const isSelected = selectedPath === node.path;

  if (node.isDirectory) {
    return (
      <div>
        <div
          className="flex items-center gap-2 py-1 px-2 hover:bg-gray-100 cursor-default"
          style={{ paddingLeft: `${level * 12 + 8}px` }}
        >
          <span className="text-gray-500">📁</span>
          <span className="text-sm font-medium text-gray-700">
            {node.name}
          </span>
        </div>
        {node.children &&
          node.children.map((child) => (
            <FileTreeNode
              key={child.path}
              node={child}
              selectedPath={selectedPath}
              onSelectFile={onSelectFile}
              level={level + 1}
            />
          ))}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 py-1 px-2 hover:bg-gray-100 cursor-pointer ${
        isSelected ? "bg-blue-100 hover:bg-blue-200" : ""
      }`}
      style={{ paddingLeft: `${level * 12 + 8}px` }}
      onClick={() => onSelectFile(node.path)}
    >
      <span className="text-gray-500">📄</span>
      <span
        className={`text-sm ${isSelected ? "text-blue-700 font-medium" : "text-gray-600"}`}
      >
        {node.name}
      </span>
    </div>
  );
}

export default function FileTree({
  files,
  selectedPath,
  onSelectFile,
}: FileTreeProps) {
  const tree = useMemo(() => buildFileTree(files), [files]);

  if (files.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 text-sm">
        No files generated yet
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-auto">
      <div className="sticky top-0 bg-gray-50 border-b border-gray-200 px-4 py-2">
        <h3 className="text-sm font-semibold text-gray-700 uppercase">
          Files ({files.length})
        </h3>
      </div>
      <div className="py-2">
        {tree.map((node) => (
          <FileTreeNode
            key={node.path}
            node={node}
            selectedPath={selectedPath}
            onSelectFile={onSelectFile}
          />
        ))}
      </div>
    </div>
  );
}
