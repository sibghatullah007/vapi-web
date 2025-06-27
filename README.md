# Vapi Web Widget

A Next.js application that provides a voice AI widget with call analysis capabilities using Vapi and OpenAI.

## Features

- 🎤 Voice AI integration with Vapi
- 📊 Real-time call transcript collection
- 🤖 AI-powered call performance analysis
- 📱 Responsive widget design
- 🔒 Secure API key management
- 📄 Call reports with detailed feedback

## Setup

### 1. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Vapi API Configuration
NEXT_PUBLIC_VAPI_API_KEY=your_vapi_api_key_here
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_vapi_assistant_id_here

# OpenAI API Configuration
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
```

### 2. Installation

```bash
npm install
```

### 3. Development

```bash
npm run dev
```

### 4. Build

```bash
npm run build
```

## Usage

### Main Page
- Visit `/` for the main application
- Features a centered call button with modal report

### Embed Widget
- Visit `/embed` for the embeddable widget
- Can be embedded in other websites via iframe

### Iframe Embed
```html
<iframe
  src="https://your-domain.vercel.app/embed"
  width="400"
  height="500"
  style="border:none;"
  allow="camera; microphone; clipboard-write; fullscreen; publickey-credentials-get"
></iframe>
```

## Call Analysis

The application analyzes calls based on 5 criteria:
1. **Tone & Friendliness** - Warmth and confidence
2. **Insurance Handling** - Insurance knowledge and clarity
3. **Appointment Offer** - Scheduling effectiveness
4. **Clarity & Next Steps** - Call clarity and next steps
5. **Call Closing** - Proper call conclusion

Each criterion is scored 1-10, with an overall average score and coaching feedback.

## Security

- API keys are stored in environment variables
- `.env*` files are automatically ignored by git
- Use `NEXT_PUBLIC_` prefix for client-side access

## Deployment

The application is configured for Vercel deployment. Environment variables should be set in your Vercel project settings.

## Technologies

- Next.js 14
- React 18
- TypeScript
- Vapi Web SDK
- OpenAI API
- Tailwind CSS
