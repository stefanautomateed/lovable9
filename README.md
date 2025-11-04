# VibeSDK MVP

A simplified AI app builder running entirely on Vercel using Next.js and OpenAI GPT-5 Nano. Generate stunning, design-rich React web applications with WOW factor from plain-English descriptions, complete with live in-browser preview.

## Features

- **AI-Powered Generation**: Describe any web app and get a complete, visually stunning React application
- **Design-Rich Components**: Modern gradients, animations, glassmorphism, and micro-interactions
- **Structured Blueprint**: Generates a detailed implementation plan before coding
- **File Explorer**: Browse and view all generated files in a tree structure
- **Code Viewer**: Monaco editor integration for syntax-highlighted code viewing
- **Live Preview**: In-browser preview using Sandpack (no server-side sandbox needed)
- **Iterative Refinement**: Chat back to refine and regenerate files incrementally
- **Session Persistence**: Your work is saved in localStorage and restored on reload
- **WOW Factor Design**: Landing pages with impressive hero sections, testimonials, pricing, and CTAs

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **AI**: OpenAI GPT-5 Nano (fast, cost-efficient, 400K context window)
- **Preview**: Sandpack (@codesandbox/sandpack-react)
- **Code Editor**: Monaco Editor (@monaco-editor/react)
- **Validation**: Zod for runtime type safety
- **Notifications**: Sonner for toast messages
- **Deployment**: Vercel (serverless functions only)

## GPT-5 Nano

This project uses **GPT-5 Nano**, OpenAI's fastest and most cost-efficient version of GPT-5:

- **Speed**: Very fast response times for quick generation
- **Cost**: Only $0.05/1M input tokens, $0.40/1M output tokens
- **Context**: 400,000 token context window
- **Output**: Up to 128,000 max output tokens
- **Perfect for**: Code generation, instruction following, and design-rich UI creation

## Project Structure

```
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts          # Streaming NDJSON API endpoint
│   ├── globals.css               # Tailwind CSS
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main UI with state orchestration
├── components/
│   ├── ChatInput.tsx             # Prompt input component
│   ├── BlueprintView.tsx         # Blueprint display
│   ├── FileTree.tsx              # File explorer
│   ├── CodeViewer.tsx            # Monaco editor integration
│   └── PreviewPanel.tsx          # Sandpack preview
├── lib/
│   ├── openai.ts                 # OpenAI client wrapper
│   ├── schemas.ts                # Zod schemas
│   ├── sandpackAdapter.ts        # File format conversion
│   └── storage.ts                # localStorage utilities
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ or 20+
- npm, yarn, or pnpm
- OpenAI API key

### Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd lovable9
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-5-nano
```

You can get an OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys).

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm run start
```

## Deployment to Vercel

### Option 1: Vercel CLI

1. **Install Vercel CLI**

```bash
npm i -g vercel
```

2. **Deploy**

```bash
vercel
```

3. **Set environment variables**

```bash
vercel env add OPENAI_API_KEY
vercel env add OPENAI_MODEL
```

4. **Deploy to production**

```bash
vercel --prod
```

### Option 2: Vercel Dashboard

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your repository
5. Add environment variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `OPENAI_MODEL`: `gpt-4o-mini` (or your preferred model)
6. Click "Deploy"

## Usage

### Creating a New App

1. Enter a plain-English description of your app in the chat input
2. Press Enter or click "Generate"
3. Watch as the AI:
   - Generates a blueprint
   - Creates source files
   - Updates the live preview

### Example Prompts

- "A simple todo list app with add, complete, and delete functionality"
- "A weather dashboard that shows current conditions"
- "A landing page for a SaaS product with hero, features, and pricing sections"
- "A calculator app with basic arithmetic operations"
- "A countdown timer with start, pause, and reset buttons"

### Refining Your App

Once an app is generated, you can refine it:

1. Enter a refinement request like:
   - "Make the buttons bigger and blue"
   - "Add a dark mode toggle"
   - "Change the layout to use a sidebar"
2. The AI will update the relevant files
3. The preview will refresh automatically

### Starting Over

Click the "New App" button in the header to clear the current session and start fresh.

## Data Flow

### API Streaming Protocol

The `/api/generate` endpoint returns NDJSON (newline-delimited JSON) with these message types:

```typescript
// Status update
{"type":"status","message":"Starting generation..."}

// Blueprint
{"type":"blueprint","blueprint":{"title":"...","description":"...","pages":[...]}}

// File
{"type":"file","file":{"path":"src/App.tsx","contents":"..."}}

// File update (for refinements)
{"type":"file_update","file":{"path":"src/App.tsx","contents":"..."}}

