This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Environment Variables

For the application to function locally or in production, ensure the following environment variables are set in your `.env` (or `.env.local`) file:

```env
# Database
DATABASE_URL="postgres://user:password@host:port/db"

# Authentication (Better-Auth)
BETTER_AUTH_SECRET="your_secret_here"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# AI Generation
GEMINI_API_KEY="your_google_gemini_api_key"

# Stripe (Optional for local dev, Required for production)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRO_PRICE_ID="price_..."
```

> **Note:** If Stripe keys are omitted in development mode, the app will simulate a successful upgrade when clicking "Upgrade to Pro."

## Deploy on Vercel or Render

This application works perfectly out-of-the-box on Next.js hosting platforms like Vercel. 
To deploy:
1. Push your code to a GitHub repository.
2. Link the repository to your Vercel/Render account.
3. Supply **all** the production environment variables listed above in your hosting provider's dashboard.
4. Set `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` to your production domain (e.g., `https://your-domain.com`).
5. Update your Stripe webhook endpoint in the Stripe Dashboard to point to `https://your-domain.com/api/webhooks/stripe`.
