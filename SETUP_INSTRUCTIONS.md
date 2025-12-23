# 🚀 Portfolio Setup Instructions

## 📋 **Step 1: Install Dependencies**

Run this command in your terminal:

```bash
pnpm install
```

This will install the Mistral AI SDK and other dependencies.

## 🔐 **Step 2: Set Up Environment Variables**

Create a file called `.env.local` in your project root with this content:

```env
# Mistral AI API Configuration
MISTRAL_API_KEY=your_actual_mistral_api_key_here

# Environment
NODE_ENV=development
```

**Replace `your_actual_mistral_api_key_here` with your real Mistral API key.**

## 🎯 **Step 3: Test Locally**

Run the development server:

```bash
pnpm dev
```

Visit `http://localhost:3000` to test your portfolio.

## 🚀 **Step 4: Deploy to Vercel**

1. **Push to GitHub** (if not already done)
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variable: `MISTRAL_API_KEY` with your API key
3. **Deploy!**

## ✅ **What's Included:**

- ✅ **Personal Information**: Customizable portfolio information
- ✅ **Contact Details**: Email, phone, LinkedIn, GitHub, Instagram
- ✅ **AI Personality**: Customizable AI assistant
- ✅ **API Integration**: Mistral AI integration
- ✅ **Professional Experience**: Portfolio projects and experience
- ✅ **Skills**: Data science, AI, machine learning focus

## 🎨 **Next Steps:**

1. **Add your projects** (Update the projects data)
2. **Customize colors** (if desired)
3. **Add your own logo** (when ready)
4. **Test the AI chat** functionality

## 🔧 **Troubleshooting:**

If you see linter errors about missing modules:
1. Make sure you ran `pnpm install`
2. Restart your development server
3. The errors should disappear after installation