// Completion
{"type":"complete","metrics":{"tokens":1234,"files":7}}

// Error
{"type":"error","message":"Something went wrong","details":"..."}
```

### Client State Machine

```
idle → generating → complete → (refine) → generating → complete
  ↓                    ↓
error ← ← ← ← ← ← ← error
```

## Architecture

### Serverless API

- **Runtime**: Edge (for better streaming support)
- **Endpoint**: `/api/generate`
- **Method**: POST
- **Input**: `{ prompt, intent, currentFiles?, model? }`
- **Output**: NDJSON stream

### Two-Step Generation

1. **Blueprint Generation**: Uses OpenAI with `response_format: "json_object"` to generate a structured plan
2. **File Generation**: Uses streaming to generate files incrementally and display them as they arrive

### In-Browser Preview

- Uses Sandpack to run the generated React app entirely in the browser
- No server-side sandbox required
- Files are converted to Sandpack format with default fallbacks
- Validates that required files exist (index.tsx, App.tsx, package.json)

### State Persistence

- Session data (blueprint + files) saved to localStorage
- Automatically restored on page reload
- No server-side storage required for MVP

## Configuration

### Changing the AI Model

Edit `.env.local`:

```env
OPENAI_MODEL=gpt-4o-mini      # Fast and cheap
# OPENAI_MODEL=gpt-4-turbo     # More capable
# OPENAI_MODEL=gpt-4           # Best quality
```

### Adjusting Generation Parameters

Edit `app/api/generate/route.ts`:

```typescript
const response = await client.createChatCompletion({
  model,
  temperature: 0.7,    // Creativity (0.0-2.0)
  max_tokens: 4000,    // Max output length
  // ...
});
```

## Known Limitations

### Current MVP Limitations

- **No authentication**: Anyone with the URL can use the app
- **No rate limiting**: Implement rate limiting for production (see notes below)
- **No persistent storage**: Sessions are only in localStorage
- **No server-side code**: Generated apps are client-only React
- **Single user**: No multi-user collaboration
- **No version history**: Can't go back to previous generations
- **No file editing**: Code viewer is read-only (refinement via chat only)

### Production Considerations

#### Rate Limiting

For production, implement rate limiting using one of:

1. **Vercel KV + @upstash/ratelimit**:
```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(10, "1 h"),
});

const { success } = await ratelimit.limit(ip);
if (!success) {
  return new Response("Rate limit exceeded", { status: 429 });
}
```

2. **Upstash Redis**:
   - Add `@upstash/redis` dependency
   - Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` env vars

3. **Simple in-memory rate limiting** (resets on function cold start):
```typescript
const requestCounts = new Map<string, { count: number; reset: number }>();
// Implement fixed-window per IP
```

#### Abuse Prevention

- Add CAPTCHA (hCaptcha, Turnstile) for public deployments
- Implement authentication (NextAuth.js)
- Monitor OpenAI API usage and set billing alerts
- Add input validation and sanitization
- Limit prompt length (e.g., 500 characters)

## Troubleshooting

### "OpenAI API key is required" Error

Ensure `.env.local` exists and contains your API key:

```env
OPENAI_API_KEY=sk-...
```

Restart the dev server after adding environment variables.

### Preview Not Loading

Check the browser console for errors. Common issues:

- Missing required files (index.tsx, App.tsx)
- Syntax errors in generated code
- Incompatible dependencies

The preview will show warnings if validation fails.

### Streaming Not Working

Ensure you're using Edge runtime in `app/api/generate/route.ts`:

```typescript
export const runtime = "edge";
```

### Build Errors

If you encounter type errors during build:

```bash
rm -rf .next node_modules
npm install
npm run build
```

## Next Steps

After validating the MVP, consider adding:

1. **Authentication & Authorization**
   - NextAuth.js with GitHub/Google
   - User sessions and project management

2. **Persistent Storage**
   - Vercel Postgres or Supabase
   - Save/load projects by ID
   - Share projects via URL

3. **Enhanced Editing**
   - In-editor file editing
   - Diff view for changes
   - Undo/redo functionality

4. **Export Options**
   - Download as ZIP
   - GitHub integration (create repo)
   - Deploy to Vercel

5. **Advanced Features**
   - Templates/starter kits
   - Component library
   - Multi-file refinement
   - Image generation integration

6. **Multi-Provider Support**
   - Anthropic Claude
   - Google Gemini
   - Local models (Ollama)

## Contributing

This is an MVP project. Contributions welcome!

## License

MIT

## Support

For issues and questions, please check:

1. This README
2. Console logs (browser and server)
3. OpenAI API status page
4. Vercel deployment logs

---

**Built with Next.js, OpenAI, and Sandpack on Vercel** 🚀
