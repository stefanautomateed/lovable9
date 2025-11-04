/**
 * localStorage utilities for session persistence
 */

import type { Blueprint, GeneratedFile } from "./schemas";

const SESSION_KEY = "vibesdk_session";

export interface SessionData {
  blueprint?: Blueprint;
  files: GeneratedFile[];
  timestamp: number;
}

/**
 * Save session data to localStorage
 */
export function saveSession(data: SessionData): void {
  if (typeof window === "undefined") return;

  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(SESSION_KEY, serialized);
  } catch (error) {
    console.error("Failed to save session:", error);
  }
}

/**
 * Load session data from localStorage
 */
export function loadSession(): SessionData | null {
  if (typeof window === "undefined") return null;

  try {
    const serialized = localStorage.getItem(SESSION_KEY);
    if (!serialized) return null;

    const data = JSON.parse(serialized) as SessionData;
    return data;
  } catch (error) {
    console.error("Failed to load session:", error);
    return null;
  }
}

/**
 * Clear session data from localStorage
 */
export function clearSession(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error("Failed to clear session:", error);
  }
}

/**
 * Check if a session exists
 */
export function hasSession(): boolean {
  if (typeof window === "undefined") return false;

  try {
    return localStorage.getItem(SESSION_KEY) !== null;
  } catch (error) {
    return false;
  }
}
