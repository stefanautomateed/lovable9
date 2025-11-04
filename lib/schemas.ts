import { z } from "zod";

/**
 * Blueprint schema - describes the app structure and plan
 */
export const BlueprintSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  pages: z.array(z.string()).optional(),
  components: z.array(z.string()).optional(),
  routes: z.array(z.string()).optional(),
  tech: z
    .object({
      framework: z.string(),
      ui: z.string().optional(),
    })
    .optional(),
  notes: z.string().optional(),
});

export type Blueprint = z.infer<typeof BlueprintSchema>;

/**
 * Generated file schema
 */
export const GeneratedFileSchema = z.object({
  path: z.string().min(1),
  language: z.string().optional(),
  purpose: z.string().optional(),
  contents: z.string(),
});

export type GeneratedFile = z.infer<typeof GeneratedFileSchema>;

/**
 * File chunk schema - used when streaming file data
 */
export const FileChunkSchema = z.object({
  type: z.literal("file"),
  file: GeneratedFileSchema,
});

/**
 * File update schema - for incremental refinements
 */
export const FileUpdateSchema = z.object({
  type: z.literal("file_update"),
  file: z.object({
    path: z.string(),
    diff: z.string().optional(),
    contents: z.string().optional(),
  }),
});

/**
 * Status message schema
 */
export const StatusMessageSchema = z.object({
  type: z.literal("status"),
  message: z.string(),
});

/**
 * Blueprint message schema
 */
export const BlueprintMessageSchema = z.object({
  type: z.literal("blueprint"),
  blueprint: BlueprintSchema,
});

/**
 * Completion metrics
 */
export const CompleteMessageSchema = z.object({
  type: z.literal("complete"),
  metrics: z
    .object({
      tokens: z.number().optional(),
      files: z.number().optional(),
    })
    .optional(),
});

/**
 * Error message schema
 */
export const ErrorMessageSchema = z.object({
  type: z.literal("error"),
  message: z.string(),
  details: z.string().optional(),
});

/**
 * Discriminated union of all possible stream messages
 */
export const StreamMessageSchema = z.discriminatedUnion("type", [
  StatusMessageSchema,
  BlueprintMessageSchema,
  FileChunkSchema,
  FileUpdateSchema,
  CompleteMessageSchema,
  ErrorMessageSchema,
]);

export type StreamMessage = z.infer<typeof StreamMessageSchema>;

/**
 * API request schema
 */
export const GenerateRequestSchema = z.object({
  prompt: z.string().min(1),
  intent: z.enum(["new", "refine"]).optional().default("new"),
  targetFile: z.string().optional(),
  model: z.string().optional(),
  currentFiles: z.array(GeneratedFileSchema).optional(),
});

export type GenerateRequest = z.infer<typeof GenerateRequestSchema>;
