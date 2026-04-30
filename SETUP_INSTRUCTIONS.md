# Portfolio Setup Instructions

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Environment Variables

Create a file called `.env.local` in your project root:

```env
# DeepSeek (OpenAI-compatible) API key used by /api/chat
DEEPSEEK_API_KEY=your_deepseek_api_key_here

# Optional: used by some UI/actions
GITHUB_TOKEN=

# Optional: voice features
ELEVENLABS_API_KEY=
ELEVENLABS_VOICE_ID=
```

## Step 3: Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000`.

## Step 4: Deploy (Vercel)

- Add `DEEPSEEK_API_KEY` as an environment variable in Vercel.
- Deploy as a standard Next.js app.

## Troubleshooting

- Missing modules: rerun `npm install` then restart `npm run dev`.
- Chat errors: confirm `DEEPSEEK_API_KEY` is set and the server console shows `/api/chat` requests.
