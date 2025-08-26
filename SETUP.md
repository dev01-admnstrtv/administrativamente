# Manual Setup Guide - Administrativa(mente) Blog

Since npm install is experiencing issues, here's how to set up the project manually:

## 🚨 Current Issue
There's a dependency conflict with the package versions. Here's how to resolve it:

### Option 1: Use Yarn (Recommended)
```bash
# Remove package-lock.json if it exists
rm package-lock.json

# Install Yarn if you don't have it
npm install -g yarn

# Install dependencies with Yarn
yarn install

# Start development server
yarn dev
```

### Option 2: Fix npm Dependencies
1. **Update package.json** with these working versions:
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0", 
    "next": "^14.2.5",
    "@notionhq/client": "^2.2.16",
    "zod": "^3.23.8",
    "lucide-react": "^0.400.0",
    "framer-motion": "^11.0.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.3.0"
  },
  "devDependencies": {
    "typescript": "^5.4.5",
    "@types/node": "^20.12.7",
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.0",
    "tailwindcss": "^3.4.3",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "@tailwindcss/typography": "^0.5.13",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.5",
    "dotenv": "^16.4.5"
  }
}
```

2. **Clear npm cache and reinstall**:
```bash
npm cache clean --force
rm -rf node_modules
rm package-lock.json
npm install
```

### Option 3: Quick Start (Minimal)
For now, you can manually install just the essential packages:

```bash
# Core dependencies
npm install react@^18 react-dom@^18 next@^14.2.5

# Notion integration
npm install @notionhq/client@^2.2.16 dotenv@^16.4.5

# Development
npm install -D typescript@^5 @types/node@^20 @types/react@^18
```

## 🔧 Configure Environment

1. **Copy environment template**:
```bash
cp .env.local.example .env.local
```

2. **Edit `.env.local`** with your Notion credentials:
```bash
# Replace these with your actual values
NOTION_TOKEN=secret_your_actual_token_here
NOTION_DATABASE_ID=your_actual_database_id_here
```

## 🧪 Test Notion Configuration

Once you have the basic dependencies installed:

```bash
# Test Notion connection
npm run validate-notion

# Or run directly
node scripts/validate-notion.js
```

## 🚀 Start Development

```bash
# Start the development server
npm run dev

# Test the health check
curl http://localhost:3000/api/health
```

## 📚 Next Steps

1. Follow the complete Notion setup tutorial: `docs/notion-setup.md`
2. Use the ready-to-import templates: `docs/notion-templates.md`
3. Configure your databases as specified in the tutorials
4. Run the validation script to confirm everything works

## 🆘 If Problems Persist

The project structure is complete and all code files are ready. The only issue is the npm dependency installation. You can:

1. **Use a different Node version** (try Node 18 LTS)
2. **Use yarn instead of npm**
3. **Install dependencies manually** one by one
4. **Skip dependencies for now** and focus on Notion configuration

All the core functionality (Notion integration, TypeScript types, validation scripts) is implemented and ready to use once dependencies are resolved.